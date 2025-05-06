import { Component } from "../component.js";
import { inject } from "inversify";
import { OfferRepository } from "../repositories/offer.js";
import { UserRepository } from "../repositories/user.js";
import pino from "pino";
import { Offer } from "../models/offer.js";
import { injectable } from "inversify";

@injectable()
export class FavouriteService {
  private readonly log: pino.Logger;
  private readonly userRepository: UserRepository;
  private readonly offerRepository: OfferRepository;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.UserRepository) userRepository: UserRepository,
    @inject(Component.OfferRepository) offerRepository: OfferRepository,
  ) {
    this.log = log;
    this.userRepository = userRepository;
    this.offerRepository = offerRepository;
  }

  public async addToFavorites(userId: string, offerId: string): Promise<void> {
    const offer = await this.offerRepository.findById(offerId);
    if (!offer) {
      throw new Error("Offer not found");
    }

    await this.userRepository.addFavorite(userId, offerId);
    this.log.info(`Offer ${offerId} added to favorites for user ${userId}`);
  }

  public async removeFromFavorites(
    userId: string,
    offerId: string,
  ): Promise<void> {
    const offer = await this.offerRepository.findById(offerId);
    if (!offer) {
      throw new Error("Offer not found");
    }

    await this.userRepository.removeFavorite(userId, offerId);
    this.log.info(`Offer ${offerId} removed from favorites for user ${userId}`);
  }

  public async getFavorites(userId: string): Promise<Offer[]> {
    return this.userRepository.getFavorites(userId);
  }
}
