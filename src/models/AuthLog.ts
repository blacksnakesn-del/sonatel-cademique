import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

export type AuthLogEvent =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "LOGOUT";

@Table({
  tableName: "auth_logs",
})
export class AuthLog extends Model {
  @AllowNull(true)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  declare userId: number | null;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(254),
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("LOGIN_SUCCESS", "LOGIN_FAILURE", "LOGOUT"),
  })
  declare event: AuthLogEvent;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(45),
  })
  declare ipAddress: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(500),
  })
  declare userAgent: string | null;
}
