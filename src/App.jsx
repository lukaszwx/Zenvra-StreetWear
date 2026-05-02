import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import AdminPage from "./pages/AdminPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StorePage from "./pages/StorePage";
import GlobalLoading from "./components/GlobalLoading";
import ShoppingCart from "./components/ShoppingCart";
import Wishlist from "./components/Wishlist";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import Checkout from "./components/Checkout";
import SupportCenter from "./components/SupportCenter";
import OrderTracking from "./components/OrderTracking";
import PromotionsBanner from "./components/PromotionsBanner";
import ToastProvider from "./contexts/ToastContext";
import { Headphones, Truck } from "lucide-react";

export default function App() {
  const isAdminRoute = window.location.pathname === '/painel-interno-zenvra';
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  
  return (
    <ToastProvider>
      <GlobalLoading />
      <Routes>
        <Route path="/" element={<StorePage />} />

        <Route path="/painel-interno-zenvra" element={<AdminPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/accept-invite" element={<AcceptInvitePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Componentes apenas fora da área admin */}
      {!isAdminRoute && (
        <>
          <PromotionsBanner />
          <ShoppingCart onCheckout={() => setShowCheckout(true)} />
          <Wishlist />
          <PWAInstallPrompt />
          
          {/* Global Support Menu */}
          <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
            <button
              onClick={() => setShowSupport(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 transition-all hover:bg-emerald-400/20"
              title="Central de Ajuda"
            >
              <Headphones className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowTracking(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-400 transition-all hover:bg-blue-400/20"
              title="Rastrear Pedido"
            >
              <Truck className="h-5 w-5" />
            </button>
          </div>
          
          {/* Modals */}
          {showCheckout && (
            <Checkout onClose={() => setShowCheckout(false)} />
          )}
          
          {showSupport && (
            <SupportCenter onClose={() => setShowSupport(false)} />
          )}
          
          {showTracking && (
            <OrderTracking onClose={() => setShowTracking(false)} />
          )}
        </>
      )}
    </ToastProvider>
  );
}