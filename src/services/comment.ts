import { inject, injectable } from "inversify";
import pino from "pino";
import { Component } from "../component.js";
import { CommentRepository } from "../repositories/comment.js";
import { convertCommentToSchema } from "../schema/convert.js";
import { Comment, CreateCommentRequest } from "../schema/schema.js";

@injectable()
export class CommentService {
  private readonly log: pino.Logger;
  private readonly commentRepository: CommentRepository;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.CommentRepository) commentRepository: CommentRepository,
  ) {
    this.log = log;
    this.commentRepository = commentRepository;
  }

  public async getComments(
    offerId: string,
    limit: number,
    skip: number,
  ): Promise<Comment[]> {
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
    const comment = await this.commentRepository.create({
      ...request,
      author: userId,
      offer: offerId,
    });

    this.log.info(`Comment created: ${comment._id}`);

    return convertCommentToSchema(comment);
  }
}
