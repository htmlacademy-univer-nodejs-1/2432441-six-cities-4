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
    ...user,
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
    ...offer,
    isFavorite: isFavorite,
    rating: rating,
    author: convertUserToSchema(offer.author as User),
    publicationDate: offer.publicationDate.toISOString(),
    createdAt: offer.createdAt?.toISOString(),
    updatedAt: offer.updatedAt?.toISOString(),
    commentsCount: commentsCount,
  };
}

export function convertCommentToSchema(comment: Comment): SchemaComment {
  return {
    ...comment,
    createdAt: comment.createdAt?.toISOString(),
    author: convertUserToSchema(comment.author as User),
  };
}
