import fs from "node:fs";
import { Offer, City, HousingType, Amenity } from "../models/offer.js";

export class Importer {
  public importOffers(filename: string): Offer[] {
    const fileContent = fs.readFileSync(filename, "utf-8");
    const lines = fileContent.split("\n").slice(1);

    const offers: Offer[] = [];
    lines.forEach((line) => {
      const splitLine = line.split("\t");
      if (splitLine.length !== 18) {
        return;
      }

      const [
        id,
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
      ] = splitLine;

      offers.push({
        id,
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
        author,
        commentsCount: parseInt(commentsCount, 10),
        coordinates: {
          latitude: parseFloat(coordinates.split(",")[0]),
          longitude: parseFloat(coordinates.split(",")[1]),
        },
      });
    });
    return offers;
  }
}
