import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./base.js";
import asyncHandler from "express-async-handler";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { UserService } from "../../services/user.js";

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);
  }

  public getRouter(): Router {
    const router = Router();

    router.post("/", asyncHandler(this.create.bind(this)));
    router.post("/login", asyncHandler(this.login.bind(this)));
    router.get("/check", asyncHandler(this.checkAuth.bind(this)));

    return router;
  }

  private async create(req: Request, res: Response): Promise<void> {
    this.logger.info(req.body);
    const user = await this.userService.createUser(req.body);
    this.created(res, user);
  }

  private async login(req: Request, res: Response): Promise<void> {
    const loginResponse = await this.userService.login(req.body);
    this.ok(res, loginResponse);
  }

  private async checkAuth(_: Request, res: Response): Promise<void> {
    // const user = await this.userService.getUser(req.user.id);
    this.ok(res, {});
  }
}
