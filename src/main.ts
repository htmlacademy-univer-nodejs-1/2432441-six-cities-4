#!/usr/bin/env node

import { program } from "commander";
import { Mocker } from "./mocker/mocker.js";
import { Generator } from "./generator/generator.js";
import { DIContainer } from "./dicontainer.js";

program.name("six-cities").version(process.env.npm_package_version ?? "");

program.description("run application").action(() => {
  const container = new DIContainer();
  const application = container.getApplication();
  application.init();
});

program
  .command("import <source> <db-uri>")
  .description("Import .tsv mock file to MongoDB")
  .action(async (source, dbUri) => {
    const container = new DIContainer();
    const importer = container.getImporter();
    const databaseClient = container.getDatabaseClient();
    await databaseClient.connect(dbUri);

    try {
      const offers = Mocker.readOffers(source);
      await importer.import(offers);
    } catch (error) {
      console.error("Failed to import data:", error);
    } finally {
      await databaseClient.disconnect();
    }
  });

program
  .command("generate <n> <filepath> <url>")
  .description("generate n test items")
  .action(async (n, filename, url) => {
    const generator = new Generator();
    await generator.load(url);

    const offers = generator.generateOffers(n);
    await Mocker.writeOffers(filename, offers);
  });

program.parse(process.argv);
