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
  SALT: {
    doc: "Salt for password hashing",
    format: String,
    env: "SALT",
    default: null,
  },
  DB_HOST: {
    doc: "IP address of database",
    format: "ipaddress",
    env: "DB_HOST",
    default: "127.0.0.1",
  },
  DB_PORT: {
    doc: "Port of database",
    format: "port",
    env: "DB_PORT",
    default: 27017,
  },
});
