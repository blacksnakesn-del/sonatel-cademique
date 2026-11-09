import { USER_ROLES, type UserRole } from "../models/User.js";
import { AuthServiceError } from "./authErrors.js";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AuthServiceError(`Le champ ${field} est obligatoire.`, 400);
  }

  return value.trim();
}

export function normalizeEmail(value: unknown): string {
  const email = requiredString(value, "email").toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthServiceError("Adresse e-mail invalide.", 400);
  }
  return email;
}

export function requiredPassword(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new AuthServiceError("Le mot de passe est obligatoire.", 400);
  }
  return value;
}

export function getCredentials(
  data: unknown,
): { email: string; password: string } {
  if (!isRecord(data)) {
    throw new AuthServiceError("Données de connexion invalides.", 400);
  }

  return {
    email: normalizeEmail(data.email),
    password: requiredPassword(data.password),
  };
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" &&
    USER_ROLES.some((allowedRole) => allowedRole === value);
}
