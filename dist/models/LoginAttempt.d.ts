import { Model } from "sequelize-typescript";
export declare class LoginAttempt extends Model {
    email: string;
    ipAddress: string;
    attempts: number;
    windowStartedAt: Date;
    lockedUntil: Date | null;
}
//# sourceMappingURL=LoginAttempt.d.ts.map