import { getModelForClass } from "@typegoose/typegoose";
import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { Component } from "../component.js";
import { Database } from "../database/database.js";
import { Offer } from "../models/offer.js";
import { User } from "../models/user.js";

@injectable()
export class UserRepository {
  private readonly model: Model<User>;

  constructor(@inject(Component.Database) database: Database) {
    this.model = getModelForClass(User, {
      existingConnection: database.getConnection(),
    });
  }

  public async findById(id: string): Promise<User | null> {
    return this.model.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email }).exec();
  }

  public async create(data: Partial<User>): Promise<User> {
    const user = new this.model(data);
    return user.save();
  }

  public async update(id: string, data: Partial<User>): Promise<User | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  public async addFavorite(userId: string, offerId: string): Promise<void> {
    await this.model
      .findByIdAndUpdate(userId, {
        $addToSet: { favorites: new Types.ObjectId(offerId) },
      })
      .exec();
  }

  public async removeFavorite(userId: string, offerId: string): Promise<void> {
    await this.model
      .findByIdAndUpdate(userId, {
        $pull: { favorites: new Types.ObjectId(offerId) },
      })
      .exec();
  }

  public async getFavorites(userId: string): Promise<Offer[]> {
    const user = await this.model.findById(userId).populate("favorites").exec();
    return (user?.favorites as Offer[]) || [];
  }

  public async isFavorite(userId: string, offerId: string): Promise<boolean> {
    const user = await this.model.findById(userId).exec();
    return (
      user?.favorites?.some(
        (favorite) => (favorite as Offer)._id === offerId,
      ) ?? false
    );
  }

  public async areFavorites(
    userId: string,
    offerIds: string[],
  ): Promise<Record<string, boolean>> {
    const user = await this.model.findById(userId).exec();
    return offerIds.reduce(
      (acc, offerId) => {
        acc[offerId] =
          user?.favorites?.some(
            (favorite) => (favorite as Offer)._id === offerId,
          ) ?? false;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }
}
