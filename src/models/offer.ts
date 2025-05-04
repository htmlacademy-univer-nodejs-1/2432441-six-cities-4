import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { BaseModel } from "./base.js";
import { User } from "./user.js";

export enum City {
  Moscow = "Moscow",
  SaintPetersburg = "Saint Petersburg",
  Novosibirsk = "Novosibirsk",
  Yekaterinburg = "Yekaterinburg",
  Kazan = "Kazan",
  NizhnyNovgorod = "Nizhny Novgorod",
}

export enum HousingType {
  Apartment = "apartment",
  House = "house",
  Room = "room",
  Hotel = "hotel",
}

export enum Amenity {
  Breakfast = "Breakfast",
  AirConditioning = "Air conditioning",
  LaptopFriendlyWorkspace = "Laptop friendly workspace",
  BabySeat = "Baby seat",
  Washer = "Washer",
  Towels = "Towels",
  Fridge = "Fridge",
}

export class Location {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}

export class Offer extends BaseModel {
  @prop({ required: true, trim: true, minlength: 10, maxlength: 100 })
  public title!: string;

  @prop({ required: true, trim: true, minlength: 10, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({ required: true, enum: City })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => [String],
    validate: (v: string[]) => v.length === 6,
  })
  public images!: [string, string, string, string, string, string];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, enum: HousingType })
  public type!: HousingType;

  @prop({ required: true, min: 1, max: 8 })
  public bedrooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public maxGuests!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({ required: true, type: () => [String], enum: Amenity })
  public amenities!: Amenity[];

  @prop({ required: true, ref: () => User })
  public author!: Ref<User>;

  @prop({ required: true, default: 0 })
  public commentsCount!: number;

  @prop({ required: true, type: () => Location })
  public coordinates!: Location;
}

export const OfferModel = getModelForClass(Offer);
