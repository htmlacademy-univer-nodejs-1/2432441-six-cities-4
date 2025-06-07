import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { ApiError } from "../errors/api-error.js";
import { Component } from "../../component.js";
import { Middleware } from "./interface.js";

@injectable()
export class ExceptionFilter implements Middleware {
  constructor(@inject(Component.Log) private readonly logger: Logger) {}

  public handle(
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void {
    if (err instanceof ApiError) {
      this.logger.warn(`[${err.code}] ${err.message}`);
      res.status(err.code).json({
        error: err.message,
      });
      return;
    }

    this.logger.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
}
