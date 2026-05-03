import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  BarChart3 as TrendingUp, 
  Users, 
  ShoppingCart, 
  Heart,
  Star,
  Eye,
  DollarSign,
  Package,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Trophy,
  Clock,
  Target,
  ShoppingCart as CartIcon
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d"); // 24h, 7d, 30d, 90d
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("overview");
  
  const dashboardRef = useRef(null);
  const cardsRef = useRef([]);
  const chartsRef = useRef([]);
  const toast = useToast();

  // Mock analytics data (em prod, viria da API)
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 284750,
      revenueGrowth: 23.5,
      totalOrders: 1247,
      ordersGrowth: 18.2,
      totalUsers: 8934,
      usersGrowth: 31.4,
      conversionRate: 3.8,
      conversionGrowth: 12.1,
      avgOrderValue: 228.50,
      aovGrowth: 8.7
    },
    products: {
      topSelling: [
        { id: 1, name: "Nike Air Max 90", sales: 234, revenue: 46800, growth: 15.3 },
        { id: 2, name: "Yeezy Boost 350", sales: 189, revenue: 56700, growth: -5.2 },
        { id: 3, name: "Jordan Retro 1", sales: 167, revenue: 41750, growth: 28.9 },
        { id: 4, name: "Adidas Ultraboost", sales: 145, revenue: 43500, growth: 12.4 },
        { id: 5, name: "New Balance 550", sales: 132, revenue: 33000, growth: 45.6 }
      ],
      lowStock: [
        { id: 6, name: "Converse Chuck 70", stock: 3, sold: 89 },
        { id: 7, name: "Vans Old Skool", stock: 5, sold: 67 },
        { id: 8, name: "Puma Suede", stock: 7, sold: 45 }
      ],
      categories: [
        { name: "Sneakers", sales: 847, revenue: 212450, percentage: 74.6 },
        { name: "Roupas", sales: 289, revenue: 57800, percentage: 20.3 },
        { name: "Acessórios", sales: 111, revenue: 14500, percentage: 5.1 }
      ]
    },
    users: {
      newUsers: 234,
      returningUsers: 893,
      topCustomers: [
        { name: "João Silva", orders: 12, spent: 3456, lastOrder: "2024-01-15" },
        { name: "Maria Santos", orders: 8, spent: 2890, lastOrder: "2024-01-14" },
        { name: "Pedro Costa", orders: 6, spent: 2134, lastOrder: "2024-01-13" }
      ],
      engagement: {
        wishlistAdds: 1456,
        cartAbandonment: 67.3,
        avgSessionTime: "4m 23s",
        bounceRate: 42.1
      }
    },
    performance: {
      pageViews: 45678,
      uniqueVisitors: 8934,
      avgLoadTime: 1.2,
      conversionFunnel: {
        visitors: 8934,
        productViews: 4567,
        cartAdds: 1234,
        checkout: 567,
        purchased: 342
      }
    }
  });

  // Animações GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards animation
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          ease: "power3.out",
          stagger: 0.1
        }
      );

      // Charts animation
      gsap.fromTo(chartsRef.current.filter(Boolean),
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          ease: "power4.out",
          stagger: 0.2,
          delay: 0.3
        }
      );
    }, dashboardRef);

    return () => ctx.revert();
  }, [analytics]);

  const handleRefresh = async () => {
    setIsLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Atualizar dados (mock)
    setAnalytics(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        totalRevenue: prev.overview.totalRevenue + Math.random() * 10000,
        totalOrders: prev.overview.totalOrders + Math.floor(Math.random() * 50)
      }
    }));
    
    setIsLoading(false);
    toast.success("Dados atualizados com sucesso! 📊", {
      duration: 3000
    });
  };

  const handleExport = () => {
    // Simular export
    toast.info("Exportando relatório... 📥", {
      duration: 3000
    });
    
    setTimeout(() => {
      toast.success("Relatório exportado com sucesso!", {
        duration: 3000
      });
    }, 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <ArrowUp className="h-4 w-4 text-emerald-400" />;
    if (growth < 0) return <ArrowDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-zinc-400" />;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return "text-emerald-400";
    if (growth < 0) return "text-red-400";
    return "text-zinc-400";
  };

  const renderMetricCard = (title, value, growth, icon, color = "emerald") => {
    const Icon = icon;
    const colorClasses = {
      emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
      blue: "border-blue-400/30 bg-blue-400/10 text-blue-400",
      purple: "border-purple-400/30 bg-purple-400/10 text-purple-400",
      orange: "border-orange-400/30 bg-orange-400/10 text-orange-400"
    };

    return (
      <div
        ref={el => cardsRef.current.push(el)}
        className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all hover:border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]} border`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className={`flex items-center gap-1 ${getGrowthColor(growth)}`}>
            {getGrowthIcon(growth)}
            <span className="text-sm font-medium">
              {growth > 0 ? '+' : ''}{growth}%
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-zinc-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">
            {typeof value === 'number' && value > 1000 ? formatNumber(value) : value}
          </p>
        </div>
      </div>
    );
  };

  const renderProgressBar = (value, total, color = "emerald") => {
    const percentage = (value / total) * 100;
    const colorClasses = {
      emerald: "bg-emerald-400",
      blue: "bg-blue-400",
      purple: "bg-purple-400",
      orange: "bg-orange-400"
    };

    return (
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div ref={dashboardRef} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-zinc-400">Insights em tempo real do seu negócio</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Time Range Selector */}
          <div className="flex rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-1">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {range === "24h" ? "24h" : range === "7d" ? "7 dias" : range === "30d" ? "30 dias" : "90 dias"}
              </button>
            ))}
          </div>
          
          {/* Actions */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-400/20"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard("Receita Total", formatCurrency(analytics.overview.totalRevenue), analytics.overview.revenueGrowth, DollarSign, "emerald")}
        {renderMetricCard("Pedidos", analytics.overview.totalOrders, analytics.overview.ordersGrowth, ShoppingCart, "blue")}
        {renderMetricCard("Usuários", analytics.overview.totalUsers, analytics.overview.usersGrowth, Users, "purple")}
        {renderMetricCard("Taxa Conversão", `${analytics.overview.conversionRate}%`, analytics.overview.conversionGrowth, Target, "orange")}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div
          ref={el => chartsRef.current.push(el)}
          className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Produtos Mais Vendidos</h3>
            <Trophy className="h-5 w-5 text-yellow-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.products.topSelling.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    index === 0 ? "bg-yellow-400/20 text-yellow-400" :
                    index === 1 ? "bg-zinc-400/20 text-zinc-400" :
                    index === 2 ? "bg-orange-400/20 text-orange-400" :
                    "bg-zinc-800/50 text-zinc-400"
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-zinc-400">{product.sales} vendidos</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(product.revenue)}</p>
                  <div className={`flex items-center gap-1 text-sm ${getGrowthColor(product.growth)}`}>
                    {getGrowthIcon(product.growth)}
                    <span>{product.growth > 0 ? '+' : ''}{product.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Performance */}
        <div
          ref={el => chartsRef.current.push(el)}
          className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Performance por Categoria</h3>
            <PieChart className="h-5 w-5 text-emerald-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.products.categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{category.name}</p>
                    <p className="text-sm text-zinc-400">{category.sales} vendidos • {formatCurrency(category.revenue)}</p>
                  </div>
                  <span className="text-sm font-medium text-white">{category.percentage}%</span>
                </div>
                {renderProgressBar(category.sales, analytics.products.categories.reduce((sum, cat) => sum + cat.sales, 0))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Engagement */}
        <div
          ref={el => chartsRef.current.push(el)}
          className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Engajamento</h3>
            <Activity className="h-5 w-5 text-purple-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/20 text-purple-400">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm text-zinc-400">Favoritos</span>
              </div>
              <span className="font-medium text-white">{formatNumber(analytics.users.engagement.wishlistAdds)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/20 text-orange-400">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <span className="text-sm text-zinc-400">Abandono Carrinho</span>
              </div>
              <span className="font-medium text-white">{analytics.users.engagement.cartAbandonment}%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20 text-blue-400">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-sm text-zinc-400">Tempo Médio</span>
              </div>
              <span className="font-medium text-white">{analytics.users.engagement.avgSessionTime}</span>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div
          ref={el => chartsRef.current.push(el)}
          className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Funil de Conversão</h3>
            <BarChart3 className="h-5 w-5 text-emerald-400" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(analytics.performance.conversionFunnel).map(([stage, count], index) => {
              const stages = {
                visitors: { name: "Visitantes", icon: Users, color: "blue" },
                productViews: { name: "Visualizações", icon: Eye, color: "purple" },
                cartAdds: { name: "Carrinho", icon: ShoppingCart, color: "orange" },
                checkout: { name: "Checkout", icon: Package, color: "emerald" },
                purchased: { name: "Compras", icon: DollarSign, color: "yellow" }
              };
              
              const stageInfo = stages[stage];
              const Icon = stageInfo.icon;
              const percentage = (count / analytics.performance.conversionFunnel.visitors) * 100;
              
              return (
                <div key={stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${stageInfo.color}-400/20 text-${stageInfo.color}-400`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-white">{stageInfo.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-white">{formatNumber(count)}</span>
                      <span className="text-sm text-zinc-400 ml-2">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  {renderProgressBar(count, analytics.performance.conversionFunnel.visitors, stageInfo.color)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {analytics.products.lowStock.length > 0 && (
        <div
          ref={el => chartsRef.current.push(el)}
          className="rounded-3xl border border-red-400/30 bg-red-400/10 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-red-400">⚠️ Estoque Baixo</h3>
            <Package className="h-5 w-5 text-red-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.products.lowStock.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-xl border border-red-400/20 bg-red-400/5">
                <div>
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-sm text-red-300">{product.stock} unidades restantes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">{product.sold} vendidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
