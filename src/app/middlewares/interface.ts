import { ErrorRequestHandler, RequestHandler } from "express";

export interface Middleware {
  handle: RequestHandler | ErrorRequestHandler;
}
