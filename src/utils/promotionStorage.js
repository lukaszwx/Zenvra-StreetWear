// Sistema de storage compartilhado para promoções
class PromotionStorage {
  constructor() {
    this.storageKey = 'zenvra_promotions';
    this.couponsKey = 'zenvra_coupons';
  }

  // Promoções
  getPromotions() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getDefaultPromotions();
    } catch (error) {
      console.error('Error loading promotions:', error);
      return this.getDefaultPromotions();
    }
  }

  savePromotions(promotions) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(promotions));
      // Disparar evento para notificar outros componentes
      window.dispatchEvent(new CustomEvent('promotions-updated', { 
        detail: { promotions } 
      }));
    } catch (error) {
      console.error('Error saving promotions:', error);
    }
  }

  addPromotion(promotion) {
    const promotions = this.getPromotions();
    const newPromotion = {
      ...promotion,
      id: Date.now(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    promotions.push(newPromotion);
    this.savePromotions(promotions);
    return newPromotion;
  }

  updatePromotion(id, updates) {
    const promotions = this.getPromotions();
    const index = promotions.findIndex(p => p.id === id);
    if (index !== -1) {
      promotions[index] = {
        ...promotions[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.savePromotions(promotions);
      return promotions[index];
    }
    return null;
  }

  deletePromotion(id) {
    const promotions = this.getPromotions();
    const filtered = promotions.filter(p => p.id !== id);
    this.savePromotions(filtered);
    return filtered;
  }

  // Cupons
  getCoupons() {
    try {
      const stored = localStorage.getItem(this.couponsKey);
      return stored ? JSON.parse(stored) : this.getDefaultCoupons();
    } catch (error) {
      console.error('Error loading coupons:', error);
      return this.getDefaultCoupons();
    }
  }

  saveCoupons(coupons) {
    try {
      localStorage.setItem(this.couponsKey, JSON.stringify(coupons));
      // Disparar evento para notificar outros componentes
      window.dispatchEvent(new CustomEvent('coupons-updated', { 
        detail: { coupons } 
      }));
    } catch (error) {
      console.error('Error saving coupons:', error);
    }
  }

  addCoupon(coupon) {
    const coupons = this.getCoupons();
    const newCoupon = {
      ...coupon,
      id: Date.now(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    coupons.push(newCoupon);
    this.saveCoupons(coupons);
    return newCoupon;
  }

  updateCoupon(id, updates) {
    const coupons = this.getCoupons();
    const index = coupons.findIndex(c => c.id === id);
    if (index !== -1) {
      coupons[index] = {
        ...coupons[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveCoupons(coupons);
      return coupons[index];
    }
    return null;
  }

  deleteCoupon(id) {
    const coupons = this.getCoupons();
    const filtered = coupons.filter(c => c.id !== id);
    this.saveCoupons(filtered);
    return filtered;
  }

  // Dados padrão
  getDefaultPromotions() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    return [
      {
        id: 1,
        name: "Black Friday Especial",
        description: "Descontos de até 50% em produtos selecionados",
        type: "discount",
        discountType: "percentage",
        discountValue: 50,
        conditions: "Válido para produtos marcados",
        startDate: `${currentYear}-01-01`,
        endDate: `${nextYear}-12-31`,
        isActive: true,
        usageCount: 156,
        createdAt: "2024-10-15T10:00:00Z",
        updatedAt: "2024-10-15T10:00:00Z"
      },
      {
        id: 2,
        name: "Frete Grátis Nacional",
        description: "Frete grátis para todo o Brasil em compras acima de R$ 200",
        type: "shipping",
        discountType: "fixed",
        discountValue: 0,
        conditions: "Compra mínima de R$ 200",
        startDate: `${currentYear}-01-01`,
        endDate: `${nextYear}-12-31`,
        isActive: true,
        usageCount: 342,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      },
      {
        id: 3,
        name: "Leve 2 Pague 1",
        description: "Compre 2 itens e pague apenas 1 em tênis selecionados",
        type: "buyonegetone",
        discountType: "fixed",
        discountValue: 0,
        conditions: "Apenas tênis da coleção verão",
        startDate: `${currentYear}-01-01`,
        endDate: `${nextYear}-12-31`,
        isActive: true,
        usageCount: 89,
        createdAt: "2024-05-15T14:30:00Z",
        updatedAt: "2024-05-15T14:30:00Z"
      }
    ];
  }

  getDefaultCoupons() {
    return [
      {
        id: 1,
        code: "VERAO20",
        name: "Desconto Verão",
        description: "20% de desconto em roupas de verão",
        type: "discount",
        discountType: "percentage",
        discountValue: 20,
        conditions: "Válido para categoria Verão",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        isActive: true,
        usageLimit: 100,
        usageCount: 45,
        minPurchaseAmount: 100,
        maxDiscountAmount: 50,
        priority: 1,
        createdAt: "2024-11-01T09:00:00Z",
        updatedAt: "2024-11-01T09:00:00Z"
      },
      {
        id: 2,
        code: "FRETE10",
        name: "Frete Grátis",
        description: "Frete grátis em compras acima de R$ 150",
        type: "shipping",
        discountType: "fixed",
        discountValue: 0,
        conditions: "Mínimo R$ 150 em compras",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        isActive: true,
        usageLimit: null,
        usageCount: 234,
        minPurchaseAmount: 150,
        maxDiscountAmount: 0,
        priority: 2,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      }
    ];
  }

  // Métodos utilitários
  getActivePromotions() {
    const now = new Date();
    return this.getPromotions().filter(promo => {
      if (!promo.isActive) return false;
      if (new Date(promo.endDate) < now) return false;
      if (new Date(promo.startDate) > now) return false;
      return true;
    });
  }

  getActiveCoupons() {
    const now = new Date();
    return this.getCoupons().filter(coupon => {
      if (!coupon.isActive) return false;
      if (new Date(coupon.endDate) < now) return false;
      if (new Date(coupon.startDate) > now) return false;
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return false;
      return true;
    });
  }

  validateCoupon(code, cartTotal) {
    const coupons = this.getActiveCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) return { valid: false, message: "Cupom não encontrado" };
    
    if (coupon.minPurchaseAmount && cartTotal < coupon.minPurchaseAmount) {
      return { 
        valid: false, 
        message: `Compra mínima de R$ ${coupon.minPurchaseAmount.toFixed(2)}` 
      };
    }
    
    return { valid: true, coupon };
  }

  calculateDiscount(coupon, cartTotal) {
    if (coupon.discountType === "percentage") {
      const discount = (cartTotal * coupon.discountValue) / 100;
      return coupon.maxDiscountAmount ? Math.min(discount, coupon.maxDiscountAmount) : discount;
    } else {
      return coupon.discountValue;
    }
  }
}

export const promotionStorage = new PromotionStorage();
