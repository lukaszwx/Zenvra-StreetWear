const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const TOKEN_KEY = "zenvra_token";
const USER_KEY = "zenvra_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
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

  const headers = {
    ...(!(options.body instanceof FormData) && {
      "Content-Type": "application/json",
    }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro na requisição.");
  }

  return data;
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