import { inject } from "inversify";
import { pino } from "pino";
import { Component } from "../component.js";
import { ConfigProvider } from "../config/provider.js";

export class Application {
  private readonly log: pino.Logger;
  private readonly configProvider: ConfigProvider;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.ConfigProvider) configProvider: ConfigProvider,
  ) {
    this.log = log;
    this.configProvider = configProvider;
  }

  public init() {
    this.log.info("hello from init");

    const config = this.configProvider.get();
    this.log.info(`application port: ${config.PORT}`);
  }
}
