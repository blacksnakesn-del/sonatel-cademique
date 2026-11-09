var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AllowNull, Column, DataType, Model, Table, } from "sequelize-typescript";
let LoginAttempt = class LoginAttempt extends Model {
};
__decorate([
    AllowNull(false),
    Column({
        type: DataType.STRING(254),
    })
], LoginAttempt.prototype, "email", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.STRING(45),
    })
], LoginAttempt.prototype, "ipAddress", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.INTEGER.UNSIGNED,
    })
], LoginAttempt.prototype, "attempts", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.DATE,
    })
], LoginAttempt.prototype, "windowStartedAt", void 0);
__decorate([
    AllowNull(true),
    Column({
        type: DataType.DATE,
    })
], LoginAttempt.prototype, "lockedUntil", void 0);
LoginAttempt = __decorate([
    Table({
        tableName: "login_attempts",
        indexes: [
            {
                unique: true,
                fields: ["email", "ipAddress"],
            },
        ],
    })
], LoginAttempt);
export { LoginAttempt };
//# sourceMappingURL=LoginAttempt.js.map