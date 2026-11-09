import { Model } from "sequelize";
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
export declare class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: CreationOptional<number>;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
//# sourceMappingURL=user.d.ts.map