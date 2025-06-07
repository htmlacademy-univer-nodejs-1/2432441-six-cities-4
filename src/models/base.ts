import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

export class BaseModel {
  @prop({ required: true, default: () => new Types.ObjectId().toString() })
  public _id!: string;

  @prop({ required: true, default: Date.now })
  public createdAt!: Date;

  @prop({ required: true, default: Date.now })
  public updatedAt!: Date;
}
