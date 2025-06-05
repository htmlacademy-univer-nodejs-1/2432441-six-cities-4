import { Component } from "../component.js";
import { UserRepository } from "../repositories/user.js";
import pino from "pino";
import { inject, injectable } from "inversify";
import { User, UserType } from "../models/user.js";
import {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
} from "../schema/schema.js";
import bcrypt from "bcrypt";
import { ConfigProvider } from "../config/provider.js";
import jwt from "jsonwebtoken";
import { ApiError as ApiError } from "../app/errors/api-error.js";
import { StatusCodes } from "http-status-codes";

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

  public async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  public async createUser(request: CreateUserRequest): Promise<User> {
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

    return user;
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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      this.configProvider.get().JWT_SECRET,
      { expiresIn: "1d" },
    );

    this.log.info(`User logged in: ${user._id}`);

    return { token };
  }
}
