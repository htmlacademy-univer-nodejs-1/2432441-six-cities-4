import { Offer } from "../models/offer.js";
import chalk from "chalk";

export class Printer {
  public static async printOffers(offers: AsyncIterable<Offer>) {
    let number = 1;
    for await (const offer of offers) {
      console.log(`-- Offer ${number} --`);
      this.print(offer);
      number += 1;
    }
  }

  private static print(model: Record<string, unknown>) {
    Object.entries(model).forEach(([key, value], i) => {
      const prettyKey = chalk.ansi256((i % 15) + 1)(key);
      const prettyValue = JSON.stringify(value);
      console.log(`${prettyKey}: ${prettyValue}`);
    });
  }
}
