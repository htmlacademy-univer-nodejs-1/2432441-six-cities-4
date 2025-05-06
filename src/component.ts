export const Component = {
  Log: Symbol.for("Log"),
  ConfigProvider: Symbol.for("ConfigProvider"),
  Application: Symbol.for("Application"),
  OfferRepository: Symbol.for("OfferRepository"),
  UserRepository: Symbol.for("UserRepository"),
  CommentRepository: Symbol.for("CommentRepository"),
  Importer: Symbol.for("Importer"),
  Database: Symbol.for("Database"),
} as const;
