import { Model } from "sequelize-typescript";
export type AuthLogEvent = "LOGIN_SUCCESS" | "LOGIN_FAILURE" | "LOGOUT";
export declare class AuthLog extends Model {
    userId: number | null;
    email: string;
    event: AuthLogEvent;
    ipAddress: string | null;
    userAgent: string | null;
}
//# sourceMappingURL=AuthLog.d.ts.map