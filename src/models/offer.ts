export type City =
  | "Moscow"
  | "Saint Petersburg"
  | "Novosibirsk"
  | "Yekaterinburg"
  | "Kazan"
  | "Nizhny Novgorod";

export type HousingType = "apartment" | "house" | "room" | "hotel";

export type Amenity =
  | "Breakfast"
  | "Air conditioning"
  | "Laptop friendly workspace"
  | "Baby seat"
  | "Washer"
  | "Towels"
  | "Fridge";

export type Offer = {
  id: string;
  title: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  images: [string, string, string, string, string, string];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxGuests: number;
  price: number;
  amenities: Amenity[];
  author: string;
  commentsCount: number;
  coordinates: { latitude: number; longitude: number };
};
