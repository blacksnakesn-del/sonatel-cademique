import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

@Table({
  tableName: "user_sessions",
})
export class UserSession extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  declare id: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  declare userId: number;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.CHAR(64),
  })
  declare refreshTokenHash: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  declare expiresAt: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  declare revokedAt: Date | null;
}
