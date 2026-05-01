import rateLimit from "express-rate-limit";

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // limite de 10 tentativas
  message: {
    success: false,
    message: "Muitas tentativas de login. Tente novamente em 15 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // limite de 5 tentativas
  message: {
    success: false,
    message: "Muitas solicitações de recuperação. Tente novamente em 1 hora."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const inviteRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // limite de 3 convites por hora
  message: {
    success: false,
    message: "Muitos convites enviados. Tente novamente em 1 hora."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
