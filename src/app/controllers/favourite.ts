import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./base.js";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { ObjectIdParamValidator } from "../middlewares/objectid-validator.js";

@injectable()
export class FavouriteController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    // @inject(Component.FavouriteService)
    // private readonly favouriteService: FavouriteService,
    // @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    const offerIdValidator = new ObjectIdParamValidator("offerId");
    this.addGet("/", this.list);
    this.addPost("/:offerId", this.create, offerIdValidator);
    this.addGet("/:offerId", this.remove, offerIdValidator);
  }

  private async list(_: Request, res: Response): Promise<void> {
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
