var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AllowNull, Column, DataType, Model, Table, } from "sequelize-typescript";
let AuthLog = class AuthLog extends Model {
};
__decorate([
    AllowNull(true),
    Column({
        type: DataType.INTEGER.UNSIGNED,
    })
], AuthLog.prototype, "userId", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.STRING(254),
    })
], AuthLog.prototype, "email", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.ENUM("LOGIN_SUCCESS", "LOGIN_FAILURE", "LOGOUT"),
    })
], AuthLog.prototype, "event", void 0);
__decorate([
    AllowNull(true),
    Column({
        type: DataType.STRING(45),
    })
], AuthLog.prototype, "ipAddress", void 0);
__decorate([
    AllowNull(true),
    Column({
        type: DataType.STRING(500),
    })
], AuthLog.prototype, "userAgent", void 0);
AuthLog = __decorate([
    Table({
        tableName: "auth_logs",
    })
], AuthLog);
export { AuthLog };
//# sourceMappingURL=AuthLog.js.map