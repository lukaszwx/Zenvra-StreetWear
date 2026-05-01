import express from "express";
import {
  createPromotionController,
  getAllPromotionsController,
  getActivePromotionsController,
  updatePromotionController,
  deletePromotionController,
  createCouponController,
  getAllCouponsController,
  getActiveCouponsController,
  updateCouponController,
  deleteCouponController,
  validateCouponController,
  useCouponController,
  calculateProductDiscountController,
} from "../controllers/promotion.controller.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Rotas de Promoções (apenas admin)
router.post(
  "/promotions",
  authMiddleware,
  adminMiddleware,
  createPromotionController
);

router.get(
  "/promotions",
  authMiddleware,
  adminMiddleware,
  getAllPromotionsController
);

router.get(
  "/promotions/active",
  getActivePromotionsController // Público - para exibição no site
);

// Rotas públicas para o site principal
router.get(
  "/public/promotions",
  getActivePromotionsController // Público - para exibição no site
);

router.get(
  "/public/coupons",
  getActiveCouponsController // Público - para exibição no site
);

router.put(
  "/promotions/:id",
  authMiddleware,
  adminMiddleware,
  updatePromotionController
);

router.delete(
  "/promotions/:id",
  authMiddleware,
  adminMiddleware,
  deletePromotionController
);

// Rotas de Cupons (apenas admin para gerenciar)
router.post(
  "/coupons",
  authMiddleware,
  adminMiddleware,
  createCouponController
);

router.get(
  "/coupons",
  authMiddleware,
  adminMiddleware,
  getAllCouponsController
);

router.get(
  "/coupons/active",
  getActiveCouponsController // Público - para exibição no site
);

router.put(
  "/coupons/:id",
  authMiddleware,
  adminMiddleware,
  updateCouponController
);

router.delete(
  "/coupons/:id",
  authMiddleware,
  adminMiddleware,
  deleteCouponController
);

// Validação de cupom (público)
router.post(
  "/coupons/validate",
  validateCouponController
);

// Aplicação de cupom (requer autenticação)
router.post(
  "/coupons/use",
  authMiddleware,
  useCouponController
);

// Calcular desconto para produto específico (público)
router.get(
  "/products/:productId/discount/:originalPrice",
  calculateProductDiscountController
);

export default router;
