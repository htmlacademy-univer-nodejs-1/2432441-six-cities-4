import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { CommentService } from "../../services/comment.js";
import { OfferService } from "../../services/offer.js";
import { ObjectExistsValidator } from "../middlewares/object-exists-validator.js";
import { ObjectIdParamValidator } from "../middlewares/objectid-validator.js";
import { RequestValidator } from "../middlewares/request-validator.js";
import { CreateCommentRequestSchema } from "../validators/comment.js";
import { BaseController } from "./base.js";

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Log) logger: Logger,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    const offerIdParamName = "offerId";
    const offerIdValidator = new ObjectIdParamValidator(offerIdParamName);
    const offerExistsValidator = new ObjectExistsValidator(
      offerIdParamName,
      (id) => this.offerService.getOffer(undefined, id),
    );

    this.addGet("/", this.list, offerIdValidator, offerExistsValidator);
    this.addPost(
      "/",
      this.create,
      offerIdValidator,
      new RequestValidator(CreateCommentRequestSchema),
      offerExistsValidator,
    );
  }

  private async list(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const offerId = req.params["offerId"];

    const comments = await this.commentService.getComments(
      offerId,
      limit,
      skip,
    );
    this.ok(res, comments);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const offerId = req.params["offerId"];
    const comment = await this.commentService.createComment(
      "user id from auth middleware",
      offerId,
      req.body,
    );
    this.created(res, comment);
  }
}
