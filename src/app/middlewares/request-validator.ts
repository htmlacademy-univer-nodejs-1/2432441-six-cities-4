import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { ApiError } from "../errors/api-error.js";
import { Middleware } from "./interface.js";

export class RequestValidator<T> implements Middleware {
  constructor(private schema: Joi.Schema<T>) {}

  public handle(req: Request, _res: Response, next: NextFunction): void {
    const result = this.schema.validate(req.body);
    if (result.error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, result.error.message);
    }
    next();
  }
}
