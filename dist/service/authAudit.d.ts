import type { Transaction } from "sequelize";
import { type AuthLogEvent } from "../models/AuthLog.js";
import type { AuthContext } from "./authTypes.js";
export declare function writeAuthLog(event: AuthLogEvent, email: string, userId: number | null, context: AuthContext, transaction?: Transaction): Promise<void>;
//# sourceMappingURL=authAudit.d.ts.map