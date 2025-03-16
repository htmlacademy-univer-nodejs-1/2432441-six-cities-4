#!/usr/bin/env node

import { program } from "commander";
import { Importer } from "./importer/importer.js";
import { Printer } from "./printer/printer.js";

program.name("six-cities").version(process.env.npm_package_version ?? "");

program
  .command("import <source>")
  .description("impport .tsv mock file")
  .action((source) => {
    const offers = Importer.importOffers(source);

    Printer.printOffers(offers);
  });

program.parse(process.argv);
