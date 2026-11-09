var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique, } from "sequelize-typescript";
let UserSession = class UserSession extends Model {
};
__decorate([
    PrimaryKey,
    Default(DataType.UUIDV4),
    Column({
        type: DataType.UUID,
    })
], UserSession.prototype, "id", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.INTEGER.UNSIGNED,
    })
], UserSession.prototype, "userId", void 0);
__decorate([
    AllowNull(false),
    Unique,
    Column({
        type: DataType.CHAR(64),
    })
], UserSession.prototype, "refreshTokenHash", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.DATE,
    })
], UserSession.prototype, "expiresAt", void 0);
__decorate([
    AllowNull(true),
    Column({
        type: DataType.DATE,
    })
], UserSession.prototype, "revokedAt", void 0);
UserSession = __decorate([
    Table({
        tableName: "user_sessions",
    })
], UserSession);
export { UserSession };
//# sourceMappingURL=UserSession.js.map