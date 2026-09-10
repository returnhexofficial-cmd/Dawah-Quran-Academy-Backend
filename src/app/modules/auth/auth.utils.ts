import jwt from "jsonwebtoken";
import { config } from "../../config";

export type TJwtPayload = {
  userId: string;
  email: string;
  role: string;
  status: string;
  name: string;
};

export const createToken = (
  jwtPayload: TJwtPayload | { userId: string; role: string },
  secret: string,
  expiresIn: number
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

/**
 * Single source of truth for access/refresh token claims. Login and refresh
 * must produce identical payloads, otherwise the client silently loses
 * claims (name, email, status) the first time a token is refreshed.
 */
export const buildJwtPayload = (user: {
  _id: unknown;
  email: string;
  role: string;
  status: string;
  name: string;
}): TJwtPayload => ({
  userId: String(user._id),
  email: user.email,
  role: user.role,
  status: user.status,
  name: user.name,
});

const isProduction = config.node_env === "production";
const refreshTokenMaxAgeMs =
  (Number(config.jwt_refresh_expiresIn) || 60 * 60 * 24 * 30) * 1000;

/**
 * SameSite=None is only honoured when the cookie is also Secure, so a
 * non-HTTPS dev server must fall back to Lax. Lax still works across
 * localhost:3000 -> localhost:5000 because ports do not affect site scope.
 * maxAge tracks the refresh token's own expiry so the browser stops sending
 * a cookie that can no longer verify.
 */
export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/",
  maxAge: refreshTokenMaxAgeMs,
};

// clearCookie must match every attribute except maxAge/expires to remove it.
export const clearRefreshTokenCookieOptions = {
  httpOnly: refreshTokenCookieOptions.httpOnly,
  secure: refreshTokenCookieOptions.secure,
  sameSite: refreshTokenCookieOptions.sameSite,
  path: refreshTokenCookieOptions.path,
};

export const REFRESH_TOKEN_COOKIE = "refreshToken";
