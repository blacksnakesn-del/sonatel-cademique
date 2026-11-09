import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../config/database.js";
import { AuthServiceError } from "./authErrors.js";
import { writeAuthLog } from "./authAudit.js";
import { User } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";
import { LoginAttempt } from "../models/LoginAttempt.js";
import { createRefreshToken, getTokenPair, hashRefreshToken, refreshExpiry, } from "./authTokens.js";
import { getCredentials } from "./authValidation.js";
import { isLoginLocked, recordFailedAttempt } from "./loginAttempts.js";
function toProfile(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
}
export async function login(data, context) {
    const { email, password } = getCredentials(data);
    const ipAddress = context.ipAddress ?? "unknown";
    if (await isLoginLocked(email, ipAddress)) {
        await writeAuthLog("LOGIN_FAILURE", email, null, context);
        throw new AuthServiceError("Trop de tentatives. Réessayez plus tard.", 429);
    }
    const user = await User.findOne({ where: { email } });
    const passwordIsValid = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;
    if (!user || !passwordIsValid) {
        await recordFailedAttempt(email, ipAddress);
        await writeAuthLog("LOGIN_FAILURE", email, user?.id ?? null, context);
        throw new AuthServiceError("Email ou mot de passe incorrect.", 401);
    }
    const refreshToken = createRefreshToken();
    const session = await sequelize.transaction(async (transaction) => {
        await LoginAttempt.destroy({
            where: { email, ipAddress },
            transaction,
        });
        const newSession = await UserSession.create({
            userId: user.id,
            refreshTokenHash: hashRefreshToken(refreshToken),
            expiresAt: refreshExpiry(),
            revokedAt: null,
        }, { transaction });
        await writeAuthLog("LOGIN_SUCCESS", email, user.id, context, transaction);
        return newSession;
    });
    return {
        user: toProfile(user),
        tokens: getTokenPair(user, session.id, refreshToken),
    };
}
export async function refresh(refreshToken) {
    if (typeof refreshToken !== "string" ||
        !/^[A-Za-z0-9_-]{64}$/.test(refreshToken)) {
        throw new AuthServiceError("Refresh token invalide.", 401);
    }
    const nextRefreshToken = createRefreshToken();
    const nextRefreshTokenHash = hashRefreshToken(nextRefreshToken);
    const result = await sequelize.transaction(async (transaction) => {
        const session = await UserSession.findOne({
            where: { refreshTokenHash: hashRefreshToken(refreshToken) },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!session ||
            session.revokedAt ||
            session.expiresAt.getTime() <= Date.now()) {
            throw new AuthServiceError("Refresh token invalide ou expiré.", 401);
        }
        const user = await User.findByPk(session.userId, { transaction });
        if (!user) {
            throw new AuthServiceError("Utilisateur introuvable.", 401);
        }
        await session.update({
            refreshTokenHash: nextRefreshTokenHash,
            expiresAt: refreshExpiry(),
        }, { transaction });
        return { user, sessionId: session.id };
    });
    return getTokenPair(result.user, result.sessionId, nextRefreshToken);
}
export async function logout(sessionId, userId, context) {
    await sequelize.transaction(async (transaction) => {
        const session = await UserSession.findOne({
            where: {
                id: sessionId,
                userId,
                revokedAt: { [Op.is]: null },
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!session) {
            return;
        }
        await session.update({ revokedAt: new Date() }, { transaction });
        const user = await User.findByPk(userId, { transaction });
        await writeAuthLog("LOGOUT", user?.email ?? "", userId, context, transaction);
    });
}
//# sourceMappingURL=authSessions.js.map