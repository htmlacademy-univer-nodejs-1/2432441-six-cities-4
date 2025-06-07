import { prop, Ref } from "@typegoose/typegoose";
import { BaseModel } from "./base.js";
import { Offer } from "./offer.js";
import { User } from "./user.js";

export class Comment extends BaseModel {
  @prop({ required: true, minlength: 5, maxlength: 1024 })
  public text!: string;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, ref: () => User })
  public author!: Ref<User>;

  @prop({ required: true, ref: () => Offer })
  public offer!: Ref<Offer>;
}
