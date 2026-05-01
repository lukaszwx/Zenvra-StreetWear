import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getStoredUser,
  getToken,
  loginAdmin,
  logout as apiLogout,
} from "../services/api";
import { isTokenExpired } from "../utils/authToken";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    if (isTokenExpired(token)) {
      logout();
      return;
    }

    const decodedExp = JSON.parse(atob(token.split(".")[1])).exp * 1000;
    const timeUntilExpire = decodedExp - Date.now();

    const timer = setTimeout(() => {
      logout();
    }, timeUntilExpire);

    return () => clearTimeout(timer);
  }, [token]);

  const authenticated = Boolean(user && token && !isTokenExpired(token));
  const admin = user?.role === "admin";
  
  const authenticated = Boolean(user && token && !isTokenExpired(token));
  const admin = user?.role === "admin";
  async function login(email, password) {
  setLoading(true);

  try {
    const data = await loginAdmin(email, password);

    const normalizedUser = {
      ...data.user,
      mustChangePassword: Boolean(data.mustChangePassword),
    };

    setUser(normalizedUser);
    setToken(data.token);

    localStorage.setItem("zenvra_user", JSON.stringify(normalizedUser));

    return {
      ...data,
      user: normalizedUser,
    };
  } finally {
    setLoading(false);
  }
}

const mustChangePassword = Boolean(user?.mustChangePassword);

  function logout() {
    apiLogout();
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      authenticated,
      admin,
      mustChangePassword,
      login,
      logout,
   
    }),
    [user, token, loading, authenticated, admin, mustChangePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }

  return context;
}