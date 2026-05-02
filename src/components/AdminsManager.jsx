import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Calendar,
  Shield,
  Key,
  Mail,
  User,
  X,
  Check,
  AlertCircle,
  Save,
  RefreshCw,
  Clock,
  Lock,
  Unlock,
  Crown,
  Settings
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

gsap.registerPlugin(ScrollTrigger);

function AdminsManager() {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isCreating, setIsCreating] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    permissions: {
      products: true,
      promotions: true,
      coupons: true,
      orders: true,
      users: false,
      analytics: true,
      settings: false
    },
    isActive: true,
    lastLogin: null,
    createdAt: ""
  });
  
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);
  const toast = useToast();

  // Mock data inicial
  useEffect(() => {
    const mockAdmins = [
      {
        id: 1,
        name: "João Silva",
        email: "joao@zenvra.com",
        role: "super_admin",
        permissions: {
          products: true,
          promotions: true,
          coupons: true,
          orders: true,
          users: true,
          analytics: true,
          settings: true
        },
        isActive: true,
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria@zenvra.com",
        role: "admin",
        permissions: {
          products: true,
          promotions: true,
          coupons: true,
          orders: true,
          users: false,
          analytics: true,
          settings: false
        },
        isActive: true,
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        createdAt: "2024-02-20T14:30:00Z"
      },
      {
        id: 3,
        name: "Pedro Oliveira",
        email: "pedro@zenvra.com",
        role: "manager",
        permissions: {
          products: true,
          promotions: false,
          coupons: false,
          orders: true,
          users: false,
          analytics: true,
          settings: false
        },
        isActive: true,
        lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: "2024-03-10T09:15:00Z"
      },
      {
        id: 4,
        name: "Ana Costa",
        email: "ana@zenvra.com",
        role: "viewer",
        permissions: {
          products: false,
          promotions: false,
          coupons: false,
          orders: true,
          users: false,
          analytics: true,
          settings: false
        },
        isActive: false,
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: "2024-04-05T16:45:00Z"
      }
    ];
    
    setAdmins(mockAdmins);
    setFilteredAdmins(mockAdmins);
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
  }, [filteredAdmins]);

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
    let filtered = admins;

    if (searchTerm) {
      filtered = filtered.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "Todos") {
      filtered = filtered.filter(admin => admin.role === roleFilter);
    }

    if (statusFilter !== "Todos") {
      filtered = filtered.filter(admin => 
        statusFilter === "Ativos" ? admin.isActive : !admin.isActive
      );
    }

    setFilteredAdmins(filtered);
  }, [admins, searchTerm, roleFilter, statusFilter]);

  const roleOptions = ["Todos", "super_admin", "admin", "manager", "viewer"];
  const statusOptions = ["Todos", "Ativos", "Inativos"];

  const handleCreateAdmin = () => {
    setEditingAdmin(null);
    setFormData({
      name: "",
      email: "",
      role: "admin",
      permissions: {
        products: true,
        promotions: true,
        coupons: true,
        orders: true,
        users: false,
        analytics: true,
        settings: false
      },
      isActive: true,
      lastLogin: null,
      createdAt: ""
    });
    setShowForm(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setFormData({ ...admin });
    setShowForm(true);
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm("Tem certeza que deseja excluir este administrador?")) return;

    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAdmins(prev => prev.filter(a => a.id !== adminId));
      toast.success("Administrador excluído com sucesso", { duration: 3000 });
    } catch (error) {
      toast.error("Erro ao excluir administrador", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (adminId) => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAdmins(prev => prev.map(a => 
        a.id === adminId 
          ? { ...a, isActive: !a.isActive }
          : a
      ));
      
      const admin = admins.find(a => a.id === adminId);
      toast.success(
        `Administrador ${admin.isActive ? "desativado" : "ativado"} com sucesso`, 
        { duration: 3000 }
      );
    } catch (error) {
      toast.error("Erro ao alterar status do administrador", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (editingAdmin) {
        // Update
        setAdmins(prev => prev.map(a => 
          a.id === editingAdmin.id 
            ? { ...formData, updatedAt: new Date().toISOString() }
            : a
        ));
        toast.success("Administrador atualizado com sucesso", { duration: 3000 });
      } else {
        // Create
        const newAdmin = {
          ...formData,
          id: Date.now(),
          lastLogin: null,
          createdAt: new Date().toISOString()
        };
        setAdmins(prev => [...prev, newAdmin]);
        toast.success("Administrador criado com sucesso", { duration: 3000 });
      }

      setShowForm(false);
      setEditingAdmin(null);
    } catch (error) {
      toast.error("Erro ao salvar administrador", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case "super_admin":
        return { name: "Super Admin", color: "text-purple-400", bgColor: "bg-purple-400/20", icon: Crown };
      case "admin":
        return { name: "Admin", color: "text-emerald-400", bgColor: "bg-emerald-400/20", icon: Shield };
      case "manager":
        return { name: "Gerente", color: "text-blue-400", bgColor: "bg-blue-400/20", icon: Settings };
      case "viewer":
        return { name: "Visualizador", color: "text-zinc-400", bgColor: "bg-zinc-400/20", icon: Eye };
      default:
        return { name: role, color: "text-zinc-400", bgColor: "bg-zinc-400/20", icon: User };
    }
  };

  const getPermissionCount = (permissions) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  const handleRoleChange = (role) => {
    const defaultPermissions = {
      super_admin: {
        products: true,
        promotions: true,
        coupons: true,
        orders: true,
        users: true,
        analytics: true,
        settings: true
      },
      admin: {
        products: true,
        promotions: true,
        coupons: true,
        orders: true,
        users: false,
        analytics: true,
        settings: false
      },
      manager: {
        products: true,
        promotions: false,
        coupons: false,
        orders: true,
        users: false,
        analytics: true,
        settings: false
      },
      viewer: {
        products: false,
        promotions: false,
        coupons: false,
        orders: true,
        users: false,
        analytics: true,
        settings: false
      }
    };

    setFormData(prev => ({
      ...prev,
      role,
      permissions: defaultPermissions[role] || prev.permissions
    }));
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Administradores</h1>
          <p className="text-zinc-400">
            {filteredAdmins.length} administradores encontrados
          </p>
        </div>
        
        <button
          onClick={handleCreateAdmin}
          className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
        >
          <Plus className="h-5 w-5" />
          Novo Admin
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar administradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {roleOptions.map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                roleFilter === role
                  ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                  : "text-zinc-400 border border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {role === "Todos" ? role : getRoleInfo(role).name}
            </button>
          ))}
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

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAdmins.map((admin, index) => {
          const roleInfo = getRoleInfo(admin.role);
          const RoleIcon = roleInfo.icon;
          
          return (
            <div
              key={admin.id}
              ref={el => cardsRef.current[index] = el}
              className="group relative rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden transition-all hover:border-emerald-400/30 hover:shadow-emerald-400/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-blue-400">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{admin.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${roleInfo.bgColor} ${roleInfo.color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {roleInfo.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditAdmin(admin)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 backdrop-blur-sm transition-all hover:bg-red-500/30"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Mail className="h-4 w-4" />
                  <span>{admin.email}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Status</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                    admin.isActive 
                      ? "bg-emerald-400/20 text-emerald-400" 
                      : "bg-zinc-400/20 text-zinc-400"
                  }`}>
                    {admin.isActive ? (
                      <>
                        <Unlock className="h-3 w-3" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        Inativo
                      </>
                    )}
                  </span>
                </div>

                {/* Permissions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Permissões</span>
                    <span className="text-white">{getPermissionCount(admin.permissions)}/7</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(admin.permissions).map(([key, value]) => (
                      value && (
                        <span
                          key={key}
                          className="text-xs bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded"
                        >
                          {key === "products" && "Produtos"}
                          {key === "promotions" && "Promoções"}
                          {key === "coupons" && "Cupons"}
                          {key === "orders" && "Pedidos"}
                          {key === "users" && "Usuários"}
                          {key === "analytics" && "Analytics"}
                          {key === "settings" && "Config"}
                        </span>
                      )
                    ))}
                  </div>
                </div>

                {/* Last Login */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400">Último acesso:</span>
                  </div>
                  <span className="text-white text-sm">{formatDate(admin.lastLogin)}</span>
                </div>

                {/* Created At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400">Criado em:</span>
                  </div>
                  <span className="text-white text-sm">{formatDate(admin.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => handleToggleStatus(admin.id)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                    admin.isActive
                      ? "border border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20"
                      : "border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
                  }`}
                >
                  {admin.isActive ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      Ativar
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div ref={formRef} className="w-full max-w-4xl max-h-[90vh] bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Form Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {editingAdmin ? "Editar Administrador" : "Novo Administrador"}
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
                      placeholder="Nome do administrador"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Função *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Gerente</option>
                      <option value="viewer">Visualizador</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                    />
                    <span className="text-white">Administrador ativo</span>
                  </label>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Permissões</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.products}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, products: e.target.checked }
                        }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Gerenciar Produtos</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.promotions}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, promotions: e.target.checked }
                        }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Gerenciar Promoções</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.coupons}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, coupons: e.target.checked }
                        }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Gerenciar Cupons</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.orders}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, orders: e.target.checked }
                        }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Gerenciar Pedidos</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.users}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, users: e.target.checked }
                        }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Gerenciar Usuários</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.analytics}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, analytics: e.target.checked }
                        }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Ver Analytics</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.settings}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, settings: e.target.checked }
                        }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Configurações</span>
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
                    {editingAdmin ? "Atualizar" : "Criar"} Admin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAdmins.length === 0 && (
        <div className="text-center py-20">
          <Users className="h-20 w-20 text-zinc-600 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum administrador encontrado</h3>
          <p className="text-zinc-400 mb-6">
            {searchTerm || roleFilter !== "Todos" || statusFilter !== "Todos"
              ? "Tente ajustar os filtros para encontrar administradores"
              : "Comece adicionando seu primeiro administrador"
            }
          </p>
          {!searchTerm && roleFilter === "Todos" && statusFilter === "Todos" && (
            <button
              onClick={handleCreateAdmin}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
            >
              <Plus className="h-5 w-5" />
              Criar Primeiro Admin
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminsManager;
