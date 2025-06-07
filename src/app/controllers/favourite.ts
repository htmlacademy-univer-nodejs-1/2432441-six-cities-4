import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { FavouriteService } from "../../services/favourite.js";
import { MiddlewareFactory } from "../middlewares/factory.js";
import { BaseController } from "./base.js";

@injectable()
export class FavouriteController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    @inject(Component.MiddlewareFactory) middlewareFactory: MiddlewareFactory,
    @inject(Component.FavouriteService)
    private readonly favouriteService: FavouriteService,
  ) {
    super(logger);

    const offerIdValidator = middlewareFactory.objectIdValidator("offerId");
    const offerExistsValidator = middlewareFactory.offerExistsValidator();

    const mustAuthMiddleware = middlewareFactory.userAuthenticator();

    this.addGet("/", this.list, mustAuthMiddleware);
    this.addPost(
      "/:offerId",
      this.create,
      offerIdValidator,
      mustAuthMiddleware,
      offerExistsValidator,
    );
    this.addDelete(
      "/:offerId",
      this.remove,
      offerIdValidator,
      mustAuthMiddleware,
      offerExistsValidator,
    );
  }

  private async list(req: Request, res: Response): Promise<void> {
    const response = await this.favouriteService.getFavorites(req.user!._id);
    this.ok(res, response);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const response = await this.favouriteService.addToFavorites(
      req.user!._id,
      req.params["offerId"],
    );
    this.ok(res, response);
  }

  private async remove(req: Request, res: Response): Promise<void> {
    const response = await this.favouriteService.removeFromFavorites(
      req.user!._id,
      req.params["offerId"],
    );
    this.ok(res, response);
  }
}
