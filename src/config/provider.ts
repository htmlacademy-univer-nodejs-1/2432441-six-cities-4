import dotenv from "dotenv";
import { inject, injectable } from "inversify";
import pino from "pino";
import { Component } from "../component.js";
import schema from "./schema.js";
import { Config } from "./types.js";

@injectable()
export class ConfigProvider {
  private readonly log: pino.Logger;
  private config!: Config;

  constructor(@inject(Component.Log) log: pino.Logger) {
    this.log = log;
    this.load();
  }

  public get(): Config {
    return this.config;
  }

  private load() {
    dotenv.config();

    schema.load({});
    schema.validate({ allowed: "strict", output: this.log.info });

    this.config = schema.get();
  }
}
