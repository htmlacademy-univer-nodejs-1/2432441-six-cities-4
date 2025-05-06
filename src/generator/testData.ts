import { Amenity, City, HousingType } from "../models/offer.js";

export type TestData = {
  title: string[];
  description: string[];
  publicationDate: Date[];
  city: City[];
  previewImage: string[];
  images: [string, string, string, string, string, string][];
  isPremium: boolean[];
  type: HousingType[];
  bedrooms: number[];
  maxGuests: number[];
  price: number[];
  amenities: Amenity[][];
  author: string[];
  coordinates: { latitude: number; longitude: number }[];
  createdAt: Date[];
  updatedAt: Date[];
};
