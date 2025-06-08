import { User } from "../models/user.js";

declare module "express" {
  export interface Request {
    user?: User;
  }
}
