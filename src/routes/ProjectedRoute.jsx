import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { authenticated, admin } = useAuth();

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}