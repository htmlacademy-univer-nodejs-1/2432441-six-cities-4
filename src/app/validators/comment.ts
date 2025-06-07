import Joi from "joi";
import { CreateCommentRequest } from "../../schema/schema.js";

export const CreateCommentRequestSchema = Joi.object<CreateCommentRequest>({
  text: Joi.string().min(5).max(1024).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});
