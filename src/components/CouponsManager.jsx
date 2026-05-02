import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Star, 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Calendar,
  X,
  Check,
  AlertCircle,
  Save,
  RefreshCw,
  Clock,
  Users
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

gsap.registerPlugin(ScrollTrigger);

function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "discount",
    discountType: "percentage",
    discountValue: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    usageCount: 0,
    applicableProducts: [],
    applicableCategories: [],
    isActive: true,
    priority: 1,
    conditions: "",
    firstPurchaseOnly: false,
    singleUse: false
  });
  
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);
  const toast = useToast();

  // Mock data inicial
  useEffect(() => {
    const mockCoupons = [
      {
        id: 1,
        code: "BLACKFRIDAY40",
        name: "Black Friday 40%",
        description: "Desconto de 40% em toda a loja",
        type: "discount",
        discountType: "percentage",
        discountValue: 40,
        minPurchaseAmount: 200,
        maxDiscountAmount: 200,
        startDate: "2024-11-20",
        endDate: "2024-11-30",
        usageLimit: 1000,
        usageCount: 342,
        applicableProducts: [],
        applicableCategories: [],
        isActive: true,
        priority: 1,
        conditions: "Não cumulativo com outras promoções",
        firstPurchaseOnly: false,
        singleUse: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        code: "BEMVINDO15",
        name: "Bem-vindo 15%",
        description: "15% de desconto na primeira compra",
        type: "discount",
        discountType: "percentage",
        discountValue: 15,
        minPurchaseAmount: 100,
        maxDiscountAmount: 50,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        usageLimit: 500,
        usageCount: 127,
        applicableProducts: [],
        applicableCategories: [],
        isActive: true,
        priority: 2,
        conditions: "Apenas para novos clientes",
        firstPurchaseOnly: true,
        singleUse: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        code: "FRETEGRATIS",
        name: "Frete Grátis",
        description: "Frete grátis em compras acima de R$ 299",
        type: "shipping",
        discountType: "fixed",
        discountValue: 0,
        minPurchaseAmount: 299,
        maxDiscountAmount: 0,
        startDate: "2024-06-01",
        endDate: "2024-12-31",
        usageLimit: null,
        usageCount: 89,
        applicableProducts: [],
        applicableCategories: [],
        isActive: true,
        priority: 3,
        conditions: "Válido apenas para Sul e Sudeste",
        firstPurchaseOnly: false,
        singleUse: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        code: "UNIQUE50",
        name: "Cupom Único R$50",
        description: "R$50 de desconto de uso único",
        type: "discount",
        discountType: "fixed",
        discountValue: 50,
        minPurchaseAmount: 150,
        maxDiscountAmount: 50,
        startDate: "2024-08-01",
        endDate: "2024-12-31",
        usageLimit: 1,
        usageCount: 0,
        applicableProducts: [],
        applicableCategories: [],
        isActive: true,
        priority: 4,
        conditions: "Uso único por cliente",
        firstPurchaseOnly: false,
        singleUse: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    setCoupons(mockCoupons);
    setFilteredCoupons(mockCoupons);
  }, []);

  // Animações GSAP
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
      );

      // Cards stagger animation
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.9,
          rotationX: 15
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotationX: 0,
          duration: 0.8, 
          ease: "power3.out",
          stagger: 0.1
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [filteredCoupons]);

  // Form animation
  useEffect(() => {
    if (!showForm || !formRef.current) return;

    gsap.fromTo(formRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [showForm]);

  // Filtros
  useEffect(() => {
    let filtered = coupons;

    if (searchTerm) {
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "Todos") {
      if (statusFilter === "Ativos") {
        filtered = filtered.filter(c => c.isActive);
      } else if (statusFilter === "Inativos") {
        filtered = filtered.filter(c => !c.isActive);
      } else if (statusFilter === "Expirados") {
        filtered = filtered.filter(c => new Date(c.endDate) < new Date());
      } else if (statusFilter === "Esgotados") {
        filtered = filtered.filter(c => c.usageLimit && c.usageCount >= c.usageLimit);
      }
    }

    setFilteredCoupons(filtered);
  }, [coupons, searchTerm, statusFilter]);

  const statusOptions = ["Todos", "Ativos", "Inativos", "Expirados", "Esgotados"];

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "discount",
      discountType: "percentage",
      discountValue: "",
      minPurchaseAmount: "",
      maxDiscountAmount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      usageCount: 0,
      applicableProducts: [],
      applicableCategories: [],
      isActive: true,
      priority: 1,
      conditions: "",
      firstPurchaseOnly: false,
      singleUse: false
    });
    setShowForm(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({ ...coupon });
    setShowForm(true);
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;

    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      toast.success("Cupom excluído com sucesso", { duration: 3000 });
    } catch (error) {
      toast.error("Erro ao excluir cupom", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (couponId) => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCoupons(prev => prev.map(c => 
        c.id === couponId 
          ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() }
          : c
      ));
      
      const coupon = coupons.find(c => c.id === couponId);
      toast.success(
        `Cupom ${coupon.isActive ? "desativado" : "ativado"} com sucesso`, 
        { duration: 3000 }
      );
    } catch (error) {
      toast.error("Erro ao alterar status do cupom", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Código ${code} copiado!`, { duration: 2000 });
    } catch (error) {
      toast.error("Erro ao copiar código", { duration: 2000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (editingCoupon) {
        // Update
        setCoupons(prev => prev.map(c => 
          c.id === editingCoupon.id 
            ? { ...formData, updatedAt: new Date().toISOString() }
            : c
        ));
        toast.success("Cupom atualizado com sucesso", { duration: 3000 });
      } else {
        // Create
        const newCoupon = {
          ...formData,
          id: Date.now(),
          usageCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCoupons(prev => [...prev, newCoupon]);
        toast.success("Cupom criado com sucesso", { duration: 3000 });
      }

      setShowForm(false);
      setEditingCoupon(null);
    } catch (error) {
      toast.error("Erro ao salvar cupom", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCouponStatus = (coupon) => {
    if (!coupon.isActive) return { text: "Inativo", color: "text-zinc-400", bgColor: "bg-zinc-400/20" };
    if (new Date(coupon.endDate) < new Date()) return { text: "Expirado", color: "text-red-400", bgColor: "bg-red-400/20" };
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return { text: "Esgotado", color: "text-orange-400", bgColor: "bg-orange-400/20" };
    return { text: "Ativo", color: "text-emerald-400", bgColor: "bg-emerald-400/20" };
  };

  const getCouponTypeIcon = (type) => {
    switch (type) {
      case "discount": return <span className="text-emerald-400">%</span>;
      case "shipping": return <span className="text-blue-400">📦</span>;
      case "gift": return <span className="text-purple-400">🎁</span>;
      default: return <span className="text-zinc-400">🎫</span>;
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Cupons</h1>
          <p className="text-zinc-400">
            {filteredCoupons.length} cupons encontrados
          </p>
        </div>
        
        <button
          onClick={handleCreateCoupon}
          className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
        >
          <Plus className="h-5 w-5" />
          Novo Cupom
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar cupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                  : "text-zinc-400 border border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon, index) => {
          const status = getCouponStatus(coupon);
          const TypeIcon = getCouponTypeIcon(coupon.type);
          
          return (
            <div
              key={coupon.id}
              ref={el => cardsRef.current[index] = el}
              className="group relative rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden transition-all hover:border-emerald-400/30 hover:shadow-emerald-400/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10">
                      <TypeIcon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{coupon.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 backdrop-blur-sm transition-all hover:bg-red-500/30"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-lg">
                  <span className="font-mono text-lg font-bold text-emerald-400">{coupon.code}</span>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className="ml-auto flex h-6 w-6 items-center justify-center rounded bg-emerald-400/20 text-emerald-400 transition-all hover:bg-emerald-400/30"
                    title="Copiar código"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                
                <p className="text-sm text-zinc-300 mt-3 line-clamp-2">{coupon.description}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Discount Info */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Desconto</span>
                  <span className="font-bold text-emerald-400">
                    {coupon.discountType === "percentage" 
                      ? `${coupon.discountValue}%`
                      : formatCurrency(coupon.discountValue)
                    }
                  </span>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400">Início:</span>
                    <span className="text-white">{formatDate(coupon.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400">Término:</span>
                    <span className="text-white">{formatDate(coupon.endDate)}</span>
                  </div>
                </div>

                {/* Usage */}
                {coupon.usageLimit && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Uso</span>
                      <span className="text-white">{coupon.usageCount} / {coupon.usageLimit}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full transition-all"
                        style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Min Purchase */}
                {coupon.minPurchaseAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Compra mínima</span>
                    <span className="text-white">{formatCurrency(coupon.minPurchaseAmount)}</span>
                  </div>
                )}

                {/* Special Flags */}
                <div className="flex flex-wrap gap-2">
                  {coupon.firstPurchaseOnly && (
                    <span className="text-xs bg-blue-400/20 text-blue-400 px-2 py-1 rounded-full">
                      Primeira compra
                    </span>
                  )}
                  {coupon.singleUse && (
                    <span className="text-xs bg-purple-400/20 text-purple-400 px-2 py-1 rounded-full">
                      Uso único
                    </span>
                  )}
                </div>

                {/* Conditions */}
                {coupon.conditions && (
                  <div className="text-sm">
                    <span className="text-zinc-400">Condições:</span>
                    <p className="text-zinc-300 mt-1">{coupon.conditions}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => handleToggleStatus(coupon.id)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                    coupon.isActive
                      ? "border border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20"
                      : "border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
                  }`}
                >
                  {coupon.isActive ? (
                    <>
                      <X className="h-4 w-4" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Ativar
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div ref={formRef} className="w-full max-w-4xl max-h-[90vh] bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Form Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Código do Cupom *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className="flex-1 rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                        placeholder="EXEMPLO10"
                      />
                      <button
                        type="button"
                        onClick={generateCouponCode}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10"
                        title="Gerar código aleatório"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Nome *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Nome do cupom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                      placeholder="Descrição do cupom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tipo de Cupom</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="discount">Desconto</option>
                      <option value="shipping">Frete Grátis</option>
                      <option value="gift">Brinde</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Condições</label>
                    <textarea
                      value={formData.conditions}
                      onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                      rows={2}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                      placeholder="Condições de uso"
                    />
                  </div>
                </div>

                {/* Discount & Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Configurações</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tipo de Desconto</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="percentage">Percentual (%)</option>
                      <option value="fixed">Valor Fixo (R$)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Valor do Desconto *</label>
                    <input
                      type="number"
                      required
                      step={formData.discountType === "percentage" ? "1" : "0.01"}
                      min={0}
                      max={formData.discountType === "percentage" ? 100 : null}
                      value={formData.discountValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder={formData.discountType === "percentage" ? "0" : "0.00"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Data de Início *</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Data de Término *</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Compra Mínima</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minPurchaseAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, minPurchaseAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Desconto Máximo</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Limite de Usos</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.usageLimit || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value ? parseInt(e.target.value) : null }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Deixe em branco para ilimitado"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Prioridade</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="1 (mais alta) - 10 (mais baixa)"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Cupom ativo</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.firstPurchaseOnly}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstPurchaseOnly: e.target.checked }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Apenas primeira compra</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.singleUse}
                        onChange={(e) => setFormData(prev => ({ ...prev, singleUse: e.target.checked }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Uso único</span>
                    </label>
                  </div>
                </div>
              </div>
            </form>

            {/* Form Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {editingCoupon ? "Atualizar" : "Criar"} Cupom
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCoupons.length === 0 && (
        <div className="text-center py-20">
          <div className="h-20 w-20 text-zinc-600 mx-auto mb-6 flex items-center justify-center text-4xl">🎫</div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum cupom encontrado</h3>
          <p className="text-zinc-400 mb-6">
            {searchTerm || statusFilter !== "Todos" 
              ? "Tente ajustar os filtros para encontrar cupons"
              : "Comece criando seu primeiro cupom"
            }
          </p>
          {!searchTerm && statusFilter === "Todos" && (
            <button
              onClick={handleCreateCoupon}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
            >
              <Plus className="h-5 w-5" />
              Criar Primeiro Cupom
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CouponsManager;
