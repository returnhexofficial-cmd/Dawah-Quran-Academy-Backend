import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { config } from "../config";

type TAppError = Error & {
  statusCode?: number;
  status?: string;
};

/**
 * Error codes the client can branch on. `TOKEN_EXPIRED` is what tells the
 * frontend interceptor to attempt a silent refresh instead of logging out.
 */
export const ERROR_CODE = {
  tokenExpired: "TOKEN_EXPIRED",
  tokenInvalid: "TOKEN_INVALID",
  internal: "INTERNAL_ERROR",
} as const;

const globalErrorHandler = (
  err: TAppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errorCode: string = err.statusCode ? "" : ERROR_CODE.internal;

  // jsonwebtoken throws plain Errors with no statusCode, which previously
  // surfaced as a 500 and made expiry indistinguishable from a server fault.
  if (err.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Access token has expired";
    errorCode = ERROR_CODE.tokenExpired;
  } else if (err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid token. Please log in again.";
    errorCode = ERROR_CODE.tokenInvalid;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errorCode ? { errorCode } : {}),
    // Never ship internals to the client in production.
    ...(config.node_env === "production"
      ? {}
      : { errorName: err.name, stack: err.stack }),
  });
};

export default globalErrorHandler;
