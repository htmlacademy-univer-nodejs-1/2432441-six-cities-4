import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import pino from "pino";
import { ApiError } from "../app/errors/api-error.js";
import { Component } from "../component.js";
import { ConfigProvider } from "../config/provider.js";
import { encodeToken } from "../helpers/jwt.js";
import { UserType } from "../models/user.js";
import { UserRepository } from "../repositories/user.js";
import { convertUserToSchema } from "../schema/convert.js";
import {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  User as SchemaUser,
} from "../schema/schema.js";

@injectable()
export class UserService {
  private readonly log: pino.Logger;
  private readonly configProvider: ConfigProvider;
  private readonly userRepository: UserRepository;

  constructor(
    @inject(Component.Log) log: pino.Logger,
    @inject(Component.UserRepository) userRepository: UserRepository,
    @inject(Component.ConfigProvider) configProvider: ConfigProvider,
  ) {
    this.log = log;
    this.userRepository = userRepository;
    this.configProvider = configProvider;
  }

  public async getUser(id: string): Promise<SchemaUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    return convertUserToSchema(user);
  }

  public async createUser(request: CreateUserRequest): Promise<SchemaUser> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "User with this email already exists",
      );
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);
    const user = await this.userRepository.create({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      type: UserType.Regular,
    });

    this.log.info(`User created: ${user._id}`);

    return convertUserToSchema(user);
  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const isValidPassword = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid password");
    }

    const secret = this.configProvider.get().JWT_SECRET;
    const token = encodeToken(secret, { id: user._id });

    this.log.info(`User logged in: ${user._id}`);

    return { token };
  }

  public async updateAvatar(userId: string, name: string): Promise<void> {
    this.log.info(`new avatar ${name} for user ${userId}`);
    await this.userRepository.update(userId, { avatar: `/uploads/${name}` });
  }
}
