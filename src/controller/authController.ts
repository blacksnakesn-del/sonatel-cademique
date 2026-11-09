import type { Request, Response } from "express";
import * as authService from "../service/authentificate.js";

function getRequestContext(req: Request): authService.AuthContext {
  return {
    ipAddress: req.ip || null,
    userAgent: req.get("user-agent")?.slice(0, 500) || null,
  };
}

function sendError(
  res: Response,
  error: unknown,
  operation: string,
): void {
  if (error instanceof authService.AuthServiceError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  console.error(`Erreur pendant ${operation} :`, error);
  res.status(500).json({ message: "Une erreur interne est survenue." });
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      message: "Inscription réussie.",
      user,
    });
  } catch (error) {
    sendError(res, error, "l’inscription");
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const result = await authService.login(req.body, getRequestContext(req));
    res.status(200).json({
      message: "Connexion réussie.",
      ...result,
    });
  } catch (error) {
    sendError(res, error, "la connexion");
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const body: unknown = req.body;
    const refreshToken =
      typeof body === "object" && body !== null && "refreshToken" in body
        ? body.refreshToken
        : undefined;
    const tokens = await authService.refresh(refreshToken);
    res.status(200).json({ tokens });
  } catch (error) {
    sendError(res, error, "le renouvellement du token");
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ message: "Authentification requise." });
    return;
  }

  try {
    await authService.logout(
      req.auth.sessionId,
      req.auth.userId,
      getRequestContext(req),
    );
    res.status(200).json({ message: "Déconnexion réussie." });
  } catch (error) {
    sendError(res, error, "la déconnexion");
  }
}

export async function profile(req: Request, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ message: "Authentification requise." });
    return;
  }

  try {
    const user = await authService.getProfile(req.auth.userId);
    res.status(200).json({ user });
  } catch (error) {
    sendError(res, error, "la lecture du profil");
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ message: "Authentification requise." });
    return;
  }

  try {
    const user = await authService.updateProfile(req.auth.userId, req.body);
    res.status(200).json({ user });
  } catch (error) {
    sendError(res, error, "la modification du profil");
  }
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await authService.listUsers();
    res.status(200).json({ users });
  } catch (error) {
    sendError(res, error, "la liste des utilisateurs");
  }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    res.status(400).json({ message: "Identifiant utilisateur invalide." });
    return;
  }

  const body: unknown = req.body;
  const role =
    typeof body === "object" && body !== null && "role" in body
      ? body.role
      : undefined;

  try {
    const user = await authService.setUserRole(userId, role);
    res.status(200).json({ user });
  } catch (error) {
    sendError(res, error, "la modification du rôle");
  }
}
