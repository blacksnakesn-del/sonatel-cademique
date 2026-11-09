import { type UserRole } from "../models/User.js";
export declare function isRecord(value: unknown): value is Record<string, unknown>;
export declare function requiredString(value: unknown, field: string): string;
export declare function normalizeEmail(value: unknown): string;
export declare function requiredPassword(value: unknown): string;
export declare function getCredentials(data: unknown): {
    email: string;
    password: string;
};
export declare function isUserRole(value: unknown): value is UserRole;
//# sourceMappingURL=authValidation.d.ts.map