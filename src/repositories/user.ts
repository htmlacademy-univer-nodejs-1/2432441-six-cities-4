import { injectable } from "inversify";
import { User, UserModel } from "../models/user.js";
import { Repository as Repository } from "./interface.js";

@injectable()
export class UserRepository implements Repository<User> {
  public async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  }

  public async create(data: Partial<User>): Promise<User> {
    const user = new UserModel(data);
    return user.save();
  }

  public async findAll(): Promise<User[]> {
    return UserModel.find().exec();
  }
}
