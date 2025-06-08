import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import pino from "pino";
import { ApiError } from "../app/errors/api-error.js";
import { Component } from "../component.js";
import {
  Amenity,
  City,
  HousingType,
  Offer as OfferModel,
} from "../models/offer.js";
import { User as UserModel } from "../models/user.js";
import { CommentRepository } from "../repositories/comment.js";
import { OfferRepository } from "../repositories/offer.js";
import { UserRepository } from "../repositories/user.js";
import { convertOfferToSchema } from "../schema/convert.js";
import {
  CreateOfferRequest,
  Offer,
  UpdateOfferRequest,
} from "../schema/schema.js";

@injectable()
export class OfferService {
  private readonly log: pino.Logger;
  private readonly offerRepository: OfferRepository;
  private readonly userRepository: UserRepository;
  private readonly commentRepository: CommentRepository;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.OfferRepository) offerRepository: OfferRepository,
    @inject(Component.UserRepository) userRepository: UserRepository,
    @inject(Component.CommentRepository) commentRepository: CommentRepository,
  ) {
    this.log = log;
    this.offerRepository = offerRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
  }

  public async getOffers(
    userId: string | undefined,
    limit: number,
    skip: number,
  ): Promise<Offer[]> {
    const offers = await this.offerRepository.findAll(limit, skip);
    return this.enrichOffers(offers, userId);
  }

  public async createOffer(
    userId: string,
    request: CreateOfferRequest,
  ): Promise<Offer> {
    const offer = await this.offerRepository.create({
      author: userId,
      title: request.title,
      description: request.description,
      city: request.city as City,
      previewImage: request.previewImage,
      images: request.images as [
        string,
        string,
        string,
        string,
        string,
        string,
      ],
      isPremium: request.isPremium,
      type: request.type as HousingType,
      bedrooms: request.bedrooms,
      maxGuests: request.maxGuests,
      price: request.price,
      amenities: request.amenities as Amenity[],
      publicationDate: new Date(),
      coordinates: {
        latitude: request.coordinates.latitude,
        longitude: request.coordinates.longitude,
      },
    });

    this.log.info(`Offer created: ${offer._id}`);

    return convertOfferToSchema(offer, false, 0, 0);
  }

  public async getOffer(
    userId: string | undefined,
    id: string,
  ): Promise<Offer> {
    const offer = await this.offerRepository.findById(id);
    if (!offer) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Offer not found");
    }

    return this.enrichOffer(offer, userId);
  }

  public async updateOffer(
    userId: string,
    id: string,
    request: UpdateOfferRequest,
  ): Promise<Offer> {
    const offer = await this.offerRepository.findById(id);
    if (!offer || (offer.author as UserModel)._id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You can't edit this offer!");
    }

    const updatedOffer = await this.offerRepository.update(id, {
      title: request.title,
      description: request.description,
      city: request.city as City,
      previewImage: request.previewImage,
      images: request.images as [
        string,
        string,
        string,
        string,
        string,
        string,
      ],
      isPremium: request.isPremium,
      type: request.type as HousingType,
      bedrooms: request.bedrooms,
      maxGuests: request.maxGuests,
      price: request.price,
      amenities: request.amenities as Amenity[],
      coordinates: request.coordinates
        ? {
            latitude: request.coordinates.latitude,
            longitude: request.coordinates.longitude,
          }
        : undefined,
    });

    if (!updatedOffer) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Offer not found");
    }

    this.log.info(`Offer updated: ${updatedOffer._id}`);

    const isFavourite = await this.userRepository.isFavorite(userId, id);
    const { rating, count } =
      await this.commentRepository.countAndRatingByOfferId(updatedOffer._id);
    return convertOfferToSchema(updatedOffer, isFavourite, rating, count);
  }

  public async deleteOffer(userId: string, id: string): Promise<void> {
    const offer = await this.offerRepository.findById(id);
    if (!offer || (offer.author as UserModel)._id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You can't delete this offer!");
    }

    await this.offerRepository.delete(id);
    await this.commentRepository.deleteByOfferId(id);
    this.log.info(`Offer deleted: ${id}`);
  }

  public async getPremiumOffers(
    userId: string | undefined,
    city: string,
    limit: number,
    skip: number,
  ): Promise<Offer[]> {
    const offers = await this.offerRepository.findPremiumByCity(
      city,
      limit,
      skip,
    );
    return this.enrichOffers(offers, userId);
  }

  public async enrichOffer(offer: OfferModel, userId?: string): Promise<Offer> {
    const isFavorite = userId
      ? await this.userRepository.isFavorite(userId, offer._id)
      : false;

    const { rating, count } =
      await this.commentRepository.countAndRatingByOfferId(offer._id);

    return convertOfferToSchema(offer, isFavorite, rating, count);
  }

  public async enrichOffers(
    offers: OfferModel[],
    userId?: string,
  ): Promise<Offer[]> {
    const offerIds = offers.map((offer) => offer._id);
    const favourites = userId
      ? await this.userRepository.areFavorites(userId, offerIds)
      : {};
    const commentsCount =
      await this.commentRepository.countAndRatingByOfferIds(offerIds);

    return offers.map((offer) =>
      convertOfferToSchema(
        offer,
        favourites[offer._id],
        commentsCount[offer._id].rating,
        commentsCount[offer._id].count,
      ),
    );
  }
}
