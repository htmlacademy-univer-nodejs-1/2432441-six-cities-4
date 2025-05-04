import { injectable } from "inversify";
import { Offer, OfferModel } from "../models/offer.js";
import { Repository } from "./interface.js";

@injectable()
export class OfferRepository implements Repository<Offer> {
  public async findById(id: string): Promise<Offer | null> {
    return OfferModel.findById(id).populate("author").exec();
  }

  public async create(data: Partial<Offer>): Promise<Offer> {
    const offer = new OfferModel(data);
    return offer.save();
  }

  public async findAll(): Promise<Offer[]> {
    return OfferModel.find().populate("author").exec();
  }

  public async findByCity(city: string): Promise<Offer[]> {
    return OfferModel.find({ city }).populate("author").exec();
  }

  public async findPremiumByCity(city: string): Promise<Offer[]> {
    return OfferModel.find({ city, isPremium: true }).populate("author").exec();
  }
}
