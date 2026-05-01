export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = decodeJwt(token);

  if (!decoded?.exp) return true;

  return Date.now() >= decoded.exp * 1000;
}