import { getModelForClass } from "@typegoose/typegoose";
import { Comment } from "../models/comment.js";
import { inject, injectable } from "inversify";
import { Database } from "../database/database.js";
import { Component } from "../component.js";
import { Model } from "mongoose";

@injectable()
export class CommentRepository {
  private readonly model: Model<Comment>;

  constructor(@inject(Component.Database) database: Database) {
    this.model = getModelForClass(Comment, {
      existingConnection: database.getConnection(),
    });
  }

  async create(data: Partial<Comment>): Promise<Comment> {
    const comment = new this.model(data);
    return comment.save();
  }

  async findByOfferId(
    offerId: string,
    limit: number,
    skip: number,
  ): Promise<Comment[]> {
    return this.model
      .find({ offer: offerId })
      .populate("author")
      .skip(skip)
      .limit(limit)
      .exec();
  }
  

  async countAndRatingByOfferId(offerId: string): Promise<{ count: number; rating: number }> {
    const comments = await this.model.aggregate([
      { $match: { offerId: offerId } },
      { $group: { _id: "$offerId", count: { $sum: 1 }, rating: { $avg: "$rating" } } },
    ]);
    return comments[0] || { count: 0, rating: 0 };
  }

  async countAndRatingByOfferIds(
    offerIds: string[],
  ): Promise<Record<string, { count: number; rating: number }>> {
    const comments = await this.model.aggregate([
      { $match: { offerId: { $in: offerIds } } },
      { $group: { _id: "$offerId", count: { $sum: 1 }, rating: { $avg: "$rating" } } },
    ]);

    return offerIds.reduce(
      (acc, offerId) => {
        const comment = comments.find((com) => com._id === offerId);
        acc[offerId] = {
          count: comment?.count || 0,
          rating: comment?.rating || 0,
        };
        return acc;
      },
      {} as Record<string, { count: number; rating: number }>,
    );
  }
}
