#!/usr/bin/env node

import { program } from "commander";
import { Mocker } from "./mocker/mocker.js";
import { Printer } from "./printer/printer.js";
import { Generator } from "./generator/generator.js";
import { DIContainer } from "./dicontainer.js";

program.name("six-cities").version(process.env.npm_package_version ?? "");

program.description("run application").action(() => {
  const container = new DIContainer();
  const application = container.getApplication();
  application.init();
});

program
  .command("import <source>")
  .description("impport .tsv mock file")
  .action(async (source) => {
    const offers = Mocker.importOffers(source);

    await Printer.printOffers(offers);
  });

program
  .command("generate <n> <filepath> <url>")
  .description("generate n test items")
  .action(async (n, filename, url) => {
    const generator = new Generator();
    await generator.load(url);

    const offers = generator.generateOffers(n);
    await Mocker.exportOffers(filename, offers);
  });

program.parse(process.argv);
