import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===== ROTAS PÚBLICAS ===== */

// Listar todos os produtos
router.get("/", getProducts);

// Buscar produto por ID
router.get("/:id", getProductById);



// Criar produto
router.post("/", authMiddleware, createProduct);

// Atualizar produto
router.put("/:id", authMiddleware, updateProduct);

// Deletar produto
router.delete("/:id", authMiddleware, deleteProduct);

export default router;