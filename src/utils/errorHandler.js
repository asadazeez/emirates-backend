import { statusCode } from "./statusCode.js";

export const validationError = (message) => {
  const err = new Error();
  err.status = statusCode.validationError;
  err.message = message;
  return err;
};
export const serverError = (message = "Internal Server Error ") => {
  const err = new Error();
  err.status = statusCode.serverError;
  err.message = message;
  return err;
};
