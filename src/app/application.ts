import cors from "cors";
import express, { Express } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { Component } from "../component.js";
import { ConfigProvider } from "../config/provider.js";
import { BaseController } from "./controllers/base.js";
import { CommentController } from "./controllers/comment.js";
import { FavouriteController } from "./controllers/favourite.js";
import { OfferController } from "./controllers/offer.js";
import { UserController } from "./controllers/user.js";
import { ExceptionFilter } from "./middlewares/exception-filter.js";
import { Middleware } from "./middlewares/interface.js";
import { StaticServer } from "./middlewares/static-server.js";

@injectable()
export class Application {
  private express: Express;

  constructor(
    @inject(Component.Log) private readonly logger: Logger,
    @inject(Component.ConfigProvider)
    private readonly configProvider: ConfigProvider,
    @inject(Component.OfferController)
    private readonly offerController: OfferController,
    @inject(Component.UserController)
    private readonly userController: UserController,
    @inject(Component.FavouriteController)
    private readonly favouriteController: FavouriteController,
    @inject(Component.CommentController)
    private readonly commentController: CommentController,
  ) {
    this.express = express();
  }

  public usePreMiddlewares() {
    this.express.use(cors());
    this.express.use(express.json());
  }

  public useControllers() {
    this.addController("/offers", this.offerController);
    this.addController("/users", this.userController);
    this.addController("/users/favorites", this.favouriteController);
    this.addController("/offers/:offerId/comments", this.commentController);
  }

  public usePostMiddlewares() {
    this.addMiddleware(null, new ExceptionFilter(this.logger));
    this.addMiddleware(
      "/uploads",
      new StaticServer(this.configProvider.get().UPLOAD_DIR),
    );
  }

  public init() {
    this.usePreMiddlewares();
    this.useControllers();
    this.usePostMiddlewares();

    const port = this.configProvider.get().PORT;
    this.express.listen(port, () => {
      this.logger.info(`Server started on http://localhost:${port}`);
    });
  }

  private addController(route: string, controller: BaseController) {
    this.express.use(route, controller.router);
  }

  private addMiddleware(route: string | null, middleware: Middleware) {
    if (!route) this.express.use(middleware.handle.bind(middleware));
    else this.express.use(route, middleware.handle.bind(middleware));
  }
}
