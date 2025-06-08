import { getModelForClass } from "@typegoose/typegoose";
import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { Component } from "../component.js";
import { Database } from "../database/database.js";
import { Comment } from "../models/comment.js";

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
      .sort({ createdAt: -1 })
      .populate("author")
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async deleteByOfferId(offerId: string): Promise<void> {
    await this.model
      .deleteMany({
        offer: new Types.ObjectId(offerId),
      })
      .exec();
  }

  async countAndRatingByOfferId(
    offerId: string,
  ): Promise<{ count: number; rating: number }> {
    const result = await this.model.aggregate([
      { $match: { offer: new Types.ObjectId(offerId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalRating: { $sum: "$rating" },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          rating: { $divide: ["$totalRating", "$count"] },
        },
      },
    ]);

    if (result.length === 0) {
      return { count: 0, rating: 0 };
    }

    return {
      count: result[0].count,
      rating: parseFloat(result[0].rating.toFixed(1)),
    };
  }

  async countAndRatingByOfferIds(
    offerIds: string[],
  ): Promise<Record<string, { count: number; rating: number }>> {
    const result = await this.model.aggregate([
      {
        $match: {
          offer: { $in: offerIds.map((id) => new Types.ObjectId(id)) },
        },
      },
      {
        $group: {
          _id: "$offer",
          count: { $sum: 1 },
          totalRating: { $sum: "$rating" },
        },
      },
      {
        $project: {
          offerId: { $toString: "$_id" },
          count: 1,
          rating: { $divide: ["$totalRating", "$count"] },
          _id: 0,
        },
      },
    ]);

    return offerIds.reduce(
      (acc, offerId) => {
        const comment = result.find((com) => com.offerId === offerId);
        acc[offerId] = {
          count: comment?.count || 0,
          rating: comment ? parseFloat(comment.rating.toFixed(1)) : 0,
        };
        return acc;
      },
      {} as Record<string, { count: number; rating: number }>,
    );
  }
}
