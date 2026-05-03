import {
  createPromotion,
  getAllPromotions,
  getActivePromotions,
  updatePromotion,
  deletePromotion,
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  useCoupon,
  calculatePromotionDiscount
} from "../services/promotion.service.js";
import { adminLog } from "../middlewares/adminLog.middleware.js";
import { catchAsync } from "../utils/errorHandler.js";

// Promoções
export const createPromotionController = catchAsync(async (req, res) => {
  try {
    const promotion = await createPromotion(req.body);

    await adminLog("create_promotion", {
      promotionId: promotion.id,
      title: promotion.title,
      performedBy: req.user.id,
      performedByEmail: req.user.email,
      ip: req.ip,
    });

    // Emitir evento para frontend atualizar (via WebSocket ou polling)
    // Em produção, usar WebSocket. Por ora, frontend fará polling.

    return res.status(201).json({
      success: true,
      data: {
        message: "Promoção criada com sucesso.",
        promotion
      }
    });
  } catch (error) {
    console.error('❌ Create promotion error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create promotion'
    });
  }
});

export const getAllPromotionsController = catchAsync(async (req, res) => {
  try {
    const promotions = await getAllPromotions();
    
    return res.json({
      success: true,
      data: {
        promotions,
        total: promotions.length
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch promotions'
    });
  }
});

export const getActivePromotionsController = catchAsync(async (req, res) => {
  try {
    const promotions = await getActivePromotions();
    
    return res.json({
      success: true,
      data: {
        promotions,
        total: promotions.length
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch active promotions'
    });
  }
});

export const updatePromotionController = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await updatePromotion(id, req.body);

    await adminLog("update_promotion", {
      promotionId: id,
      title: promotion.title,
      performedBy: req.user.id,
      performedByEmail: req.user.email,
      ip: req.ip,
    });

    return res.json({
      success: true,
      data: {
        message: "Promoção atualizada com sucesso.",
        promotion
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update promotion'
    });
  }
});

export const deletePromotionController = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    
    await deletePromotion(id);

    await adminLog("delete_promotion", {
      promotionId: id,
      performedBy: req.user.id,
      performedByEmail: req.user.email,
      ip: req.ip,
    });

    return res.json({
      success: true,
      data: {
        message: "Promoção excluída com sucesso."
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete promotion'
    });
  }
});

// Cupons
export const createCouponController = catchAsync(async (req, res) => {
  try {
    const coupon = await createCoupon(req.body);

    await adminLog("create_coupon", {
      couponId: coupon.id,
      code: coupon.code,
      performedBy: req.user.id,
      performedByEmail: req.user.email,
      ip: req.ip,
    });

    return res.status(201).json({
      success: true,
      data: {
        message: "Cupom criado com sucesso.",
        coupon
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create coupon'
    });
  }
});

export const getAllCouponsController = catchAsync(async (req, res) => {
  const coupons = await getAllCoupons();
  
  return res.json({
    coupons,
    total: coupons.length,
  });
});

export const getActiveCouponsController = catchAsync(async (req, res) => {
  const coupons = await getActiveCoupons();
  
  return res.json({
    coupons,
    total: coupons.length,
  });
});

export const updateCouponController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const coupon = await updateCoupon(id, req.body);

  await adminLog("update_coupon", {
    couponId: id,
    code: coupon.code,
    performedBy: req.user.id,
    performedByEmail: req.user.email,
    ip: req.ip,
  });

  return res.json({
    message: "Cupom atualizado com sucesso.",
    coupon,
  });
});

export const deleteCouponController = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  await deleteCoupon(id);

  await adminLog("delete_coupon", {
    couponId: id,
    performedBy: req.user.id,
    performedByEmail: req.user.email,
    ip: req.ip,
  });

  return res.json({
    message: "Cupom removido com sucesso.",
  });
});

// Validação e uso de cupons
export const validateCouponController = catchAsync(async (req, res) => {
  const { code, cartTotal, cartItems } = req.body;
  const userEmail = req.user?.email || 'guest@example.com';

  const coupon = await validateCoupon(code, userEmail, cartTotal, cartItems);

  return res.json({
    message: "Cupom válido.",
    coupon,
  });
});

export const useCouponController = catchAsync(async (req, res) => {
  const { couponId, orderId, discountAmount } = req.body;
  const userEmail = req.user?.email || 'guest@example.com';

  await useCoupon(couponId, userEmail, orderId, discountAmount);

  return res.json({
    message: "Cupom aplicado com sucesso.",
  });
});

// Calcular desconto de promoção para produto
export const calculateProductDiscountController = catchAsync(async (req, res) => {
  const { productId, originalPrice } = req.params;
  
  const result = await calculatePromotionDiscount(productId, parseFloat(originalPrice));

  return res.json(result);
});
