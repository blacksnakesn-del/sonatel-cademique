import { Model } from "sequelize-typescript";
export declare class UserSession extends Model {
    id: string;
    userId: number;
    refreshTokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
}
//# sourceMappingURL=UserSession.d.ts.map