import { inject, injectable } from "inversify";
import {
  CreateOfferRequest,
  Offer,
  UpdateOfferRequest,
} from "../schema/schema.js";
import { Component } from "../component.js";
import pino from "pino";
import { OfferRepository } from "../repositories/offer.js";
import { UserRepository } from "../repositories/user.js";
import { CommentRepository } from "../repositories/comment.js";
import { convertOfferToSchema } from "../schema/convert.js";
import {
  Offer as OfferModel,
  Amenity,
  City,
  HousingType,
} from "../models/offer.js";

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

  public async createOffer(request: CreateOfferRequest): Promise<Offer> {
    const offer = await this.offerRepository.create({
      ...request,
      city: request.city as City,
      type: request.type as HousingType,
      amenities: request.amenities as Amenity[],
      publicationDate: new Date(),
      images: request.images as [
        string,
        string,
        string,
        string,
        string,
        string,
      ],
    });

    this.log.info(`Offer created: ${offer._id}`);

    return convertOfferToSchema(offer, false, 0, 0);
  }

  public async getOffer(userId: string | undefined, id: string): Promise<Offer> {
    const offer = await this.offerRepository.findById(id);
    if (!offer) {
      throw new Error("Offer not found");
    }

    return this.enrichOffer(offer, userId);
  }

  public async updateOffer(
    id: string,
    request: UpdateOfferRequest,
  ): Promise<Offer> {
    const updatedOffer = await this.offerRepository.update(id, {
      ...request,
      city: request.city as City,
      type: request.type as HousingType,
      amenities: request.amenities as Amenity[],
      images: request.images as [
        string,
        string,
        string,
        string,
        string,
        string,
      ],
    });

    if (!updatedOffer) {
      throw new Error("Offer not found");
    }

    this.log.info(`Offer updated: ${updatedOffer._id}`);

    const { rating, count } = await this.commentRepository.countAndRatingByOfferId(updatedOffer._id!);

    return convertOfferToSchema(
      updatedOffer,
      false,
      rating,
      count,
    );
  }

  public async deleteOffer(id: string): Promise<void> {
    await this.offerRepository.delete(id);
    this.log.info(`Offer deleted: ${id}`);
  }

  public async getPremiumOffers(
    city: string,
    limit: number,
    skip: number,
  ): Promise<Offer[]> {
    const offers = await this.offerRepository.findPremiumByCity(city,limit,skip);
    return this.enrichOffers(offers);
  }

  private async enrichOffer(offer: OfferModel, userId?: string): Promise<Offer> {
    const isFavorite = userId ? await this.userRepository.isFavorite(userId, offer._id!) : false;
    const { rating, count } = await this.commentRepository.countAndRatingByOfferId(offer._id!);

    return convertOfferToSchema(
      offer,
      isFavorite,
      rating,
      count,
    );
  }

  private async enrichOffers(
    offers: OfferModel[],
    userId?: string,
  ): Promise<Offer[]> {
    const offerIds = offers.map((offer) => offer._id!);
    const favourites = userId ? await this.userRepository.areFavorites(userId, offerIds) : {};
    const commentsCount = await this.commentRepository.countAndRatingByOfferIds(offerIds);

    return offers.map((offer) =>
      convertOfferToSchema(
        offer,
        favourites[offer._id!],
        commentsCount[offer._id!].rating,
        commentsCount[offer._id!].count,
      ),
    );
  }
}
