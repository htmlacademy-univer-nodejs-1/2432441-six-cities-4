import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { CommentService } from "../../services/comment.js";
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
  ) {
    super(logger);

    const offerIdValidator = new ObjectIdParamValidator("offerId");
    this.addGet("/", this.list, offerIdValidator);
    this.addPost(
      "/",
      this.create,
      offerIdValidator,
      new RequestValidator(CreateCommentRequestSchema),
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
