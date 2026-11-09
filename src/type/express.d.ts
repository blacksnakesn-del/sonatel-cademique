import type { UserRole } from "../models/User.js";

declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: number;
                sessionId: string;
                role: UserRole;
            };
        }
    }
}

export {};
 