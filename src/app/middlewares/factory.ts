import { inject, injectable } from "inversify";
import Joi from "joi";
import { Logger } from "pino";
import { Component } from "../../component.js";
import { ConfigProvider } from "../../config/provider.js";
import { UserRepository } from "../../repositories/user.js";
import { OfferService } from "../../services/offer.js";
import { ExceptionFilter } from "./exception-filter.js";
import { FileUploader } from "./file-uploader.js";
import { Middleware } from "./interface.js";
import {
  GetByIdFunc,
  ObjectExistsValidator,
} from "./object-exists-validator.js";
import { ObjectIdValidator } from "./objectid-validator.js";
import { RequestValidator } from "./request-validator.js";
import { StaticServer } from "./static-server.js";
import { UserAuthenticator } from "./user-authenticator.js";

@injectable()
export class MiddlewareFactory {
  constructor(
    @inject(Component.Log) private readonly logger: Logger,
    @inject(Component.ConfigProvider)
    private readonly configProvider: ConfigProvider,
    @inject(Component.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public exceptionFilter(): Middleware {
    return new ExceptionFilter(this.logger);
  }

  public fileUploader(
    name: string,
    destination: string,
    alowedTypes: string[],
    maxSize: number,
  ): Middleware {
    return new FileUploader(name, destination, alowedTypes, maxSize);
  }

  public offerExistsValidator(): Middleware {
    return this.objectExistsValidator("offerId", (id) =>
      this.offerService.getOffer(undefined, id),
    );
  }

  public objectIdValidator(paramName: string): Middleware {
    return new ObjectIdValidator(paramName);
  }

  public requestValidator<T>(schema: Joi.Schema<T>): Middleware {
    return new RequestValidator(schema);
  }

  public staticServer(root: string): Middleware {
    return new StaticServer(root);
  }

  public userAuthenticator(allowUnauthorizer = false) {
    return new UserAuthenticator(
      this.configProvider,
      this.userRepository,
      allowUnauthorizer,
    );
  }

  private objectExistsValidator<T>(
    paramName: string,
    getFunc: GetByIdFunc<T>,
  ): Middleware {
    return new ObjectExistsValidator(paramName, getFunc);
  }
}
