import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./base.js";
import asyncHandler from "express-async-handler";
import { Logger } from "pino";
import { Component } from "../../component.js";

@injectable()
export class FavouriteController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    // @inject(Component.FavouriteService)
    // private readonly favouriteService: FavouriteService,
    // @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/", asyncHandler(this.get.bind(this)));
    router.post("/:offerId", asyncHandler(this.create.bind(this)));
    router.get("/:offerId", asyncHandler(this.remove.bind(this)));

    return router;
  }

  private async get(_: Request, res: Response): Promise<void> {
    // const response = await this.favouriteService.getFavorites(req.user.id);
    this.ok(res, {});
  }

  private async create(_: Request, res: Response): Promise<void> {
    // const userId = req.user.id;
    // const offerId = req.params["offerId"];
    // await this.favouriteService.addToFavorites(userId, offerId);
    // const response = await this.offerService.getOffer(userId, offerId)
    this.ok(res, {});
  }

  private async remove(_: Request, res: Response): Promise<void> {
    // const userId = req.user.id;
    // const offerId = req.params["offerId"];
    // const response = await this.favouriteService.removeFromFavorites(userId, offerId);
    this.ok(res, {});
  }
}
