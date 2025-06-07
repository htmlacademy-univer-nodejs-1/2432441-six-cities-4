import { inject, injectable } from "inversify";
import pino from "pino";
import { Component } from "../component.js";
import { UserRepository } from "../repositories/user.js";
import { Offer } from "../schema/schema.js";
import { OfferService } from "./offer.js";

@injectable()
export class FavouriteService {
  private readonly log: pino.Logger;
  private readonly userRepository: UserRepository;
  private readonly offerService: OfferService;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.UserRepository) userRepository: UserRepository,
    @inject(Component.OfferService) offerService: OfferService,
  ) {
    this.log = log;
    this.userRepository = userRepository;
    this.offerService = offerService;
  }

  public async addToFavorites(userId: string, offerId: string): Promise<Offer> {
    await this.userRepository.addFavorite(userId, offerId);
    this.log.info(`Offer ${offerId} added to favorites for user ${userId}`);
    return await this.offerService.getOffer(userId, offerId);
  }

  public async removeFromFavorites(
    userId: string,
    offerId: string,
  ): Promise<Offer> {
    await this.userRepository.removeFavorite(userId, offerId);
    this.log.info(`Offer ${offerId} removed from favorites for user ${userId}`);
    return await this.offerService.getOffer(userId, offerId);
  }

  public async getFavorites(userId: string): Promise<Offer[]> {
    const offers = await this.userRepository.getFavorites(userId);
    return await this.offerService.enrichOffers(offers, userId);
  }
}
