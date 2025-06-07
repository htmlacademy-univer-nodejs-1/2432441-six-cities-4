import { NextFunction, Request, Response } from "express";
import { Middleware } from "./interface.js";

type GetByIdAsync<T> = (id: string) => Promise<T>;

export class ObjectExistsValidator<T> implements Middleware {
  constructor(
    private paramName: string,
    private getFunc: GetByIdAsync<T>,
  ) {}

  public async handle(req: Request, _res: Response, next: NextFunction) {
    const param = req.params[this.paramName];
    await this.getFunc(param);

    next();
  }
}
