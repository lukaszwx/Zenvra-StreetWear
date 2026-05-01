import multer from "multer";
import { logError } from "../utils/logger.js";

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada.",
  });
}

export function errorHandler(err, req, res, next) {
  logError(err, req);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Tamanho máximo permitido: 5MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Erro no upload de arquivo.",
    });
  }

  if (err.message && err.message.includes("CORS policy")) {
    return res.status(403).json({
      success: false,
      message: "Origem não autorizada.",
    });
  }

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Erro interno do servidor.",
  });
}
