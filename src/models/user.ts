import { prop, getModelForClass } from "@typegoose/typegoose";
import { BaseModel } from "./base.js";

export enum UserType {
  Regular = "regular",
  Pro = "pro",
}

export class User extends BaseModel {
  @prop({ required: true, minlength: 1, maxlength: 15 })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop()
  public avatar?: string;

  @prop({ required: true, minlength: 6, maxlength: 12 })
  public password!: string;

  @prop({ required: true, enum: UserType })
  public type!: UserType;
}

export const UserModel = getModelForClass(User);
