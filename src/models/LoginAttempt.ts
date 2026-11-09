import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "login_attempts",
  indexes: [
    {
      unique: true,
      fields: ["email", "ipAddress"],
    },
  ],
})
export class LoginAttempt extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(254),
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(45),
  })
  declare ipAddress: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  declare attempts: number;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  declare windowStartedAt: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  declare lockedUntil: Date | null;
}
