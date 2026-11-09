import type { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User, type UserRole } from "../models/User.js";
import { UserSession } from "../models/UserSession.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Token manquant." });
    return;
  }

  const [scheme, token, ...extraParts] = authHeader.trim().split(/\s+/);
  if (scheme !== "Bearer" || !token || extraParts.length > 0) {
    res.status(401).json({ message: "Token invalide." });
    return;
  }

  if (!env.jwt.secret) {
    res.status(500).json({ message: "Configuration du serveur invalide." });
    return;
  }

  let decoded: string | jwt.JwtPayload;
  try {
    decoded = jwt.verify(token, env.jwt.secret);
  } catch {
    res.status(401).json({ message: "Token invalide ou expiré." });
    return;
  }

  if (
    typeof decoded === "string" ||
    typeof decoded.sub !== "string" ||
    typeof decoded.sid !== "string"
  ) {
    res.status(401).json({ message: "Token invalide." });
    return;
  }

  const userId = Number(decoded.sub);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    res.status(401).json({ message: "Token invalide." });
    return;
  }

  const session = await UserSession.findOne({
    where: {
      id: decoded.sid,
      userId,
      revokedAt: { [Op.is]: null },
      expiresAt: { [Op.gt]: new Date() },
    },
  });
  if (!session) {
    res.status(401).json({ message: "Session révoquée ou expirée." });
    return;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    res.status(401).json({ message: "Utilisateur introuvable." });
    return;
  }

  req.auth = {
    userId,
    sessionId: session.id,
    role: user.role,
  };
  next();
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({ message: "Accès interdit." });
      return;
    }

    next();
  };
}
