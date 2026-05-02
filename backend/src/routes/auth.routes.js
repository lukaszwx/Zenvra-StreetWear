import express from "express";
import {
  login,
  forgotPassword,
  resetPassword,
  createAdmin,
  inviteAdmin,
  acceptInvite,
  deleteAdmin,
  listAdmins,
} from "../controllers/auth.controller.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  loginRateLimit,
  forgotPasswordRateLimit,
  inviteRateLimit,
} from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/login", loginRateLimit, login);

router.post("/forgot-password", forgotPasswordRateLimit, forgotPassword);

router.post("/reset-password", resetPassword);

router.post(
  "/admins",
  authMiddleware,
  adminMiddleware,
  createAdmin
);

router.post(
  "/invite",
  authMiddleware,
  adminMiddleware,
  inviteRateLimit,
  inviteAdmin
);

router.post("/accept-invite", acceptInvite);

router.delete(
  "/admins/:adminId",
  authMiddleware,
  adminMiddleware,
  deleteAdmin
);

router.get(
  "/admins",
  authMiddleware,
  adminMiddleware,
  listAdmins
);

export default router;