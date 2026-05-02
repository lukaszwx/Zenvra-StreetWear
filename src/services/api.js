const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const TOKEN_KEY = "zenvra_token";
const USER_KEY = "zenvra_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function clearInvalidToken() {
  console.warn('🔑 Token inválido detectado, limpando sessão...');
  clearToken();
  window.location.href = '/painel-interno-zenvra';
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser() {
  localStorage.removeItem(USER_KEY);
}

export function logout() {
  removeToken();
  removeStoredUser();
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function isAdmin() {
  return getStoredUser()?.role === "admin";
}

async function request(path, options = {}) {
  const token = getToken();
  const fullUrl = `${API_URL}${path}`;

  const headers = {
    ...(!(options.body instanceof FormData) && {
      "Content-Type": "application/json; charset=utf-8",
    }),
    "Accept": "application/json; charset=utf-8",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Debug: log da requisição
    console.log(`🌐 API Request: ${options.method || 'GET'} ${fullUrl}`);

    if (!response.ok) {
      let errorMessage = "Erro na requisição.";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json().catch(() => null);
    return data;
  } catch (error) {
    // Debug: log do erro
    console.error(`❌ API Error: ${options.method || 'GET'} ${fullUrl}`, error.message);
    
    // Se for erro de rede/conexão, mensagem mais clara
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3000');
    }
    
    // Se for erro de token inválido, limpar sessão
    if (error.message.includes('Token inválido') || error.message.includes('Token não enviado')) {
      clearInvalidToken();
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    
    throw error;
  }
}

export async function loginAdmin(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.token) setToken(data.token);
  if (data.user) setStoredUser(data.user);

  return data;
}

export function fetchProducts() {
  return request("/products");
}

export function createProduct(product) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: "DELETE",
  });
}

export function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return request("/uploads", {
    method: "POST",
    body: formData,
  });
}

export function createAdmin(admin) {
  return request("/auth/admins", {
    method: "POST",
    body: JSON.stringify(admin),
  });
}

export function inviteAdmin(email) {
  return request("/auth/invite", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function deleteAdmin(adminId) {
  return request(`/auth/admins/${adminId}`, {
    method: "DELETE",
  });
}

export function fetchAdmins() {
  return request("/auth/admins");
}

// Promoções
export function createPromotion(promotionData) {
  return request("/promotions/promotions", {
    method: "POST",
    body: JSON.stringify(promotionData),
  });
}

export function fetchPromotions() {
  return request("/promotions/promotions");
}

export function fetchActivePromotions() {
  return request("/promotions/public/promotions");
}

export function updatePromotion(id, promotionData) {
  return request(`/promotions/promotions/${id}`, {
    method: "PUT",
    body: JSON.stringify(promotionData),
  });
}

export function deletePromotion(id) {
  return request(`/promotions/promotions/${id}`, {
    method: "DELETE",
  });
}

// Cupons
export function createCoupon(couponData) {
  return request("/promotions/coupons", {
    method: "POST",
    body: JSON.stringify(couponData),
  });
}

export function fetchCoupons() {
  return request("/promotions/coupons");
}

export function fetchActiveCoupons() {
  return request("/promotions/public/coupons");
}

export function updateCoupon(id, couponData) {
  return request(`/promotions/coupons/${id}`, {
    method: "PUT",
    body: JSON.stringify(couponData),
  });
}

export function deleteCoupon(id) {
  return request(`/promotions/coupons/${id}`, {
    method: "DELETE",
  });
}

export function validateCoupon(code, cartTotal, cartItems) {
  return request("/promotions/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, cartTotal, cartItems }),
  });
}

export function useCoupon(couponId, orderId, discountAmount) {
  return request("/promotions/coupons/use", {
    method: "POST",
    body: JSON.stringify({ couponId, orderId, discountAmount }),
  });
}

export function calculateProductDiscount(productId, originalPrice) {
  return request(`/promotions/products/${productId}/discount/${originalPrice}`);
}