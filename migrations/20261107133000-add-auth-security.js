import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  const tables = await queryInterface.showAllTables();
  const tableNames = tables
    .map((table) =>
      typeof table === "string" ? table : Object.values(table)[0],
    )
    .map((table) => String(table).toLowerCase());

  if (!tableNames.includes("users")) {
    throw new Error("La table users doit exister avant la migration d’authentification.");
  }

  const userColumns = await queryInterface.describeTable("users");
  if (!userColumns.role) {
    await queryInterface.addColumn("users", "role", {
      type: DataTypes.ENUM("ADMIN", "TEACHER", "LEARNER"),
      allowNull: false,
      defaultValue: "LEARNER",
    });
  }

  if (!tableNames.includes("user_sessions")) {
    await queryInterface.createTable("user_sessions", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      refreshTokenHash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  }

  if (!tableNames.includes("login_attempts")) {
    await queryInterface.createTable("login_attempts", {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      attempts: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      windowStartedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("login_attempts", ["email", "ipAddress"], {
      unique: true,
      name: "login_attempts_email_ip_unique",
    });
  }

  if (!tableNames.includes("auth_logs")) {
    await queryInterface.createTable("auth_logs", {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
      },
      event: {
        type: DataTypes.ENUM("LOGIN_SUCCESS", "LOGIN_FAILURE", "LOGOUT"),
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("auth_logs", ["userId", "createdAt"]);
    await queryInterface.addIndex("auth_logs", ["email", "createdAt"]);
  }
}

export async function down(queryInterface) {
  const tables = await queryInterface.showAllTables();
  const tableNames = tables
    .map((table) =>
      typeof table === "string" ? table : Object.values(table)[0],
    )
    .map((table) => String(table).toLowerCase());

  if (tableNames.includes("auth_logs")) {
    await queryInterface.dropTable("auth_logs");
  }
  if (tableNames.includes("login_attempts")) {
    await queryInterface.dropTable("login_attempts");
  }
  if (tableNames.includes("user_sessions")) {
    await queryInterface.dropTable("user_sessions");
  }

  if (tableNames.includes("users")) {
    const userColumns = await queryInterface.describeTable("users");
    if (userColumns.role) {
      await queryInterface.removeColumn("users", "role");
    }
  }
}
