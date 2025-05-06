import convict from "convict";
import validator from "convict-format-with-validator";
import { Config } from "./types.js";

convict.addFormats(validator);

export default convict<Config>({
  PORT: {
    doc: "Listening port",
    format: "port",
    env: "PORT",
    default: 8080,
  },
  DB_URI: {
    doc: "URI of database",
    format: String,
    env: "DB_URI",
    default: "mongodb://admin:test@localhost:27017",
  },
  JWT_SECRET: {
    doc: "Secret key for JWT",
    format: String,
    env: "JWT_SECRET",
    default: null,
  },
});
