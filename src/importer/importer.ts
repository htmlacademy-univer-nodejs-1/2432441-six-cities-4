import { inject } from "inversify";
import pino from "pino";
import { Component } from "../component.js";
import { Offer } from "../models/offer.js";
import { OfferRepository } from "../repositories/offer.js";

export class Importer {
  private log: pino.Logger;
  private offerRepository: OfferRepository;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.OfferRepository) offerRepository: OfferRepository,
  ) {
    this.log = log;
    this.offerRepository = offerRepository;
  }

  public async import(offers: AsyncIterable<Offer>) {
    for await (const offer of offers) {
      this.log.info(`Importing offer: ${offer.title}`);
      const imported = await this.offerRepository.create(offer);
      this.log.info(`Success, id: ${imported._id}`);
    }
  }
}
