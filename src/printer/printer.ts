import { Offer } from "../models/offer.js";
import chalk from "chalk";

export class Printer {
  public static printOffers(offers: Offer[]) {
    offers.forEach((o, i) => {
      console.log(`-- Offer ${i + 1} --`);
      this.print(o);
    });
  }

  private static print(model: Record<string, unknown>) {
    Object.entries(model).forEach(([key, value], i) => {
      const prettyKey = chalk.ansi256(i % 15 + 1)(key);
      const prettyValue = JSON.stringify(value);
      console.log(`${prettyKey}: ${prettyValue}`);
    });
  }
}
