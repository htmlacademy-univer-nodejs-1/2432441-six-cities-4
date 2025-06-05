import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  constructor(
    public readonly code: StatusCodes,
    message: string,
  ) {
    super(message);
  }
}
