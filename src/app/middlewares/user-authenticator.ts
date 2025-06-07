import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ConfigProvider } from "../../config/provider.js";
import { decodeToken } from "../../helpers/jwt.js";
import { User } from "../../models/user.js";
import { UserRepository } from "../../repositories/user.js";
import { ApiError } from "../errors/api-error.js";
import { Middleware } from "./interface.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
export class UserAuthenticator implements Middleware {
  constructor(
    private readonly configProvider: ConfigProvider,
    private readonly userRepository: UserRepository,
    private readonly allowUnauthorized: boolean = false,
  ) {}

  public async handle(req: Request, _res: Response, next: NextFunction) {
    const token = this.getToken(req);
    if (!token) {
      if (this.allowUnauthorized) return next();
      throw new ApiError(StatusCodes.UNAUTHORIZED, "you must authorize first");
    }

    const userId = this.getUserId(token);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "authorized user does not exist",
      );
    }

    req.user = user;
    next();
  }

  private getToken(req: Request): string | null {
    const header = req.headers.authorization;
    if (!header) return null;

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;

    return parts[1];
  }

  private getUserId(token: string): string {
    const secret = this.configProvider.get().JWT_SECRET;
    const payload = decodeToken(secret, token);
    return payload.id;
  }
}
