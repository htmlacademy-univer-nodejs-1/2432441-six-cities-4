import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { OfferService } from "../../services/offer.js";
import { ObjectExistsValidator } from "../middlewares/object-exists-validator.js";
import { ObjectIdParamValidator } from "../middlewares/objectid-validator.js";
import { RequestValidator } from "../middlewares/request-validator.js";
import {
  CreateOfferRequestSchema,
  UpdateOfferRequestSchema,
} from "../validators/offer.js";
import { BaseController } from "./base.js";

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    const offerIdParamName = "offerId";
    const offerIdValidator = new ObjectIdParamValidator(offerIdParamName);
    const offerExistsValidator = new ObjectExistsValidator(
      offerIdParamName,
      (id) => this.offerService.getOffer(undefined, id),
    );

    this.addGet("/", this.list);
    this.addPost(
      "/",
      this.create,
      new RequestValidator(CreateOfferRequestSchema),
    );
    this.addGet("/:offerId", this.get, offerIdValidator, offerExistsValidator);
    this.addPatch(
      "/:offerId",
      this.update,
      offerIdValidator,
      new RequestValidator(UpdateOfferRequestSchema),
    );
    this.addDelete(
      "/:offerId",
      this.delete,
      offerIdValidator,
      offerExistsValidator,
    );
    this.addGet("/premium/:city", this.premium);
  }

  private async list(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string, 10) || 60;
    const skip = parseInt(req.query.skip as string, 10) || 0;

    const offers = await this.offerService.getOffers(undefined, limit, skip);
    this.ok(res, offers);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.createOffer(
      "6841f89b089cd302e0a9f7c3",
      req.body,
    );
    this.created(res, offer);
  }

  private async get(req: Request, res: Response): Promise<void> {
    const id = req.params["offerId"];
    const offers = await this.offerService.getOffer(undefined, id);
    this.ok(res, offers);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const id = req.params["offerId"];
    const offer = await this.offerService.updateOffer(id, req.body);
    this.ok(res, offer);
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const id = req.params["offerId"];
    await this.offerService.deleteOffer(id);
    this.noContent(res);
  }

  private async premium(req: Request, res: Response): Promise<void> {
    const city = req.params["city"];
    const limit = parseInt(req.query.limit as string, 10) || 3;
    const offers = await this.offerService.getPremiumOffers(city, limit, 0);
    this.ok(res, offers);
  }
}
