import express from "express";
import {
  login,
  forgotPassword,
  resetPassword,
  createAdmin,
} from "../controllers/auth.controller.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post(
  "/admins",
  authMiddleware,
  adminMiddleware,
  createAdmin
);

export default router;