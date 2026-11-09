import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export function hashRefreshToken(token) {
    return createHash("sha256").update(token).digest("hex");
}
export function createRefreshToken() {
    return randomBytes(48).toString("base64url");
}
export function refreshExpiry() {
    return new Date(Date.now() + env.jwt.refreshTokenTtlDays * 24 * 60 * 60 * 1000);
}
function signAccessToken(user, sessionId) {
    if (!env.jwt.secret) {
        throw new Error("La variable JWT_SECRET est obligatoire.");
    }
    return jwt.sign({
        sub: String(user.id),
        sid: sessionId,
    }, env.jwt.secret, {
        expiresIn: env.jwt.accessTokenTtlSeconds,
    });
}
export function getTokenPair(user, sessionId, refreshToken) {
    return {
        accessToken: signAccessToken(user, sessionId),
        refreshToken,
        tokenType: "Bearer",
        expiresIn: env.jwt.accessTokenTtlSeconds,
    };
}
//# sourceMappingURL=authTokens.js.map