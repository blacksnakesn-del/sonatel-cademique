import { DataType } from "sequelize-typescript";
import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

export const USER_ROLES = ["ADMIN", "TEACHER", "LEARNER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

@Table({
  tableName: "users",
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(254),
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare passwordHash: string;

  @AllowNull(false)
  @Default("LEARNER")
  @Column({
    type: DataType.ENUM(...USER_ROLES),
  })
  declare role: UserRole;
}
