import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye, 
  Star,
  TrendingUp,
  Image as ImageIcon,
  X,
  Check,
  AlertCircle,
  Upload,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

gsap.registerPlugin(ScrollTrigger);

function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    brand: "Zenvra",
    sizes: [],
    colors: [],
    stock: 0,
    images: [],
    tags: [],
    rating: 0,
    reviews: 0,
    featured: false,
    trending: false,
    new: false,
    sale: false,
    discountPercentage: 0
  });
  
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);
  const toast = useToast();

  // Mock data inicial
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Zenvra Pro Max",
        description: "Tênis premium com tecnologia avançada",
        price: 599.90,
        originalPrice: 799.90,
        category: "Tênis",
        subcategory: "Casual",
        brand: "Zenvra",
        sizes: ["38", "39", "40", "41", "42", "43"],
        colors: ["Preto", "Branco", "Azul"],
        stock: 45,
        images: ["/api/placeholder/400/400"],
        tags: ["premium", "comfort", "style"],
        rating: 4.8,
        reviews: 234,
        featured: true,
        trending: true,
        new: false,
        sale: true,
        discountPercentage: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Street Runner",
        description: "Tênis urbano leve e respirável",
        price: 399.90,
        originalPrice: 399.90,
        category: "Tênis",
        subcategory: "Corrida",
        brand: "Zenvra",
        sizes: ["37", "38", "39", "40", "41", "42"],
        colors: ["Cinza", "Preto", "Rosa"],
        stock: 32,
        images: ["/api/placeholder/400/400"],
        tags: ["running", "lightweight", "breathable"],
        rating: 4.6,
        reviews: 189,
        featured: false,
        trending: false,
        new: true,
        sale: false,
        discountPercentage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
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
  }, [filteredProducts]);

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
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "Todos") {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const categories = ["Todos", ...new Set(products.map(p => p.category))];

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subcategory: "",
      brand: "Zenvra",
      sizes: [],
      colors: [],
      stock: 0,
      images: [],
      tags: [],
      rating: 0,
      reviews: 0,
      featured: false,
      trending: false,
      new: false,
      sale: false,
      discountPercentage: 0
    });
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Produto excluído com sucesso", { duration: 3000 });
    } catch (error) {
      toast.error("Erro ao excluir produto", { duration: 3000 });
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

      if (editingProduct) {
        // Update
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { ...formData, updatedAt: new Date().toISOString() }
            : p
        ));
        toast.success("Produto atualizado com sucesso", { duration: 3000 });
      } else {
        // Create
        const newProduct = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProducts(prev => [...prev, newProduct]);
        toast.success("Produto criado com sucesso", { duration: 3000 });
      }

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error("Erro ao salvar produto", { duration: 3000 });
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

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Produtos</h1>
          <p className="text-zinc-400">
            {filteredProducts.length} produtos encontrados
          </p>
        </div>
        
        <button
          onClick={handleCreateProduct}
          className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                categoryFilter === category
                  ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                  : "text-zinc-400 border border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            ref={el => cardsRef.current[index] = el}
            className="group relative rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden transition-all hover:border-emerald-400/30 hover:shadow-emerald-400/10"
          >
            {/* Product Image */}
            <div className="aspect-square overflow-hidden bg-zinc-800/50">
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-16 w-16 text-zinc-600" />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-zinc-500">{product.brand}</span>
                  {product.featured && (
                    <span className="text-xs bg-purple-400/20 text-purple-400 px-2 py-0.5 rounded-full">
                      Destaque
                    </span>
                  )}
                  {product.new && (
                    <span className="text-xs bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      Novo
                    </span>
                  )}
                  {product.sale && (
                    <span className="text-xs bg-red-400/20 text-red-400 px-2 py-0.5 rounded-full">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white line-clamp-2">{product.name}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2">{product.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-zinc-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-zinc-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Estoque: {product.stock}</span>
                <span className="text-zinc-400">{product.category}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80"
                  title="Editar"
                >
                  <Edit className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 backdrop-blur-sm transition-all hover:bg-red-500/30"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div ref={formRef} className="w-full max-w-4xl max-h-[90vh] bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Form Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
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
                      placeholder="Nome do produto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                      placeholder="Descrição do produto"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Preço *</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Preço Original</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) }))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Categoria</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Tênis, Roupa, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Subcategoria</label>
                      <input
                        type="text"
                        value={formData.subcategory}
                        onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Casual, Esportivo, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Marca</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Marca do produto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Estoque *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informações Adicionais</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tamanhos (separados por vírgula)</label>
                    <input
                      type="text"
                      value={formData.sizes.join(", ")}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                      }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="38, 39, 40, 41, 42"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Cores (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={formData.colors.join(", ")}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        colors: e.target.value.split(",").map(c => c.trim()).filter(Boolean)
                      }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Preto, Branco, Azul"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tags (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={formData.tags.join(", ")}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                      }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="premium, conforto, estilo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Avaliação</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Reviews</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.reviews}
                        onChange={(e) => setFormData(prev => ({ ...prev, reviews: parseInt(e.target.value) }))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Desconto (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: parseInt(e.target.value) }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Produto em destaque</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.trending}
                        onChange={(e) => setFormData(prev => ({ ...prev, trending: e.target.checked }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Em alta</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.new}
                        onChange={(e) => setFormData(prev => ({ ...prev, new: e.target.checked }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Novo produto</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sale}
                        onChange={(e) => setFormData(prev => ({ ...prev, sale: e.target.checked }))}
                        className="w-4 h-4 text-emerald-400 bg-zinc-900 border-white/10 rounded focus:ring-emerald-400"
                      />
                      <span className="text-white">Em promoção</span>
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
                    {editingProduct ? "Atualizar" : "Criar"} Produto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <Package className="h-20 w-20 text-zinc-600 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
          <p className="text-zinc-400 mb-6">
            {searchTerm || categoryFilter !== "Todos" 
              ? "Tente ajustar os filtros para encontrar produtos"
              : "Comece adicionando seu primeiro produto"
            }
          </p>
          {!searchTerm && categoryFilter === "Todos" && (
            <button
              onClick={handleCreateProduct}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
            >
              <Plus className="h-5 w-5" />
              Criar Primeiro Produto
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductsManager;
