import mongoose from "mongoose";
import pino from "pino";
import { Component } from "../component.js";
import { inject } from "inversify";

export class Database {
  private log: pino.Logger;

  constructor(@inject(Component.Log) log: pino.Logger) {
    this.log = log;
  }

  public async connect(uri: string): Promise<void> {
    try {
      this.log.info("Connecting to MongoDB...");
      await mongoose.connect(uri);

      this.log.info("Successfully connected to MongoDB");
    } catch (error) {
      this.log.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.log.info("Disconnected from MongoDB");
    } catch (error) {
      this.log.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }
}
