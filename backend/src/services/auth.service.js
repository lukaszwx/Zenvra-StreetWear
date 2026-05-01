import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { connectDB } from "../database/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "zenvra-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
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

const user = await createUser({
  name,
  email,
  password,
  role: "admin",
  mustChangePassword: 1,
});