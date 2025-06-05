import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./base.js";
import asyncHandler from "express-async-handler";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { OfferService } from "../../services/offer.js";

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/", asyncHandler(this.list.bind(this)));
    router.post("/", asyncHandler(this.create.bind(this)));
    router.get("/:id", asyncHandler(this.get.bind(this)));
    router.patch("/:id", asyncHandler(this.update.bind(this)));
    router.delete("/:id", asyncHandler(this.delete.bind(this)));
    router.get("/premium/:city", asyncHandler(this.premium.bind(this)));

    return router;
  }

  private async list(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string, 10) || 60;
    const skip = parseInt(req.query.skip as string, 10) || 0;

    const offers = await this.offerService.getOffers(undefined, limit, skip);
    this.logger.info("??");
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
    const id = req.params["id"];
    const offers = await this.offerService.getOffer(undefined, id);
    this.ok(res, offers);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const id = req.params["id"];
    const offer = await this.offerService.updateOffer(id, req.body);
    this.ok(res, offer);
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const id = req.params["id"];
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
