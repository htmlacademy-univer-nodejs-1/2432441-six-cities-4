import Joi from "joi";
import { CreateUserRequest } from "../../schema/schema.js";

export const CreateUserRequestSchema = Joi.object<CreateUserRequest>({
  name: Joi.string().min(1).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
});
