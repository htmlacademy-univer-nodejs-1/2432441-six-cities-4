import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { OfferService } from "../../services/offer.js";
import { MiddlewareFactory } from "../middlewares/factory.js";
import {
  CreateOfferRequestSchema,
  UpdateOfferRequestSchema,
} from "../validators/offer.js";
import { BaseController } from "./base.js";

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    @inject(Component.MiddlewareFactory) middlewareFactory: MiddlewareFactory,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    const offerIdValidator = middlewareFactory.objectIdValidator("offerId");
    const offerExistsValidator = middlewareFactory.offerExistsValidator();
    const mustAuthMiddleware = middlewareFactory.userAuthenticator(false);
    const canAuthMiddleware = middlewareFactory.userAuthenticator(true);

    this.addGet("/", this.list, canAuthMiddleware);
    this.addPost(
      "/",
      this.create,
      mustAuthMiddleware,
      middlewareFactory.requestValidator(CreateOfferRequestSchema),
    );
    this.addGet(
      "/:offerId",
      this.get,
      offerIdValidator,
      canAuthMiddleware,
      offerExistsValidator,
    );
    this.addPatch(
      "/:offerId",
      this.update,
      offerIdValidator,
      mustAuthMiddleware,
      middlewareFactory.requestValidator(UpdateOfferRequestSchema),
    );
    this.addDelete(
      "/:offerId",
      this.delete,
      offerIdValidator,
      mustAuthMiddleware,
      offerExistsValidator,
    );
    this.addGet("/premium/:city", this.premium, canAuthMiddleware);
  }

  private async list(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string, 10) || 60;
    const skip = parseInt(req.query.skip as string, 10) || 0;

    const offers = await this.offerService.getOffers(
      req.user?._id,
      limit,
      skip,
    );
    this.ok(res, offers);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.createOffer(req.user!._id, req.body);
    this.created(res, offer);
  }

  private async get(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getOffer(
      req.user?._id,
      req.params["offerId"],
    );
    this.ok(res, offers);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.updateOffer(
      req.user!._id,
      req.params["offerId"],
      req.body,
    );
    this.ok(res, offer);
  }

  private async delete(req: Request, res: Response): Promise<void> {
    await this.offerService.deleteOffer(req.user!._id, req.params["offerId"]);
    this.noContent(res);
  }

  private async premium(req: Request, res: Response): Promise<void> {
    const city = req.params["city"];
    const limit = parseInt(req.query.limit as string, 10) || 3;
    const offers = await this.offerService.getPremiumOffers(
      req.user?._id,
      city,
      limit,
      0,
    );
    this.ok(res, offers);
  }
}
