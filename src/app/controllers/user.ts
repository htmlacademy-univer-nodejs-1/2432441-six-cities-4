import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { ConfigProvider } from "../../config/provider.js";
import { UserService } from "../../services/user.js";
import { ApiError } from "../errors/api-error.js";
import { MiddlewareFactory } from "../middlewares/factory.js";
import { CreateUserRequestSchema } from "../validators/user.js";
import { BaseController } from "./base.js";

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    @inject(Component.ConfigProvider) configProvider: ConfigProvider,
    @inject(Component.MiddlewareFactory) middlewareFactory: MiddlewareFactory,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    const mustAuthMiddleware = middlewareFactory.userAuthenticator();

    this.addPost(
      "/",
      this.create,
      middlewareFactory.requestValidator(CreateUserRequestSchema),
    );
    this.addPost("/login", this.login);
    this.addGet("/check", this.get, mustAuthMiddleware);
    this.addPost(
      "/avatar",
      this.updateAvatar,
      mustAuthMiddleware,
      middlewareFactory.fileUploader(
        "avatar",
        configProvider.get().UPLOAD_DIR,
        ["image/png", "image/jpeg"],
        1024 * 1024 * 3,
      ),
    );
  }

  private async create(req: Request, res: Response): Promise<void> {
    const user = await this.userService.createUser(req.body);
    this.created(res, user);
  }

  private async login(req: Request, res: Response): Promise<void> {
    const response = await this.userService.login(req.body);
    this.ok(res, response);
  }

  private async get(req: Request, res: Response): Promise<void> {
    const user = await this.userService.getUser(req.user!._id);
    this.ok(res, user);
  }

  private async updateAvatar(req: Request, res: Response): Promise<void> {
    const file = req.file;
    if (!file)
      throw new ApiError(StatusCodes.BAD_REQUEST, "invalide file provided");

    await this.userService.updateAvatar(req.user!._id, file.filename);
    this.noContent(res);
  }
}
