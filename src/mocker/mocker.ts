import fs from "node:fs";
import readline from "node:readline";
import { Offer, City, HousingType, Amenity } from "../models/offer.js";
import { Ref } from "@typegoose/typegoose";
import { User } from "../models/user.js";

export class Mocker {
  public static async *readOffers(filename: string): AsyncIterable<Offer> {
    const fileStream = fs.createReadStream(filename, "utf-8");
    const reader = readline.createInterface({ input: fileStream });

    let isFirstLine = true;
    for await (const line of reader) {
      if (isFirstLine || line.trim().length === 0) {
        isFirstLine = false;
        continue;
      }

      const [
        title,
        description,
        publicationDate,
        city,
        previewImage,
        images,
        isPremium,
        isFavorite,
        rating,
        type,
        bedrooms,
        maxGuests,
        price,
        amenities,
        author,
        commentsCount,
        coordinates,
        createdAt,
        updatedAt,
      ] = line.split("\t");

      yield {
        title,
        description,
        publicationDate: new Date(publicationDate),
        city: city as City,
        previewImage,
        images: images.split(",") as [
          string,
          string,
          string,
          string,
          string,
          string,
        ],
        isPremium: isPremium === "true",
        isFavorite: isFavorite === "true",
        rating: parseFloat(rating),
        type: type as HousingType,
        bedrooms: parseInt(bedrooms, 10),
        maxGuests: parseInt(maxGuests, 10),
        price: parseInt(price, 10),
        amenities: amenities.split(",") as Amenity[],
        author: author as unknown as Ref<User>,
        commentsCount: parseInt(commentsCount, 10),
        coordinates: {
          latitude: parseFloat(coordinates.split(",")[0]),
          longitude: parseFloat(coordinates.split(",")[1]),
        },
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      };
    }
    fileStream.close();
  }

  public static async writeOffers(filename: string, offers: Iterable<Offer>) {
    const file = fs.createWriteStream(filename);
    file.write(
      "title	description	publicationDate	city	previewImage	images	isPremium	isFavorite	rating	type	bedrooms	maxGuests	price	amenities	author	commentsCount	coordinates	createdAt	updatedAt\n",
    );
    for (const offer of offers) {
      file.write(this.offerToTsv(offer));
      file.write("\n");
    }
    file.end();
  }

  private static offerToTsv(offer: Offer): string {
    const imagesString = offer.images.join(",");
    const amenitiesString = offer.amenities.join(",");
    const coordinatesString = `${offer.coordinates.latitude},${offer.coordinates.longitude}`;

    const fields = [
      offer.title,
      offer.description,
      offer.publicationDate,
      offer.city,
      offer.previewImage,
      imagesString,
      offer.isPremium.toString(),
      offer.isFavorite.toString(),
      offer.rating.toString(),
      offer.type,
      offer.bedrooms.toString(),
      offer.maxGuests.toString(),
      offer.price.toString(),
      amenitiesString,
      offer.author,
      offer.commentsCount.toString(),
      coordinatesString,
      offer.createdAt,
      offer.updatedAt,
    ];
    return fields.join("\t");
  }
}
