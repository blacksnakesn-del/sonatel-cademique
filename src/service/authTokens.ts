import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import type { User } from "../models/User.js";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

export function refreshExpiry(): Date {
  return new Date(
    Date.now() + env.jwt.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
  );
}

function signAccessToken(user: User, sessionId: string): string {
  if (!env.jwt.secret) {
    throw new Error("La variable JWT_SECRET est obligatoire.");
  }

  return jwt.sign(
    {
      sub: String(user.id),
      sid: sessionId,
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.accessTokenTtlSeconds,
    },
  );
}

export function getTokenPair(
  user: User,
  sessionId: string,
  refreshToken: string,
): TokenPair {
  return {
    accessToken: signAccessToken(user, sessionId),
    refreshToken,
    tokenType: "Bearer",
    expiresIn: env.jwt.accessTokenTtlSeconds,
  };
}
