import { Offer } from "../models/offer.js";
import chalk from "chalk";

export class Printer {
  public printOffers(offers: Offer[]) {
    offers.forEach((o, i) => {
      console.log(`-- Offer ${i + 1} --`);
      this.print(o);
    });
  }

  private print(model: Record<string, unknown>) {
    Object.entries(model).forEach(([key, value], i) => {
      console.log(`${chalk.ansi256(i % 256)(key)}: ${JSON.stringify(value)}`);
    });
  }
}
