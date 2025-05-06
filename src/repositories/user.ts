import { inject, injectable } from "inversify";
import { User } from "../models/user.js";
import { Model, Types } from "mongoose";
import { Offer } from "../models/offer.js";
import { getModelForClass } from "@typegoose/typegoose";
import { Database } from "../database/database.js";
import { Component } from "../component.js";

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
    return user?.favorites?.some((favorite) => (favorite as Offer)._id === offerId) ?? false;
  }

  public async areFavorites(userId: string, offerIds: string[]): Promise<Record<string, boolean>> {
    const user = await this.model.findById(userId).exec();
    return offerIds.reduce((acc, offerId) => {
      acc[offerId] = user?.favorites?.some((favorite) => (favorite as Offer)._id === offerId) ?? false;
      return acc;
    }, {} as Record<string, boolean>);
  }
}
