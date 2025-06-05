import { Comment } from "../models/comment.js";
import { Offer } from "../models/offer.js";
import { User } from "../models/user.js";
import {
  Offer as SchemaOffer,
  User as SchemaUser,
  Comment as SchemaComment,
} from "./schema.js";

export function convertUserToSchema(user: User): SchemaUser {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    type: user.type,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}

export function convertOfferToSchema(
  offer: Offer,
  isFavorite: boolean,
  rating: number,
  commentsCount: number,
): SchemaOffer {
  return {
    id: offer._id,
    title: offer.title,
    description: offer.description,
    publicationDate: offer.publicationDate.toISOString(),
    city: offer.city,
    previewImage: offer.previewImage,
    images: offer.images,
    isPremium: offer.isPremium,
    isFavorite: isFavorite,
    rating: rating,
    type: offer.type,
    bedrooms: offer.bedrooms,
    maxGuests: offer.maxGuests,
    price: offer.price,
    amenities: offer.amenities,
    author: convertUserToSchema(offer.author as User),
    commentsCount: commentsCount,
    coordinates: {
      latitude: offer.coordinates.latitude,
      longitude: offer.coordinates.longitude,
    },
    createdAt: offer.createdAt?.toISOString(),
    updatedAt: offer.updatedAt?.toISOString(),
  };
}

export function convertCommentToSchema(comment: Comment): SchemaComment {
  return {
    id: comment._id,
    text: comment.text,
    rating: comment.rating,
    author: convertUserToSchema(comment.author as User),
    createdAt: comment.createdAt?.toISOString(),
  };
}
