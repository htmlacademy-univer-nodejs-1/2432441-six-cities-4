import mongoose from "mongoose";
import pino from "pino";
import { Component } from "../component.js";
import { inject, injectable } from "inversify";

@injectable()
export class Database {
  private readonly log: pino.Logger;
  private connection: mongoose.Connection | null = null;

  constructor(@inject(Component.Log) log: pino.Logger) {
    this.log = log;
  }

  public getConnection(): mongoose.Connection {
    if (!this.connection) {
      throw new Error("Database connection not initialized");
    }
    return this.connection;
  }

  public async connect(uri: string): Promise<void> {
    try {
      this.log.info("Connecting to MongoDB...");
      this.connection = await mongoose.createConnection(uri).asPromise();
      this.log.info("Successfully connected to MongoDB");
    } catch (error) {
      this.log.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.connection) {
      return;
    }
    try {
      await this.connection.close();
      this.log.info("Disconnected from MongoDB");
      this.connection = null;
    } catch (error) {
      this.log.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }
}
