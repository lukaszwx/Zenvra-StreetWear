import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  BarChart3, 
  BarChart3 as TrendingUp, 
  Star, 
  Users, 
  LogOut,
  ShoppingBag as Store
} from "lucide-react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import ProductsManager from "./ProductsManager";
import PromotionsManager from "./PromotionsManager";
import CouponsManager from "./CouponsManager";
import AdminsManager from "./AdminsManager";
import { useAuth } from "../contexts/AuthContext";

function AdminPanelSimple({ onLogout, onGoToStore }) {
  const [activeTab, setActiveTab] = useState("analytics");
  const { user } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "products", name: "Produtos", icon: Package },
    { id: "promotions", name: "Promoções", icon: TrendingUp },
    { id: "coupons", name: "Cupons", icon: Star },
    { id: "admins", name: "Admins", icon: Users }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "products":
        return <ProductsManager />;
      case "promotions":
        return <PromotionsManager />;
      case "coupons":
        return <CouponsManager />;
      case "admins":
        return <AdminsManager />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 pt-32 pb-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-400">
              PAINEL ADMINISTRATIVO
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Gerenciador Zenvra
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Analytics completos e gerenciamento centralizado da sua loja.
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              Logado como{" "}
              <span className="font-semibold text-emerald-300">
                {user?.name || "Admin"}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onGoToStore}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Store className="h-4 w-4" />
              Ver loja
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/20"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-emerald-400 text-emerald-400"
                      : "border-transparent text-zinc-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>
    </section>
  );
}

export default AdminPanelSimple;
