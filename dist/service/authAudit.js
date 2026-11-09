import { AuthLog } from "../models/AuthLog.js";
export async function writeAuthLog(event, email, userId, context, transaction) {
    await AuthLog.create({
        event,
        email,
        userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
    }, transaction ? { transaction } : undefined);
}
//# sourceMappingURL=authAudit.js.map