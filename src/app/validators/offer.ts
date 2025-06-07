import Joi from "joi";
import { Amenity, City, HousingType } from "../../models/offer.js";
import {
  CreateOfferRequest,
  Location,
  UpdateOfferRequest,
} from "../../schema/schema.js";

const alter = {
  create: (schema: Joi.Schema) => schema.required(),
  update: (schema: Joi.Schema) => schema.optional(),
};

const schema = Joi.object<CreateOfferRequest | UpdateOfferRequest>({
  title: Joi.string().min(10).max(100).alter(alter),
  description: Joi.string().min(20).max(1024).alter(alter),
  city: Joi.string()
    .valid(...Object.values(City))
    .alter(alter),
  previewImage: Joi.string().uri().alter(alter),
  images: Joi.array<string>().items(Joi.string().uri()).length(6).alter(alter),
  isPremium: Joi.bool().alter(alter),
  type: Joi.string()
    .valid(...Object.values(HousingType))
    .alter(alter),
  bedrooms: Joi.number().integer().min(1).max(8).alter(alter),
  maxGuests: Joi.number().integer().min(1).max(10).alter(alter),
  price: Joi.number().integer().min(100).max(100000).alter(alter),
  amenities: Joi.array<string>()
    .items(Joi.string().valid(...Object.values(Amenity)))
    .alter(alter),
  coordinates: Joi.object<Location>({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).alter(alter),
});

export const CreateOfferRequestSchema: Joi.Schema<CreateOfferRequest> =
  schema.tailor("create");
export const UpdateOfferRequestSchema: Joi.Schema<UpdateOfferRequest> =
  schema.tailor("update");
