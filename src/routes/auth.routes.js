import express from "express";

const router = express.Router();

const ADMIN_EMAIL = "admin@zenvra.com";
const ADMIN_PASSWORD = "123456";
const ADMIN_TOKEN = "zenvra-admin-token";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      message: "E-mail ou senha inválidos.",
    });
  }

  res.json({
    token: ADMIN_TOKEN,
    user: {
      email: ADMIN_EMAIL,
      role: "admin",
    },
  });
});

export default router;