import { Model } from "sequelize-typescript";
export declare const USER_ROLES: readonly ["ADMIN", "TEACHER", "LEARNER"];
export type UserRole = (typeof USER_ROLES)[number];
export declare class User extends Model {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}
//# sourceMappingURL=User.d.ts.map