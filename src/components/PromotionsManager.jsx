import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
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
import { promotionStorage } from "../utils/promotionStorage";

gsap.registerPlugin(ScrollTrigger);

function PromotionsManager() {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isCreating, setIsCreating] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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
    conditions: ""
  });
  
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);
  const toast = useToast();

  // Carregar promoções do storage compartilhado
  useEffect(() => {
    const loadPromotions = () => {
      try {
        const storedPromotions = promotionStorage.getPromotions();
        setPromotions(storedPromotions);
        setFilteredPromotions(storedPromotions);
      } catch (error) {
        console.error('Error loading promotions:', error);
        toast.error("Erro ao carregar promoções", { duration: 3000 });
      }
    };

    loadPromotions();

    // Escutar atualizações de outras instâncias
    const handlePromotionsUpdated = (event) => {
      setPromotions(event.detail.promotions);
      setFilteredPromotions(event.detail.promotions);
    };

    window.addEventListener('promotions-updated', handlePromotionsUpdated);
    return () => window.removeEventListener('promotions-updated', handlePromotionsUpdated);
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
  }, [filteredPromotions]);

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
    let filtered = promotions;

    if (searchTerm) {
      filtered = filtered.filter(promotion =>
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "Todos") {
      if (statusFilter === "Ativas") {
        filtered = filtered.filter(p => p.isActive);
      } else if (statusFilter === "Inativas") {
        filtered = filtered.filter(p => !p.isActive);
      } else if (statusFilter === "Expiradas") {
        filtered = filtered.filter(p => new Date(p.endDate) < new Date());
      }
    }

    setFilteredPromotions(filtered);
  }, [promotions, searchTerm, statusFilter]);

  const statusOptions = ["Todos", "Ativas", "Inativas", "Expiradas"];

  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setFormData({
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
      conditions: ""
    });
    setShowForm(true);
  };

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({ ...promotion });
    setShowForm(true);
  };

  const handleDeletePromotion = async (promotionId) => {
    if (!confirm("Tem certeza que deseja excluir esta promoção?")) return;

    setIsLoading(true);
    try {
      promotionStorage.deletePromotion(promotionId);
      toast.success("Promoção excluída com sucesso", { duration: 3000 });
    } catch (error) {
      toast.error("Erro ao excluir promoção", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (promotionId) => {
    setIsLoading(true);
    try {
      const promotion = promotions.find(p => p.id === promotionId);
      if (!promotion) {
        toast.error("Promoção não encontrada", { duration: 3000 });
        return;
      }

      const updatedPromotion = promotionStorage.updatePromotion(promotionId, {
        isActive: !promotion.isActive
      });

      if (updatedPromotion) {
        toast.success(
          `Promoção ${updatedPromotion.isActive ? "ativada" : "desativada"} com sucesso`, 
          { duration: 3000 }
        );
      } else {
        toast.error("Erro ao alterar status da promoção", { duration: 3000 });
      }
    } catch (error) {
      toast.error("Erro ao alterar status da promoção", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingPromotion) {
        // Update
        const updatedPromotion = promotionStorage.updatePromotion(editingPromotion.id, formData);
        if (updatedPromotion) {
          toast.success("Promoção atualizada com sucesso", { duration: 3000 });
        } else {
          toast.error("Erro ao atualizar promoção", { duration: 3000 });
        }
      } else {
        // Create
        const newPromotion = promotionStorage.addPromotion(formData);
        toast.success("Promoção criada com sucesso", { duration: 3000 });
      }

      setShowForm(false);
      setEditingPromotion(null);
    } catch (error) {
      toast.error("Erro ao salvar promoção", { duration: 3000 });
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

  const getPromotionStatus = (promotion) => {
    if (!promotion.isActive) return { text: "Inativa", color: "text-zinc-400", bgColor: "bg-zinc-400/20" };
    if (new Date(promotion.endDate) < new Date()) return { text: "Expirada", color: "text-red-400", bgColor: "bg-red-400/20" };
    return { text: "Ativa", color: "text-emerald-400", bgColor: "bg-emerald-400/20" };
  };

  const getPromotionTypeIcon = (type) => {
    switch (type) {
      case "discount": return <span className="text-emerald-400">%</span>;
      case "shipping": return <span className="text-blue-400">📦</span>;
      case "buyonegetone": return <span className="text-purple-400">2x1</span>;
      default: return <span className="text-zinc-400">?</span>;
    }
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Promoções</h1>
          <p className="text-zinc-400">
            {filteredPromotions.length} promoções encontradas
          </p>
        </div>
        
        <button
          onClick={handleCreatePromotion}
          className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
        >
          <Plus className="h-5 w-5" />
          Nova Promoção
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar promoções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        
        <div className="flex gap-2">
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

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promotion, index) => {
          const status = getPromotionStatus(promotion);
          const TypeIcon = getPromotionTypeIcon(promotion.type);
          
          return (
            <div
              key={promotion.id}
              ref={el => cardsRef.current[index] = el}
              className="group relative rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden transition-all hover:border-emerald-400/30 hover:shadow-emerald-400/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10">
                      {TypeIcon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{promotion.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditPromotion(promotion)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 backdrop-blur-sm transition-all hover:bg-red-500/30"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-zinc-300 line-clamp-2">{promotion.description}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Discount Info */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Desconto</span>
                  <span className="font-bold text-emerald-400">
                    {promotion.discountType === "percentage" 
                      ? `${promotion.discountValue}%`
                      : formatCurrency(promotion.discountValue)
                    }
                  </span>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400">Início:</span>
                    <span className="text-white">{formatDate(promotion.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400">Término:</span>
                    <span className="text-white">{formatDate(promotion.endDate)}</span>
                  </div>
                </div>

                {/* Usage */}
                {promotion.usageLimit && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Uso</span>
                      <span className="text-white">{promotion.usageCount} / {promotion.usageLimit}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full transition-all"
                        style={{ width: `${(promotion.usageCount / promotion.usageLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Min Purchase */}
                {promotion.minPurchaseAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Compra mínima</span>
                    <span className="text-white">{formatCurrency(promotion.minPurchaseAmount)}</span>
                  </div>
                )}

                {/* Conditions */}
                {promotion.conditions && (
                  <div className="text-sm">
                    <span className="text-zinc-400">Condições:</span>
                    <p className="text-zinc-300 mt-1">{promotion.conditions}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => handleToggleStatus(promotion.id)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                    promotion.isActive
                      ? "border border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20"
                      : "border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
                  }`}
                >
                  {promotion.isActive ? (
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

      {/* Promotion Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div ref={formRef} className="w-full max-w-4xl max-h-[90vh] bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Form Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {editingPromotion ? "Editar Promoção" : "Nova Promoção"}
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
                    <label className="block text-sm font-medium text-white mb-2">Nome *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Nome da promoção"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                      placeholder="Descrição da promoção"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tipo de Promoção</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="discount">Desconto</option>
                      <option value="shipping">Frete Grátis</option>
                      <option value="buyonegetone">Compre um Leve outro</option>
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

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                    />
                    <span className="text-white">Promoção ativa</span>
                  </label>
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
                    {editingPromotion ? "Atualizar" : "Criar"} Promoção
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPromotions.length === 0 && (
        <div className="text-center py-20">
          <div className="h-20 w-20 text-zinc-600 mx-auto mb-6 flex items-center justify-center text-4xl">📈</div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhuma promoção encontrada</h3>
          <p className="text-zinc-400 mb-6">
            {searchTerm || statusFilter !== "Todos" 
              ? "Tente ajustar os filtros para encontrar promoções"
              : "Comece criando sua primeira promoção"
            }
          </p>
          {!searchTerm && statusFilter === "Todos" && (
            <button
              onClick={handleCreatePromotion}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
            >
              <Plus className="h-5 w-5" />
              Criar Primeira Promoção
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PromotionsManager;
