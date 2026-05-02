import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { connectDB } from "../database/db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido no ambiente");
}
const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
}

export async function findUserByEmail(email) {
  const db = await connectDB();

  return db.get(
    `SELECT 
      id, 
      name, 
      email, 
      password_hash, 
      role, 
      resetToken, 
      resetTokenExpires 
     FROM users 
     WHERE email = ?`,
    [email],
  );
}

export async function createUser({ name, email, password, role = "user" }) {
  const db = await connectDB();
  const hashedPassword = await hashPassword(password);
  const id = crypto.randomUUID();

  await db.run(
    `INSERT INTO users (
      id, 
      name, 
      email, 
      password_hash, 
      role
    ) VALUES (?, ?, ?, ?, ?)`,
    [id, name, email, hashedPassword, role],
  );

  return {
    id,
    name,
    email,
    role,
  };
}

export function sanitizeUser(user) {
  if (!user) return null;

  const { password_hash, resetToken, resetTokenExpires, ...safeUser } = user;

  return safeUser;
}

export function generateResetToken() {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = hashResetToken(token);

  return {
    token,
    hashedToken,
  };
}

export function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function findUserByResetToken(token) {
  const db = await connectDB();
  const hashedToken = hashResetToken(token);

  return db.get(
    `SELECT 
      id, 
      name, 
      email, 
      password_hash, 
      role, 
      resetTokenExpires 
     FROM users 
     WHERE resetToken = ?`,
    [hashedToken],
  );
}

export async function updateUserResetToken(email, hashedToken, expires) {
  const db = await connectDB();

  await db.run(
    `UPDATE users 
     SET 
      resetToken = ?, 
      resetTokenExpires = ?, 
      updatedAt = datetime('now') 
     WHERE email = ?`,
    [hashedToken, expires.toISOString(), email],
  );
}

export async function clearResetToken(userId) {
  const db = await connectDB();

  await db.run(
    `UPDATE users 
     SET 
      resetToken = NULL, 
      resetTokenExpires = NULL, 
      updatedAt = datetime('now') 
     WHERE id = ?`,
    [userId],
  );
}

export async function updatePassword(userId, newPassword) {
  const db = await connectDB();
  const hashedPassword = await hashPassword(newPassword);

  await db.run(
    `UPDATE users 
     SET 
      password_hash = ?, 
      updatedAt = datetime('now') 
     WHERE id = ?`,
    [hashedPassword, userId],
  );
}

export async function createInvite({ email, role = "admin", createdBy }) {
  const db = await connectDB();
  const id = crypto.randomUUID();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 horas

  await db.run(
    `INSERT INTO invites (
      id, 
      email, 
      token, 
      role, 
      expires_at, 
      created_by
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, email, token, role, expiresAt.toISOString(), createdBy],
  );

  return { id, email, token, role, expiresAt };
}

export async function findInviteByToken(token) {
  const db = await connectDB();

  return db.get(
    `SELECT 
      id, 
      email, 
      role, 
      expires_at, 
      used, 
      created_by
     FROM invites 
     WHERE token = ? AND used = 0`,
    [token],
  );
}

export async function markInviteAsUsed(inviteId) {
  const db = await connectDB();

  await db.run(
    `UPDATE invites 
     SET used = 1 
     WHERE id = ?`,
    [inviteId],
  );
}

export async function createAdminLog(action, details = {}) {
  const db = await connectDB();
  const id = crypto.randomUUID();

  await db.run(
    `INSERT INTO admin_logs (
      id, 
      action, 
      details
    ) VALUES (?, ?, ?)`,
    [id, action, JSON.stringify(details)],
  );
}

export async function removeAdmin(userId, currentUserId) {
  const db = await connectDB();

  // Impedir auto-remoção
  if (userId === currentUserId) {
    throw new Error("Você não pode remover sua própria conta.");
  }

  // Verificar se é admin
  const user = await db.get("SELECT id, name, email, role FROM users WHERE id = ?", [userId]);
  
  if (!user) {
    throw new Error("Administrador não encontrado.");
  }

  if (user.role !== "admin") {
    throw new Error("Usuário não é um administrador.");
  }

  // Verificar se é o único admin restante
  const adminCount = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
  
  if (adminCount.count <= 1) {
    throw new Error("Não é possível remover o último administrador.");
  }

  // Remover o administrador
  await db.run("DELETE FROM users WHERE id = ?", [userId]);

  return user;
}

export async function getAllAdmins() {
  const db = await connectDB();
  
  const admins = await db.all(
    `SELECT id, name, email, createdAt 
     FROM users 
     WHERE role = 'admin' 
     ORDER BY createdAt DESC`
  );
  
  return admins;
}