import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { ApiError } from "../errors/api-error.js";
import { Middleware } from "./interface.js";

export class ObjectIdParamValidator implements Middleware {
  constructor(private paramName: string) {}

  public handle(req: Request, _res: Response, next: NextFunction): void {
    const param = req.params[this.paramName];
    if (!Types.ObjectId.isValid(param)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Provided ${this.paramName} is not valid ObjectId`,
      );
    }
    next();
  }
}
