import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { UserService } from "../../services/user.js";
import { RequestValidator } from "../middlewares/request-validator.js";
import { CreateUserRequestSchema } from "../validators/user.js";
import { BaseController } from "./base.js";

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.addPost(
      "/",
      this.create,
      new RequestValidator(CreateUserRequestSchema),
    );
    this.addPost("/login", this.login);
    this.addGet("/check", this.get);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const user = await this.userService.createUser(req.body);
    this.created(res, user);
  }

  private async login(req: Request, res: Response): Promise<void> {
    const loginResponse = await this.userService.login(req.body);
    this.ok(res, loginResponse);
  }

  private async get(_: Request, res: Response): Promise<void> {
    // const user = await this.userService.getUser(req.user.id);
    this.ok(res, {});
  }
}
