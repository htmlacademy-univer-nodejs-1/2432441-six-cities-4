import { RequestHandler, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { Middleware } from "../middlewares/interface.js";

export abstract class BaseController {
  public readonly router: Router = Router({ mergeParams: true });
  protected readonly logger: Logger;

  constructor(@inject(Component.Log) logger: Logger) {
    this.logger = logger;
  }

  protected addGet(
    path: string,
    handler: RequestHandler,
    ...middlewares: Middleware[]
  ) {
    this.router.get(
      path,
      ...middlewares.map((m) => m.handle.bind(m)),
      asyncHandler(handler.bind(this)),
    );
  }

  protected addPost(
    path: string,
    handler: RequestHandler,
    ...middlewares: Middleware[]
  ) {
    this.router.post(
      path,
      ...middlewares.map((m) => m.handle.bind(m)),
      asyncHandler(handler.bind(this)),
    );
  }

  protected addPatch(
    path: string,
    handler: RequestHandler,
    ...middlewares: Middleware[]
  ) {
    this.router.patch(
      path,
      ...middlewares.map((m) => m.handle.bind(m)),
      asyncHandler(handler.bind(this)),
    );
  }

  protected addDelete(
    path: string,
    handler: RequestHandler,
    ...middlewares: Middleware[]
  ) {
    this.router.delete(
      path,
      ...middlewares.map((m) => m.handle.bind(m)),
      asyncHandler(handler.bind(this)),
    );
  }

  protected send<T>(res: Response, statusCode: number, data: T): void {
    res.status(statusCode).json(data);
  }

  protected ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  protected created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  protected noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
