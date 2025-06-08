import { inject } from "inversify";
import pino from "pino";
import { Component } from "../component.js";
import { Offer } from "../models/offer.js";
import { User } from "../models/user.js";
import { OfferRepository } from "../repositories/offer.js";
import { UserRepository } from "../repositories/user.js";

export class Importer {
  private log: pino.Logger;
  private offerRepository: OfferRepository;
  private userRepository: UserRepository;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.OfferRepository) offerRepository: OfferRepository,
    @inject(Component.UserRepository) userRepository: UserRepository,
  ) {
    this.log = log;
    this.offerRepository = offerRepository;
    this.userRepository = userRepository;
  }

  public async import(offers: AsyncIterable<Offer>) {
    for await (const offer of offers) {
      await this.userRepository.create(offer.author as User);
      const importedOffer = await this.offerRepository.create(offer);
      this.log.info(`Success, id: ${importedOffer._id}`);
    }
  }
}
