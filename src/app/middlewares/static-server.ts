import express, { NextFunction, Request, Response } from "express";
import { Middleware } from "./interface.js";

export class StaticServer implements Middleware {
  constructor(private readonly root: string) {}

  public handle(req: Request, res: Response, next: NextFunction): void {
    express.static(this.root)(req, res, next);
  }
}
