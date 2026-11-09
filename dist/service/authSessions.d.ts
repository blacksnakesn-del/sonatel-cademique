import type { AuthContext } from "./authTypes.js";
import { User } from "../models/User.js";
import { type TokenPair } from "./authTokens.js";
declare function toProfile(user: User): {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "LEARNER" | "TEACHER";
    createdAt: any;
};
export declare function login(data: unknown, context: AuthContext): Promise<{
    user: ReturnType<typeof toProfile>;
    tokens: TokenPair;
}>;
export declare function refresh(refreshToken: unknown): Promise<TokenPair>;
export declare function logout(sessionId: string, userId: number, context: AuthContext): Promise<void>;
export {};
//# sourceMappingURL=authSessions.d.ts.map