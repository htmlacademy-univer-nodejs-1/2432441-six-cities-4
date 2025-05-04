import { Container } from "inversify";
import { pino } from "pino";
import { ConfigProvider } from "./config/provider.js";
import { Component } from "./component.js";
import { Application } from "./app/app.js";
import { Importer } from "./importer/importer.js";
import { Database } from "./database/database.js";
import { OfferRepository } from "./repositories/offer.js";
import { UserRepository } from "./repositories/user.js";

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

  private configure(log: pino.Logger) {
    this.container.bind(Component.Log).toConstantValue(log);

    this.container
      .bind(Component.ConfigProvider)
      .to(ConfigProvider)
      .inSingletonScope();

    this.container
      .bind(Component.Application)
      .to(Application)
      .inSingletonScope();

    this.container.bind(Component.Importer).to(Importer).inSingletonScope();

    this.container
      .bind(Component.OfferRepository)
      .to(OfferRepository)
      .inSingletonScope();

    this.container
      .bind(Component.UserRepository)
      .to(UserRepository)
      .inSingletonScope();

    this.container.bind(Component.Database).to(Database).inSingletonScope();
  }
}
