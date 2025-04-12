import { Container } from "inversify";
import { pino } from "pino";
import { ConfigProvider } from "./config/provider.js";
import { Component } from "./component.js";
import { Application } from "./app/app.js";

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
  }
}
