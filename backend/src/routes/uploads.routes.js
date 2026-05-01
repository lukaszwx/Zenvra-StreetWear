import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

const uploadDir = path.resolve("uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDir);
  },

  filename(req, file, callback) {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    callback(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Apenas arquivos JPG, JPEG, PNG ou WEBP são permitidos."));
    }
  },
});

router.post("/", authMiddleware, (req, res, next) => {
  upload.single("image")(req, res, (uploadError) => {
    if (uploadError) {
      return next(uploadError);
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Nenhuma imagem enviada.",
      });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(201).json({
      url: imageUrl,
    });
  });
});

export default router;
