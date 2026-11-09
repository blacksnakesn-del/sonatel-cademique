import { Op } from "sequelize";
import bcrypt from "bcrypt";

import { User } from "../models/User.js";
import { AuthServiceError } from "./authErrors.js";
import {
  isRecord,
  isUserRole,
  normalizeEmail,
  requiredPassword,
  requiredString,
} from "./authValidation.js";

function toProfile(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function register(data: unknown) {
  if (!isRecord(data)) {
    throw new AuthServiceError("Données d’inscription invalides.", 400);
  }

  const name = requiredString(data.name, "nom");
  if (name.length > 100) {
    throw new AuthServiceError("Le nom ne peut pas dépasser 100 caractères.", 400);
  }

  const email = normalizeEmail(data.email);
  const password = requiredPassword(data.password);
  const passwordLength = Buffer.byteLength(password, "utf8");
  if (passwordLength < 8 || passwordLength > 72) {
    throw new AuthServiceError(
      "Le mot de passe doit contenir entre 8 et 72 octets.",
      400,
    );
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AuthServiceError("Cet email est déjà utilisé.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: "LEARNER",
  });

  return toProfile(user);
}

export async function getProfile(userId: number) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AuthServiceError("Utilisateur introuvable.", 404);
  }
  return toProfile(user);
}

export async function updateProfile(userId: number, data: unknown) {
  if (!isRecord(data)) {
    throw new AuthServiceError("Données de profil invalides.", 400);
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AuthServiceError("Utilisateur introuvable.", 404);
  }

  if ("role" in data || "passwordHash" in data) {
    throw new AuthServiceError(
      "Le rôle et le mot de passe ne peuvent pas être modifiés ici.",
      400,
    );
  }

  if ("name" in data) {
    const name = requiredString(data.name, "nom");
    if (name.length > 100) {
      throw new AuthServiceError(
        "Le nom ne peut pas dépasser 100 caractères.",
        400,
      );
    }
    user.name = name;
  }

  if ("email" in data) {
    const email = normalizeEmail(data.email);
    const existingUser = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: userId },
      },
    });
    if (existingUser) {
      throw new AuthServiceError("Cet email est déjà utilisé.", 409);
    }
    user.email = email;
  }

  if (!("name" in data) && !("email" in data)) {
    throw new AuthServiceError(
      "Aucune modification de profil fournie.",
      400,
    );
  }

  await user.save();
  return toProfile(user);
}

export async function listUsers() {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "createdAt"],
    order: [["id", "ASC"]],
    limit: 100,
  });
  return users.map(toProfile);
}

export async function setUserRole(userId: number, role: unknown) {
  if (!isUserRole(role)) {
    throw new AuthServiceError("Rôle invalide.", 400);
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AuthServiceError("Utilisateur introuvable.", 404);
  }

  user.role = role;
  await user.save();
  return toProfile(user);
}
