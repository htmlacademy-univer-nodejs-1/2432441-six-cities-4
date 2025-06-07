import { NextFunction, Request, Response } from "express";
import { Middleware } from "./interface.js";

import mimetypes from "mime-types";
import multer, { Multer } from "multer";
import { nanoid } from "nanoid";

export class FileUploader implements Middleware {
  private multer: Multer;

  constructor(
    private name: string,
    destination: string,
    alowedTypes: string[],
    maxSize: number,
  ) {
    const storage = multer.diskStorage({
      destination: destination,
      filename(_req, file, cb) {
        const ext = mimetypes.extension(file.mimetype);
        cb(null, `${name}-${nanoid()}.${ext}`);
      },
    });

    this.multer = multer({
      storage: storage,
      fileFilter: (_req, file, cb) =>
        cb(null, alowedTypes.includes(file.mimetype)),
      limits: {
        fileSize: maxSize,
      },
    });
  }

  public handle(req: Request, res: Response, next: NextFunction) {
    this.multer.single(this.name)(req, res, next);
  }
}
