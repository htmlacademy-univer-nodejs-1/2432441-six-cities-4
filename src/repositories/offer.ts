import { inject, injectable } from "inversify";
import { Offer } from "../models/offer.js";
import { getModelForClass } from "@typegoose/typegoose";
import { Database } from "../database/database.js";
import { Component } from "../component.js";
import { Model } from "mongoose";

@injectable()
export class OfferRepository {
  private readonly model: Model<Offer>;

  constructor(@inject(Component.Database) database: Database) {
    this.model = getModelForClass(Offer, {
      existingConnection: database.getConnection(),
    });
  }

  public async findById(id: string): Promise<Offer | null> {
    return this.model.findById(id).populate("author").exec();
  }

  public async create(data: Partial<Offer>): Promise<Offer> {
    const offer = new this.model(data);
    return offer.save();
  }

  public async findAll(limit: number, skip: number): Promise<Offer[]> {
    return this.model.find().populate("author").skip(skip).limit(limit).exec();
  }

  public async findPremiumByCity(
    city: string,
    limit: number,
    skip: number,
  ): Promise<Offer[]> {
    return this.model
      .find({ city, isPremium: true })
      .populate("author")
      .skip(skip)
      .limit(limit)
      .exec();
  }

  public async update(id: string, data: Partial<Offer>): Promise<Offer | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true })
      .populate("author")
      .exec();
  }

  public async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
