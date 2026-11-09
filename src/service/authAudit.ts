import type { Transaction } from "sequelize";

import { AuthLog, type AuthLogEvent } from "../models/AuthLog.js";
import type { AuthContext } from "./authTypes.js";

export async function writeAuthLog(
  event: AuthLogEvent,
  email: string,
  userId: number | null,
  context: AuthContext,
  transaction?: Transaction,
): Promise<void> {
  await AuthLog.create(
    {
      event,
      email,
      userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    },
    transaction ? { transaction } : undefined,
  );
}
