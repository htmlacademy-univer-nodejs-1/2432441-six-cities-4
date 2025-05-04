import { prop } from "@typegoose/typegoose";

export class BaseModel {
  public _id?: string;

  @prop({ required: true, default: Date.now })
  public createdAt?: Date;

  @prop({ required: true, default: Date.now })
  public updatedAt?: Date;
}
