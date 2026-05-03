import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Eye,
  EyeOff,
  ImagePlus,
  Loader,
  LogOut,
  Pencil,
  Search,
  Star,
  Trash2,
  X,
  BarChart3,
  Package,
  Users,
  Settings,
  TrendingUp,
} from "lucide-react";
import AnalyticsDashboard from "./AnalyticsDashboard";

import {
  createAdmin,
  createProduct,
  deleteProduct,
  deleteAdmin,
  fetchAdmins,
  fetchProducts,
  updateProduct,
  uploadImage,
  inviteAdmin,
  createPromotion,
  fetchPromotions,
  fetchActivePromotions,
  updatePromotion,
  deletePromotion,
  createCoupon,
  fetchCoupons,
  fetchActiveCoupons,
  updateCoupon,
  deleteCoupon,
} from "../services/api";

import { useAuth } from "../contexts/AuthContext";

const INITIAL_FORM = {
  name: "",
  category: "Sneakers",
  price: "",
  oldPrice: "",
  sizes: "38,39,40",
  tag: "Novo",
  image: "",
  images: "",
  stock: 1,
  featured: false,
  description: "",
};

const CATEGORIES = ["Sneakers", "Roupas", "Acessórios"];

const TAGS = [
  "Novo",
  "Lançamento",
  "Oferta",
  "Mais vendido",
  "Premium",
  "Edição limitada",
  "Exclusivo",
  "Conforto",
  "Essential",
  "Prático",
  "50% off",
];

function AdminPanel({ onProductsChange, onGoToStore }) {
const { logout, user } = useAuth();

function handleLogout() {
  logout();
  window.location.reload();
  // window.location.href = "/painel-interno-zenvra";
}
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [inviteForm, setInviteForm] = useState({
    email: "",
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("products"); // products, analytics, promotions, coupons, admins

  const galleryImages = useMemo(() => {
    return form.images
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean);
  }, [form.images]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchName = product.name.toLowerCase().includes(normalizedSearch);
      const matchCategory =
        categoryFilter === "Todos" || product.category === categoryFilter;

      return matchName && matchCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const totalStock = useMemo(() => {
    return products.reduce(
      (total, product) => total + Number(product.stock || 0),
      0,
    );
  }, [products]);

  const featuredCount = useMemo(() => {
    return products.filter((product) => product.featured).length;
  }, [products]);

  useEffect(() => {
    loadProducts();
    loadAdmins();
    loadPromotions();
    loadCoupons();
  }, []);

  async function loadProducts() {
    try {
      setIsLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadAdmins() {
    try {
      const data = await fetchAdmins();
      setAdmins(data.admins || []);
    } catch (error) {
      showMessage("error", error.message);
    }
  }

  async function loadPromotions() {
    try {
      const data = await fetchPromotions();
      setPromotions(data.promotions || []);
    } catch (error) {
      showMessage("error", error.message);
    }
  }

  async function loadCoupons() {
    try {
      const data = await fetchCoupons();
      setCoupons(data.coupons || []);
    } catch (error) {
      showMessage("error", error.message);
    }
  }

  async function handleDeleteAdmin(adminId, adminEmail) {
    const confirmation = window.confirm(
      `Remover administrador "${adminEmail}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmation) return;

    try {
      setIsLoading(true);
      await deleteAdmin(adminId);
      await loadAdmins();
      showMessage("success", `Administrador ${adminEmail} removido com sucesso.`);
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreatePromotion(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const promotionData = {
      title: formData.get('title'),
      description: formData.get('description'),
      discountType: formData.get('discountType'),
      discountValue: parseFloat(formData.get('discountValue')),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      minOrderValue: formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue')) : null,
      maxUses: formData.get('maxUses') ? parseInt(formData.get('maxUses')) : null,
    };

    // Validação básica
    if (!promotionData.title || !promotionData.discountType || !promotionData.discountValue || !promotionData.startDate || !promotionData.endDate) {
      showMessage("error", "Preencha todos os campos obrigatórios.");
      return;
    }

    // Validação de datas
    const start = new Date(promotionData.startDate);
    const end = new Date(promotionData.endDate);
    if (end <= start) {
      showMessage("error", "A data de término deve ser posterior à data de início.");
      return;
    }

    try {
      setIsLoading(true);
      await createPromotion(promotionData);
      await loadPromotions();
      event.target.reset();
      showMessage("success", "Promoção criada com sucesso!");
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeletePromotion(promotionId, promotionTitle) {
    const confirmation = window.confirm(
      `Remover promoção "${promotionTitle}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmation) return;

    try {
      setIsLoading(true);
      await deletePromotion(promotionId);
      await loadPromotions();
      showMessage("success", `Promoção ${promotionTitle} removida com sucesso.`);
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateCoupon(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const couponData = {
      code: formData.get('code'),
      description: formData.get('description'),
      discountType: formData.get('discountType'),
      discountValue: parseFloat(formData.get('discountValue')),
      minOrderValue: formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue')) : null,
      maxUses: formData.get('maxUses') ? parseInt(formData.get('maxUses')) : null,
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    };

    // Validação básica
    if (!couponData.code || !couponData.discountType || !couponData.discountValue || !couponData.startDate || !couponData.endDate) {
      showMessage("error", "Preencha todos os campos obrigatórios.");
      return;
    }

    // Validação de datas
    const start = new Date(couponData.startDate);
    const end = new Date(couponData.endDate);
    if (end <= start) {
      showMessage("error", "A data de término deve ser posterior à data de início.");
      return;
    }

    // Validação de código
    if (!/^[A-Z0-9]{3,20}$/.test(couponData.code)) {
      showMessage("error", "O código deve ter entre 3 e 20 caracteres, apenas letras maiúsculas e números.");
      return;
    }

    try {
      setIsLoading(true);
      await createCoupon(couponData);
      await loadCoupons();
      event.target.reset();
      showMessage("success", "Cupom criado com sucesso!");
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteCoupon(couponId, couponCode) {
    const confirmation = window.confirm(
      `Remover cupom "${couponCode}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmation) return;

    try {
      setIsLoading(true);
      await deleteCoupon(couponId);
      await loadCoupons();
      showMessage("success", `Cupom ${couponCode} removido com sucesso.`);
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function showMessage(type, text) {
    setMessage({ type, text });

    if (type === "success") {
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }
  }

  function handleFormChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleImageUpload(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    try {
      setIsUploadingImage(true);
      showMessage("info", "Enviando imagens...");

      const uploadedUrls = [];

      for (const file of files) {
        const response = await uploadImage(file);
        uploadedUrls.push(response.url);
      }

      setForm((previous) => {
        const existingImages = previous.images
          .split(",")
          .map((image) => image.trim())
          .filter(Boolean);

        const allImages = [...existingImages, ...uploadedUrls];

        return {
          ...previous,
          image: previous.image || uploadedUrls[0],
          images: allImages.join(","),
        };
      });

      showMessage(
        "success",
        `${uploadedUrls.length} imagem(ns) enviada(s) com sucesso.`,
      );
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  }

  function setMainImage(imageUrl) {
    setForm((previous) => ({
      ...previous,
      image: imageUrl,
    }));
  }

  function removeImageFromGallery(imageUrl) {
    const updatedImages = galleryImages.filter((image) => image !== imageUrl);

    setForm((previous) => ({
      ...previous,
      images: updatedImages.join(","),
      image:
        previous.image === imageUrl ? updatedImages[0] || "" : previous.image,
    }));
  }

  function normalizeFormData() {
    return {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
      sizes: form.sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean),
      images: galleryImages,
    };
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      showMessage("error", "Preencha o nome do produto.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      showMessage("error", "Informe um preço válido.");
      return;
    }

    try {
      setIsLoading(true);

      const normalizedData = normalizeFormData();

      if (editingId) {
        await updateProduct(editingId, normalizedData);
        showMessage("success", "Produto atualizado com sucesso.");
      } else {
        await createProduct(normalizedData);
        showMessage("success", "Produto criado com sucesso.");
      }

      setForm(INITIAL_FORM);
      setEditingId(null);

      await loadProducts();
      await onProductsChange?.();
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEditProduct(product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice || "",
      sizes: product.sizes?.join(",") || "",
      tag: product.tag || "Novo",
      image: product.image || product.images?.[0] || "",
      images: product.images?.join(",") || product.image || "",
      stock: product.stock ?? 0,
      featured: Boolean(product.featured),
      description: product.description || "",
    });

    document.getElementById("admin-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleDeleteProduct(product) {
    const confirmation = window.confirm(
      `Excluir "${product.name}"?\nEssa ação não pode ser desfeita.`,
    );

    if (!confirmation) return;

    try {
      setIsLoading(true);
      await deleteProduct(product.id);
      await loadProducts();
      await onProductsChange?.();
      showMessage("success", "Produto excluído com sucesso.");
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancelEdit() {
    setForm(INITIAL_FORM);
    setEditingId(null);
    showMessage("info", "Edição cancelada.");
  }

  async function handleCreateAdmin(event) {
  event.preventDefault();

  if (!adminForm.name.trim() || !adminForm.email.trim() || !adminForm.password.trim()) {
    showMessage("error", "Preencha todos os campos do administrador.");
    return;
  }

  if (adminForm.password.length < 6) {
    showMessage("error", "Senha deve ter pelo menos 6 caracteres.");
    return;
  }

  try {
    setIsLoading(true);

    await createAdmin(adminForm);

    setAdminForm({
      name: "",
      email: "",
      password: "",
    });

    await loadAdmins();
    showMessage("success", "Administrador criado com sucesso.");
  } catch (error) {
    showMessage("error", error.message);
  } finally {
    setIsLoading(false);
  }
}

async function handleInviteAdmin(event) {
  event.preventDefault();

  if (!inviteForm.email.trim()) {
    showMessage("error", "Preencha o e-mail do convidado.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(inviteForm.email)) {
    showMessage("error", "E-mail inválido.");
    return;
  }

  try {
    setIsLoading(true);

    await inviteAdmin(inviteForm.email);

    setInviteForm({
      email: "",
    });

    showMessage("success", "Convite enviado com sucesso!");
  } catch (error) {
    showMessage("error", error.message);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <section
      id="admin"
      className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 pt-32 pb-12 sm:pt-36"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-400">
              PAINEL ADMINISTRATIVO
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Gerenciador Zenvra
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Controle produtos, analytics, promoções e cupons com interface completa.
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Logado como{" "}
              <span className="font-semibold text-emerald-300">
                {user?.name || "Admin"}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:items-end">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Produtos
              </p>
              <p className="mt-1 text-3xl font-black text-white">
                {products.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Estoque
              </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGoToStore}
            className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 ${
              message.type === "success"
                ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-300"
                : message.type === "error"
                  ? "border-red-400/30 bg-red-950/20 text-red-300"
                  : "border-yellow-400/30 bg-yellow-950/20 text-yellow-300"
            }`}
          >
            {message.type === "success" && (
              <CheckCircle className="h-5 w-5 shrink-0" />
            )}

            {message.type === "error" && (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}

            {message.type === "info" && (
              <Loader className="h-5 w-5 shrink-0 animate-spin" />
            )}

            <p className="flex-1 text-sm font-semibold">{message.text}</p>

            {message.type !== "info" ? (
              <button
                type="button"
                onClick={() => setMessage({ type: "", text: "" })}
                className="rounded-lg p-1 transition hover:bg-white/10"
                aria-label="Fechar mensagem"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mb-10 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur">
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
      Segurança
    </p>
    <h3 className="mt-2 text-2xl font-black text-white">
      Criar novo administrador
    </h3>
    <p className="mt-1 text-sm text-zinc-400">
      Apenas admins podem criar novos acessos.
    </p>
  </div>

  <form onSubmit={handleCreateAdmin} className="grid gap-4 lg:grid-cols-4">
    <input
      type="text"
      placeholder="Nome"
      value={adminForm.name}
      onChange={(e) =>
        setAdminForm((prev) => ({ ...prev, name: e.target.value }))
      }
      className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400"
    />

    <input
      type="email"
      placeholder="E-mail"
      value={adminForm.email}
      onChange={(e) =>
        setAdminForm((prev) => ({ ...prev, email: e.target.value }))
      }
      className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400"
    />

    <div className="relative">
      <input
        type={showAdminPassword ? "text" : "password"}
        placeholder="Senha provisória"
        value={adminForm.password}
        onChange={(e) =>
          setAdminForm((prev) => ({ ...prev, password: e.target.value }))
        }
        className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 pr-12 text-sm text-white outline-none focus:border-emerald-400"
      />
      <button
        type="button"
        onClick={() => setShowAdminPassword(!showAdminPassword)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 transition hover:text-emerald-300"
        aria-label={showAdminPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showAdminPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>

    <button
      type="submit"
      disabled={isLoading || isUploadingImage}
      className="h-12 rounded-xl bg-emerald-500 font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
    >
      Criar administrador
    </button>
  </form>
</div>

        <div className="mb-10 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur">
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
      Convites
    </p>
    <h3 className="mt-2 text-2xl font-black text-white">
      Convidar novo administrador
    </h3>
    <p className="mt-1 text-sm text-zinc-400">
      Envie um convite por e-mail para um novo administrador. Ele receberá um link para criar sua própria senha.
    </p>
  </div>

  <form onSubmit={handleInviteAdmin} className="grid gap-4 lg:grid-cols-2">
    <input
      type="email"
      placeholder="E-mail do convidado"
      value={inviteForm.email}
      onChange={(e) =>
        setInviteForm((prev) => ({ ...prev, email: e.target.value }))
      }
      className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400"
    />

    <button
      type="submit"
      disabled={isLoading || isUploadingImage}
      className="h-12 rounded-xl bg-blue-500 font-bold text-white hover:bg-blue-400 disabled:opacity-50"
    >
      Enviar convite
    </button>
  </form>
</div>

        <div className="mb-10 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur">
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
      Administradores
    </p>
    <h3 className="mt-2 text-2xl font-black text-white">
      Administradores Atuais
    </h3>
    <p className="mt-1 text-sm text-zinc-400">
      Total de {admins.length} administrador{admins.length !== 1 ? 'es' : ''} no sistema.
    </p>
  </div>

  {admins.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-zinc-400">Nenhum administrador encontrado.</p>
    </div>
  ) : (
    <div className="space-y-3">
      {admins.map((admin) => (
        <div
          key={admin.id}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/50 p-4 transition hover:border-emerald-400/30"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-300">
                {admin.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white">{admin.name}</p>
              <p className="text-sm text-zinc-400">{admin.email}</p>
              <p className="text-xs text-zinc-500">
                Criado em {new Date(admin.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {admin.email === user?.email && (
              <span className="px-2 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/20 rounded-lg">
                Você
              </span>
            )}
            {admin.email !== user?.email && admins.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                disabled={isLoading}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/30 bg-red-950/20 text-red-300 transition hover:border-red-400/50 hover:bg-red-950/40 disabled:opacity-50"
                aria-label={`Remover administrador ${admin.email}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        {/* Seção de Promoções */}
        <div className="mb-10 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur">
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
      Promoções
    </p>
    <h3 className="mt-2 text-2xl font-black text-white">
      Gerenciar Promoções
    </h3>
    <p className="mt-1 text-sm text-zinc-400">
      Crie e gerencie promoções para produtos específicos.
    </p>
  </div>

  <div className="space-y-6">
    {/* Formulário de criação de promoção */}
    <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-6">
      <h4 className="mb-4 text-lg font-semibold text-white">Nova Promoção</h4>
      
      <form onSubmit={handleCreatePromotion} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Título da Promoção *</label>
            <input
              name="title"
              type="text"
              placeholder="Ex: Verão 2024 - 30% OFF"
              required
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Descrição</label>
            <input
              name="description"
              type="text"
              placeholder="Descreva os detalhes da promoção"
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Tipo de Desconto *</label>
            <select 
              name="discountType"
              required
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="">Selecione o tipo</option>
              <option value="percentage">Porcentagem (%)</option>
              <option value="fixed">Valor Fixo (R$)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Valor do Desconto *</label>
            <div className="relative">
              <input
                name="discountValue"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 pr-12 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                {document.querySelector('select[name="discountType"]')?.value === 'percentage' ? '%' : 'R$'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Data de Início *</label>
            <input
              name="startDate"
              type="datetime-local"
              required
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Data de Término *</label>
            <input
              name="endDate"
              type="datetime-local"
              required
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Pedido Mínimo (Opcional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">R$</span>
              <input
                name="minOrderValue"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 pl-12 pr-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Máximo de Usos (Opcional)</label>
            <input
              name="maxUses"
              type="number"
              placeholder="Sem limite"
              min="1"
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-emerald-500 font-bold text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Criando...' : 'Criar Promoção'}
          </button>
          
          <button
            type="button"
            onClick={() => event.target.form.reset()}
            className="px-6 h-12 rounded-xl border border-white/15 bg-zinc-950 font-medium text-white hover:bg-zinc-900 transition-colors"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>

    {/* Lista de promoções existentes */}
    <div>
      <h4 className="mb-4 text-lg font-semibold text-white">Promoções Ativas ({promotions.length})</h4>
      
      {promotions.length === 0 ? (
        <div className="text-center py-8 rounded-xl border border-white/10 bg-zinc-950/30">
          <p className="text-zinc-400">Nenhuma promoção criada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/50 p-4"
            >
              <div>
                <p className="font-semibold text-white">{promotion.title}</p>
                <p className="text-sm text-zinc-400">{promotion.description}</p>
                <p className="text-xs text-zinc-500">
                  {promotion.discountType === 'percentage' 
                    ? `${promotion.discountValue}% de desconto`
                    : `R$ ${promotion.discountValue.toFixed(2)} de desconto`
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                  promotion.isActive 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {promotion.isActive ? 'Ativa' : 'Inativa'}
                </span>
                
                <button
                  type="button"
                  onClick={() => handleDeletePromotion(promotion.id, promotion.title)}
                  disabled={isLoading}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/30 bg-red-950/20 text-red-300 transition hover:border-red-400/50 hover:bg-red-950/40 disabled:opacity-50"
                  aria-label={`Remover promoção ${promotion.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

        {/* Seção de Cupons */}
        <div className="mb-10 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur">
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
      Cupons
    </p>
    <h3 className="mt-2 text-2xl font-black text-white">
      Gerenciar Cupons
    </h3>
    <p className="mt-1 text-sm text-zinc-400">
      Crie cupons de desconto para os clientes.
    </p>
  </div>

  <div className="space-y-6">
    {/* Formulário de criação de cupom */}
    <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-6">
      <h4 className="mb-4 text-lg font-semibold text-white">Novo Cupom</h4>
      
      <form onSubmit={handleCreateCoupon} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Código do Cupom *</label>
            <input
              name="code"
              type="text"
              placeholder="VERAO20"
              required
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white uppercase outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
            <p className="text-xs text-zinc-500">Use letras e números, sem espaços ou caracteres especiais</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Descrição</label>
            <input
              name="description"
              type="text"
              placeholder="Desconto especial de verão"
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Tipo de Desconto *</label>
            <select 
              name="discountType"
              required
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="">Selecione o tipo</option>
              <option value="percentage">Porcentagem (%)</option>
              <option value="fixed">Valor Fixo (R$)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Valor do Desconto *</label>
            <div className="relative">
              <input
                name="discountValue"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 pr-12 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                {document.querySelector('select[name="discountType"]')?.value === 'percentage' ? '%' : 'R$'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Pedido Mínimo (Opcional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">R$</span>
              <input
                name="minOrderValue"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 pl-12 pr-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Máximo de Usos (Opcional)</label>
            <input
              name="maxUses"
              type="number"
              placeholder="Sem limite"
              min="1"
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
            <p className="text-xs text-zinc-500">Deixe em branco para uso ilimitado</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Data de Início *</label>
            <input
              name="startDate"
              type="datetime-local"
              required
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Data de Término *</label>
            <input
              name="endDate"
              type="datetime-local"
              required
              className="h-12 w-full rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-emerald-500 font-bold text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Criando...' : 'Criar Cupom'}
          </button>
          
          <button
            type="button"
            onClick={() => event.target.form.reset()}
            className="px-6 h-12 rounded-xl border border-white/15 bg-zinc-950 font-medium text-white hover:bg-zinc-900 transition-colors"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>

    {/* Lista de cupons existentes */}
    <div>
      <h4 className="mb-4 text-lg font-semibold text-white">Cupons Criados ({coupons.length})</h4>
      
      {coupons.length === 0 ? (
        <div className="text-center py-8 rounded-xl border border-white/10 bg-zinc-950/30">
          <p className="text-zinc-400">Nenhum cupom criado ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/50 p-4"
            >
              <div>
                <p className="font-semibold text-white">{coupon.code}</p>
                <p className="text-sm text-zinc-400">{coupon.description}</p>
                <p className="text-xs text-zinc-500">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}% de desconto`
                    : `R$ ${coupon.discountValue.toFixed(2)} de desconto`
                  }
                  {coupon.currentUses && coupon.maxUses && 
                    ` • ${coupon.currentUses}/${coupon.maxUses} usos`
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                  coupon.isActive 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {coupon.isActive ? 'Ativo' : 'Inativo'}
                </span>
                
                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                  disabled={isLoading}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/30 bg-red-950/20 text-red-300 transition hover:border-red-400/50 hover:bg-red-950/40 disabled:opacity-50"
                  aria-label={`Remover cupom ${coupon.code}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

        <form id="admin-form" onSubmit={handleFormSubmit} className="mb-10">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur sm:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-2xl font-black text-white">
                  {editingId ? "Editar produto" : "Novo produto"}
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  Preencha as informações e salve para atualizar a vitrine.
                </p>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-bold text-white transition hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                  Cancelar edição
                </button>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-2 text-sm font-semibold text-zinc-300">
                    Nome do produto
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Ex.: Zenvra Velocity One"
                    required
                    className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 text-sm font-semibold text-zinc-300">
                    Categoria
                  </span>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none transition focus:border-emerald-400"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-2 text-sm font-semibold text-zinc-300">
                    Preço
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                    className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 text-sm font-semibold text-zinc-300">
                    Preço anterior
                  </span>

                  <input
                    type="number"
                    name="oldPrice"
                    value={form.oldPrice}
                    onChange={handleFormChange}
                    placeholder="Opcional"
                    step="0.01"
                    className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-2 text-sm font-semibold text-zinc-300">
                    Tamanhos
                  </span>

                  <input
                    type="text"
                    name="sizes"
                    value={form.sizes}
                    onChange={handleFormChange}
                    placeholder="Ex.: 38,39,40"
                    className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 text-sm font-semibold text-zinc-300">
                    Estoque
                  </span>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleFormChange}
                    min="0"
                    required
                    className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-2 text-sm font-semibold text-zinc-300">
                    Tag
                  </span>

                  <select
                    name="tag"
                    value={form.tag}
                    onChange={handleFormChange}
                    className="h-12 rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-white outline-none transition focus:border-emerald-400"
                  >
                    {TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex h-12 items-center gap-3 self-end rounded-xl border border-white/15 bg-zinc-950 px-4 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleFormChange}
                    className="h-5 w-5 accent-emerald-400"
                  />
                  Produto em destaque
                </label>
              </div>

              <label className="flex flex-col">
                <span className="mb-2 text-sm font-semibold text-zinc-300">
                  Descrição
                </span>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Descreva as características do produto..."
                  rows="4"
                  className="rounded-xl border border-white/15 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400"
                />
              </label>

              <div>
                <label className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300">
                  <ImagePlus className="h-4 w-4 text-emerald-300" />
                  Upload de imagens
                </label>

                <div className="rounded-2xl border-2 border-dashed border-white/10 bg-zinc-950/60 p-6 text-center transition hover:border-emerald-400/40">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                    id="image-upload"
                  />

                  <label
                    htmlFor="image-upload"
                    className="flex cursor-pointer flex-col items-center gap-2"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader className="h-7 w-7 animate-spin text-emerald-400" />
                        <p className="text-sm font-semibold text-zinc-300">
                          Enviando imagens...
                        </p>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-7 w-7 text-zinc-400" />
                        <p className="text-sm font-semibold text-zinc-300">
                          Clique para enviar imagens do produto
                        </p>
                        <p className="text-xs text-zinc-500">
                          PNG, JPG ou WEBP. Você pode selecionar várias imagens.
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {galleryImages.length > 0 ? (
                <div>
                  <p className="mb-3 text-sm font-semibold text-zinc-300">
                    Galeria ({galleryImages.length})
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {galleryImages.map((image) => (
                      <div
                        key={image}
                        className={`group relative overflow-hidden rounded-2xl border bg-zinc-950 ${
                          form.image === image
                            ? "border-emerald-400"
                            : "border-white/10"
                        }`}
                      >
                        <img
                          src={image}
                          alt="Prévia da galeria"
                          className="aspect-square w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/65 opacity-0 transition group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setMainImage(image)}
                            title="Definir como principal"
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                              form.image === image
                                ? "bg-emerald-500 text-white"
                                : "bg-white/20 text-white hover:bg-white/40"
                            }`}
                          >
                            <Star className="h-4 w-4" fill="currentColor" />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeImageFromGallery(image)}
                            title="Remover imagem"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/80 text-white transition hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {form.image === image ? (
                          <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">
                            <Star className="h-3 w-3" fill="currentColor" />
                            Principal
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={isLoading || isUploadingImage}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-black text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : null}
                  {editingId ? "Atualizar produto" : "Criar produto"}
                </button>

                {editingId ? (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="h-12 flex-1 rounded-xl border border-white/15 px-6 text-sm font-bold text-white transition hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </form>

        <div className="mb-8 rounded-3xl border border-white/10 bg-zinc-900/70 p-4 backdrop-blur">
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                <Search className="h-3.5 w-3.5" />
                Buscar produto
              </span>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Ex.: Zenvra Velocity One"
                  className="h-11 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400"
                />

                <button
                  type="button"
                  aria-label="Buscar"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 transition hover:text-emerald-300"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </label>

            <label>
              <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                <ChevronDown className="h-3.5 w-3.5" />
                Categoria
              </span>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-emerald-400"
              >
                <option value="Todos">Todos</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div>
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h3 className="text-xl font-black text-white">
                Produtos cadastrados
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {filteredProducts.length} produto
                {filteredProducts.length === 1 ? "" : "s"} encontrado
                {filteredProducts.length === 1 ? "" : "s"}.
              </p>
            </div>
          </div>

          {isLoading && filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-zinc-900/70 py-16">
              <Loader className="h-7 w-7 animate-spin text-emerald-400" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-10 text-center">
              <p className="text-sm font-medium text-zinc-400">
                Nenhum produto encontrado com os filtros atuais.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-900/70">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                      Produto
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                      Categoria
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                      Preço
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                      Estoque
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const productImage = product.image || product.images?.[0];

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.03] last:border-b-0"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={product.name}
                                className="h-12 w-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-zinc-800" />
                            )}

                            <div>
                              <p className="text-sm font-bold text-white">
                                {product.name}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {product.tag}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-zinc-300">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-emerald-300">
                            R$ {Number(product.price).toFixed(2)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              Number(product.stock) > 0
                                ? "bg-yellow-400/10 text-yellow-300"
                                : "bg-red-400/10 text-red-300"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditProduct(product)}
                              title="Editar produto"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-zinc-300 transition hover:border-emerald-400/50 hover:text-emerald-300"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product)}
                              title="Excluir produto"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-zinc-300 transition hover:border-red-400/50 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;