import type { User } from "../models/User.js";
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    tokenType: "Bearer";
    expiresIn: number;
}
export declare function hashRefreshToken(token: string): string;
export declare function createRefreshToken(): string;
export declare function refreshExpiry(): Date;
export declare function getTokenPair(user: User, sessionId: string, refreshToken: string): TokenPair;
//# sourceMappingURL=authTokens.d.ts.map