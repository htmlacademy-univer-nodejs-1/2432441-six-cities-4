import { Container } from "inversify";
import { pino } from "pino";
import { Application } from "./app/application.js";
import { CommentController } from "./app/controllers/comment.js";
import { FavouriteController } from "./app/controllers/favourite.js";
import { OfferController } from "./app/controllers/offer.js";
import { UserController } from "./app/controllers/user.js";
import { Component } from "./component.js";
import { ConfigProvider } from "./config/provider.js";
import { Database } from "./database/database.js";
import { Importer } from "./importer/importer.js";
import { CommentRepository } from "./repositories/comment.js";
import { OfferRepository } from "./repositories/offer.js";
import { UserRepository } from "./repositories/user.js";
import { CommentService } from "./services/comment.js";
import { FavouriteService } from "./services/favourite.js";
import { OfferService } from "./services/offer.js";
import { UserService } from "./services/user.js";

export class DIContainer {
  private container: Container;

  constructor() {
    this.container = new Container();

    const log = pino();
    this.configure(log);
  }

  public getApplication(): Application {
    return this.container.get(Component.Application);
  }

  public getImporter(): Importer {
    return this.container.get(Component.Importer);
  }

  public getDatabaseClient(): Database {
    return this.container.get(Component.Database);
  }

  public getConfigProvider(): ConfigProvider {
    return this.container.get(Component.ConfigProvider);
  }

  private configure(log: pino.Logger) {
    this.container.bind(Component.Log).toConstantValue(log);
    this.container.bind(Component.Database).to(Database).inSingletonScope();
    this.container.bind(Component.Importer).to(Importer).inSingletonScope();
    this.container
      .bind(Component.ConfigProvider)
      .to(ConfigProvider)
      .inSingletonScope();

    this.configureControllers();
    this.configureRepositories();
    this.configureServices();

    this.container
      .bind(Component.Application)
      .to(Application)
      .inSingletonScope();
  }

  private configureServices() {
    this.container
      .bind(Component.OfferService)
      .to(OfferService)
      .inSingletonScope();
    this.container
      .bind(Component.UserService)
      .to(UserService)
      .inSingletonScope();
    this.container
      .bind(Component.CommentService)
      .to(CommentService)
      .inSingletonScope();
    this.container
      .bind(Component.FavouriteService)
      .to(FavouriteService)
      .inSingletonScope();
  }

  private configureRepositories() {
    this.container
      .bind(Component.OfferRepository)
      .to(OfferRepository)
      .inSingletonScope();
    this.container
      .bind(Component.UserRepository)
      .to(UserRepository)
      .inSingletonScope();
    this.container
      .bind(Component.CommentRepository)
      .to(CommentRepository)
      .inSingletonScope();
  }

  private configureControllers() {
    this.container
      .bind(Component.OfferController)
      .to(OfferController)
      .inSingletonScope();
    this.container
      .bind(Component.UserController)
      .to(UserController)
      .inSingletonScope();
    this.container
      .bind(Component.FavouriteController)
      .to(FavouriteController)
      .inSingletonScope();
    this.container
      .bind(Component.CommentController)
      .to(CommentController)
      .inSingletonScope();
  }
}
