import { connectDB } from "../database/db.js";
import { sendResetPasswordEmail } from "../services/email.service.js";
import {
  comparePassword,
  createUser,
  findUserByEmail,
  generateToken,
  sanitizeUser,
  generateResetToken,
  findUserByResetToken,
  updateUserResetToken,
  clearResetToken,
  updatePassword,
} from "../services/auth.service.js";

const PASSWORD_MIN_LENGTH = 6;

function getResetPasswordLink(token) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${frontendUrl}/reset-password?token=${token}`;
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({
        message: `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "E-mail já está em uso.",
      });
    }

    const user = await createUser({
      name,
      email,
      password,
      role: "user",
    });

    return res.status(201).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "E-mail e senha são obrigatórios.",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos.",
      });
    }

    const isValidPassword = await comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos.",
      });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: sanitizeUser(user),
      mustChangePassword: user.must_change_password === 1,
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "E-mail é obrigatório.",
      });
    }

    const user = await findUserByEmail(email);

    const defaultMessage =
      "Se o e-mail existir, um link de redefinição foi enviado.";

    if (!user) {
      return res.json({ message: defaultMessage });
    }

    const { token, hashedToken } = generateResetToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await updateUserResetToken(email, hashedToken, expires);

    const resetLink = getResetPasswordLink(token);

     console.log(`Reset link for ${email}: ${resetLink}`);
     await sendResetPasswordEmail(email, resetLink);
    return res.json({
      message: defaultMessage,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const db = await connectDB();

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token e nova senha são obrigatórios.",
      });
    }

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({
        message: `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      });
    }

    const user = await findUserByResetToken(token);

    if (!user) {
      return res.status(400).json({
        message: "Token inválido ou expirado.",
      });
    }

    const now = new Date();
    const expires = new Date(user.resetTokenExpires);

    if (!user.resetTokenExpires || Number.isNaN(expires.getTime()) || now > expires) {
      await clearResetToken(user.id);

      return res.status(400).json({
        message: "Token inválido ou expirado.",
      });
    }

    //  atualiza senha
    await updatePassword(user.id, newPassword);

    //  limpa token
    await clearResetToken(user.id);

    //   libera usuário (primeiro login concluído)
    await db.run(
      "UPDATE users SET must_change_password = 0 WHERE id = ?",
      [user.id]
    );

    return res.json({
      message: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    next(error);
  }
}

export async function createAdmin(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({
        message: `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "E-mail já está em uso.",
      });
    }

    const user = await createUser({
      name,
      email,
      password,
      role: "admin",
    });

    return res.status(201).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}