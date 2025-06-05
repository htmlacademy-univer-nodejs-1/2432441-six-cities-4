import express, { Express } from "express";
import { inject, injectable } from "inversify";
import { Component } from "../component.js";
import { Logger } from "pino";
import { ExceptionFilter } from "./middlewares/exception-filter.js";
import { ConfigProvider } from "../config/provider.js";
import { OfferController } from "./controllers/offer.js";
import { UserController } from "./controllers/user.js";
import { FavouriteController } from "./controllers/favourite.js";
import cors from "cors";

@injectable()
export class Application {
  private express: Express;

  constructor(
    @inject(Component.Log) private readonly logger: Logger,
    @inject(Component.ConfigProvider)
    private readonly configProvider: ConfigProvider,
    @inject(Component.ExceptionFilter)
    private readonly exceptionFilter: ExceptionFilter,
    @inject(Component.OfferController)
    private readonly offerController: OfferController,
    @inject(Component.UserController)
    private readonly userController: UserController,
    @inject(Component.FavouriteController)
    private readonly favouriteController: FavouriteController,
  ) {
    this.express = express();
  }

  public usePreMiddlewares() {
    this.express.use(cors());
    this.express.use(express.json());
  }

  public useControllers() {
    this.express.use("/offers", this.offerController.getRouter());
    this.express.use("/users", this.userController.getRouter());
    this.express.use("/users/favorites", this.favouriteController.getRouter());
  }

  public usePostMiddlewares() {
    this.express.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
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
}
