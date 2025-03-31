import got from "got";
import random from "random";
import { v4 as uuidv4 } from "uuid";

import { TestData } from "./testData.js";
import { Offer } from "../models/offer.js";

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
    if (this.data === undefined) throw Error("you must load the data first");

    return {
      id: uuidv4(),
      title: random.choice(this.data.title)!,
      description: random.choice(this.data.description)!,
      publicationDate: random.choice(this.data.publicationDate)!,
      city: random.choice(this.data.city)!,
      previewImage: random.choice(this.data.previewImage)!,
      images: random.choice(this.data.images)!,
      isPremium: random.choice(this.data.isPremium)!,
      isFavorite: random.choice(this.data.isFavorite)!,
      rating: random.choice(this.data.rating)!,
      type: random.choice(this.data.type)!,
      bedrooms: random.choice(this.data.bedrooms)!,
      maxGuests: random.choice(this.data.maxGuests)!,
      price: random.choice(this.data.price)!,
      amenities: random.choice(this.data.amenities)!,
      author: random.choice(this.data.author)!,
      commentsCount: random.choice(this.data.commentsCount)!,
      coordinates: random.choice(this.data.coordinates)!,
    };
  }
}
