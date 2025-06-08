import got from "got";
import random from "random";

import { Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Amenity, City, HousingType, Offer } from "../models/offer.js";
import { User } from "../models/user.js";
import { TestData } from "./testData.js";

export class Generator {
  private data: TestData | undefined;

  public async load(url: string) {
    this.data = await got.get(url).json();
  }

  public *generateOffers(n: number): Iterable<Offer> {
    for (let i = 0; i < n; i++) {
      yield this.generateOffer();
    }
  }

  private generateOffer(): Offer {
    if (this.data === undefined) {
      throw Error("you must load the data first");
    }

    return {
      _id: new Types.ObjectId().toString(),
      title: random.choice(this.data.title)!,
      description: random.choice(this.data.description)!,
      publicationDate: random.choice(this.data.publicationDate)!,
      city: random.choice(this.data.city)! as City,
      previewImage: random.choice(this.data.previewImage)!,
      images: random.choice(this.data.images)!,
      isPremium: random.choice(this.data.isPremium)!,
      type: random.choice(this.data.type)! as HousingType,
      bedrooms: random.choice(this.data.bedrooms)!,
      maxGuests: random.choice(this.data.maxGuests)!,
      price: random.choice(this.data.price)!,
      amenities: random.choice(this.data.amenities)! as Amenity[],
      author: undefined! as Ref<User>,
      coordinates: random.choice(this.data.coordinates)!,
      createdAt: random.choice(this.data.createdAt)!,
      updatedAt: random.choice(this.data.updatedAt)!,
      comments: [],
    };
  }
}
