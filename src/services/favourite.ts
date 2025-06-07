import { inject, injectable } from "inversify";
import pino from "pino";
import { Component } from "../component.js";
import { Offer } from "../models/offer.js";
import { UserRepository } from "../repositories/user.js";

@injectable()
export class FavouriteService {
  private readonly log: pino.Logger;
  private readonly userRepository: UserRepository;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.UserRepository) userRepository: UserRepository,
  ) {
    this.log = log;
    this.userRepository = userRepository;
  }

  public async addToFavorites(userId: string, offerId: string): Promise<void> {
    await this.userRepository.addFavorite(userId, offerId);
    this.log.info(`Offer ${offerId} added to favorites for user ${userId}`);
  }

  public async removeFromFavorites(
    userId: string,
    offerId: string,
  ): Promise<void> {
    await this.userRepository.removeFavorite(userId, offerId);
    this.log.info(`Offer ${offerId} removed from favorites for user ${userId}`);
  }

  public async getFavorites(userId: string): Promise<Offer[]> {
    return this.userRepository.getFavorites(userId);
  }
}
