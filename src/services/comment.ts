import { inject, injectable } from "inversify";
import { Component } from "../component.js";
import { CommentRepository } from "../repositories/comment.js";
import { Comment, CreateCommentRequest } from "../schema/schema.js";
import { OfferRepository } from "../repositories/offer.js";
import pino from "pino";
import { convertCommentToSchema } from "../schema/convert.js";

@injectable()
export class CommentService {
  private readonly log: pino.Logger;
  private readonly commentRepository: CommentRepository;
  private readonly offerRepository: OfferRepository;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.CommentRepository) commentRepository: CommentRepository,
    @inject(Component.OfferRepository) offerRepository: OfferRepository,
  ) {
    this.log = log;
    this.commentRepository = commentRepository;
    this.offerRepository = offerRepository;
  }

  public async getComments(
    offerId: string,
    limit: number,
    skip: number,
  ): Promise<Comment[]> {
    const offer = await this.offerRepository.findById(offerId);
    if (!offer) {
      throw new Error("Offer not found");
    }

    const comments = await this.commentRepository.findByOfferId(
      offerId,
      limit,
      skip,
    );
    return comments.map((comment) => convertCommentToSchema(comment));
  }

  public async createComment(
    userId: string,
    offerId: string,
    request: CreateCommentRequest,
  ): Promise<Comment> {
    const offer = await this.offerRepository.findById(offerId);
    if (!offer) {
      throw new Error("Offer not found");
    }

    const comment = await this.commentRepository.create({
      ...request,
      author: userId,
      offer: offerId,
    });

    this.log.info(`Comment created: ${comment._id}`);

    return convertCommentToSchema(comment);
  }
}
