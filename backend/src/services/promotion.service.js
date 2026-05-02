import { connectDB } from "../database/db.js";
import crypto from "crypto";

export async function createPromotion(promotionData) {
  const db = await connectDB();
  const id = crypto.randomUUID();

  const {
    title,
    description,
    discountType,
    discountValue,
    startDate,
    endDate,
    applicableProducts,
    minOrderValue,
    maxUses,
    bannerImage
  } = promotionData;

  await db.run(
    `INSERT INTO promotions (
      id, title, description, discountType, discountValue, 
      startDate, endDate, applicableProducts, minOrderValue, 
      maxUses, bannerImage, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [
      id,
      title,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      applicableProducts ? JSON.stringify(applicableProducts) : null,
      minOrderValue,
      maxUses,
      bannerImage
    ]
  );

  return { id, ...promotionData };
}

export async function getAllPromotions() {
  const db = await connectDB();
  
  const promotions = await db.all(
    `SELECT * FROM promotions ORDER BY createdAt DESC`
  );

  return promotions.map(promo => ({
    ...promo,
    applicableProducts: promo.applicableProducts ? JSON.parse(promo.applicableProducts) : null
  }));
}

export async function getActivePromotions() {
  const db = await connectDB();
  const now = new Date().toISOString();
  
  const promotions = await db.all(
    `SELECT * FROM promotions 
     WHERE isActive = 1 
     AND startDate <= ? 
     AND endDate >= ?
     ORDER BY createdAt DESC`,
    [now, now]
  );

  return promotions.map(promo => ({
    ...promo,
    applicableProducts: promo.applicableProducts ? JSON.parse(promo.applicableProducts) : null
  }));
}

export async function updatePromotion(id, promotionData) {
  const db = await connectDB();
  
  const {
    title,
    description,
    discountType,
    discountValue,
    startDate,
    endDate,
    isActive,
    applicableProducts,
    minOrderValue,
    maxUses,
    bannerImage
  } = promotionData;

  await db.run(
    `UPDATE promotions SET 
      title = ?, description = ?, discountType = ?, discountValue = ?,
      startDate = ?, endDate = ?, isActive = ?, applicableProducts = ?,
      minOrderValue = ?, maxUses = ?, bannerImage = ?, updatedAt = datetime('now')
    WHERE id = ?`,
    [
      title,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      applicableProducts ? JSON.stringify(applicableProducts) : null,
      minOrderValue,
      maxUses,
      bannerImage,
      id
    ]
  );

  return { id, ...promotionData };
}

export async function deletePromotion(id) {
  const db = await connectDB();
  
  const result = await db.run("DELETE FROM promotions WHERE id = ?", [id]);
  
  if (result.changes === 0) {
    throw new Error("Promoção não encontrada");
  }
  
  return true;
}

export async function createCoupon(couponData) {
  const db = await connectDB();
  const id = crypto.randomUUID();

  const {
    code,
    description,
    discountType,
    discountValue,
    startDate,
    endDate,
    applicableProducts,
    applicableCategories,
    minOrderValue,
    maxUses
  } = couponData;

  await db.run(
    `INSERT INTO coupons (
      id, code, description, discountType, discountValue, 
      startDate, endDate, applicableProducts, applicableCategories,
      minOrderValue, maxUses, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [
      id,
      code.toUpperCase(),
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      applicableProducts ? JSON.stringify(applicableProducts) : null,
      applicableCategories ? JSON.stringify(applicableCategories) : null,
      minOrderValue,
      maxUses
    ]
  );

  return { id, code: code.toUpperCase(), ...couponData };
}

export async function getAllCoupons() {
  const db = await connectDB();
  
  const coupons = await db.all(
    `SELECT * FROM coupons ORDER BY createdAt DESC`
  );

  return coupons.map(coupon => ({
    ...coupon,
    applicableProducts: coupon.applicableProducts ? JSON.parse(coupon.applicableProducts) : null,
    applicableCategories: coupon.applicableCategories ? JSON.parse(coupon.applicableCategories) : null
  }));
}

export async function getActiveCoupons() {
  const db = await connectDB();
  const now = new Date().toISOString();
  
  const coupons = await db.all(
    `SELECT * FROM coupons 
     WHERE isActive = 1 
     AND startDate <= ? 
     AND endDate >= ?
     AND (maxUses IS NULL OR currentUses < maxUses)
     ORDER BY createdAt DESC`,
    [now, now]
  );

  return coupons.map(coupon => ({
    ...coupon,
    applicableProducts: coupon.applicableProducts ? JSON.parse(coupon.applicableProducts) : null,
    applicableCategories: coupon.applicableCategories ? JSON.parse(coupon.applicableCategories) : null
  }));
}

export async function updateCoupon(id, couponData) {
  const db = await connectDB();
  
  const {
    code,
    description,
    discountType,
    discountValue,
    startDate,
    endDate,
    isActive,
    applicableProducts,
    applicableCategories,
    minOrderValue,
    maxUses
  } = couponData;

  await db.run(
    `UPDATE coupons SET 
      code = ?, description = ?, discountType = ?, discountValue = ?,
      startDate = ?, endDate = ?, isActive = ?, applicableProducts = ?,
      applicableCategories = ?, minOrderValue = ?, maxUses = ?, updatedAt = datetime('now')
    WHERE id = ?`,
    [
      code.toUpperCase(),
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      applicableProducts ? JSON.stringify(applicableProducts) : null,
      applicableCategories ? JSON.stringify(applicableCategories) : null,
      minOrderValue,
      maxUses,
      id
    ]
  );

  return { id, code: code.toUpperCase(), ...couponData };
}

export async function deleteCoupon(id) {
  const db = await connectDB();
  
  const result = await db.run("DELETE FROM coupons WHERE id = ?", [id]);
  
  if (result.changes === 0) {
    throw new Error("Cupom não encontrado");
  }
  
  return true;
}

export async function validateCoupon(code, userEmail, cartTotal = 0, cartItems = []) {
  const db = await connectDB();
  const now = new Date().toISOString();
  
  const coupon = await db.get(
    `SELECT * FROM coupons 
     WHERE code = ? 
     AND isActive = 1 
     AND startDate <= ? 
     AND endDate >= ?`,
    [code.toUpperCase(), now, now]
  );

  if (!coupon) {
    throw new Error("Cupom inválido ou expirado");
  }

  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
    throw new Error("Cupom esgotado");
  }

  if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
    throw new Error(`Pedido mínimo de R$ ${coupon.minOrderValue.toFixed(2)} para usar este cupom`);
  }

  // Verificar se o cupom se aplica aos produtos do carrinho
  if (coupon.applicableProducts) {
    const applicableProducts = JSON.parse(coupon.applicableProducts);
    const hasApplicableProduct = cartItems.some(item => applicableProducts.includes(item.id));
    
    if (!hasApplicableProduct) {
      throw new Error("Cupom não aplicável aos produtos do carrinho");
    }
  }

  if (coupon.applicableCategories) {
    const applicableCategories = JSON.parse(coupon.applicableCategories);
    const hasApplicableCategory = cartItems.some(item => applicableCategories.includes(item.category));
    
    if (!hasApplicableCategory) {
      throw new Error("Cupom não aplicável às categorias do carrinho");
    }
  }

  return {
    ...coupon,
    applicableProducts: coupon.applicableProducts ? JSON.parse(coupon.applicableProducts) : null,
    applicableCategories: coupon.applicableCategories ? JSON.parse(coupon.applicableCategories) : null
  };
}

export async function useCoupon(couponId, userEmail, orderId, discountAmount) {
  const db = await connectDB();
  const id = crypto.randomUUID();

  // Registrar uso do cupom
  await db.run(
    `INSERT INTO coupon_uses (id, couponId, userEmail, orderId, discountAmount, usedAt)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [id, couponId, userEmail, orderId, discountAmount]
  );

  // Incrementar contador de usos
  await db.run(
    `UPDATE coupons SET currentUses = currentUses + 1 WHERE id = ?`,
    [couponId]
  );

  return true;
}

export async function calculatePromotionDiscount(productId, originalPrice) {
  const db = await connectDB();
  const now = new Date().toISOString();
  
  const promotion = await db.get(
    `SELECT * FROM promotions 
     WHERE isActive = 1 
     AND startDate <= ? 
     AND endDate >= ?
     AND (applicableProducts IS NULL OR applicableProducts LIKE ?)`,
    [now, now, `%"${productId}"%`]
  );

  if (!promotion) {
    return { originalPrice, discountedPrice: originalPrice, discount: 0 };
  }

  let discount = 0;
  
  if (promotion.discountType === 'percentage') {
    discount = originalPrice * (promotion.discountValue / 100);
  } else {
    discount = promotion.discountValue;
  }

  const discountedPrice = Math.max(0, originalPrice - discount);

  return {
    originalPrice,
    discountedPrice,
    discount,
    promotion: {
      id: promotion.id,
      title: promotion.title,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue
    }
  };
}
