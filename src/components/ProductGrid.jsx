import { useState, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Filter,
  Grid3X3,
  Heart,
  Bookmark,
  Share2,
  TrendingUp,
  Star,
  Eye,
  ShoppingBag,
  ArrowUpDown,
  X,
  ChevronDown
} from "lucide-react";
import { WHATSAPP_NUMBER } from "../config/constants";
import { useToast } from "../contexts/ToastContext";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import ProductSkeleton from "./ProductSkeleton";
import AdvancedSearch from "./AdvancedSearch";

gsap.registerPlugin(ScrollTrigger);

function ProductGrid({
  products = [],
  quickCategory,
  loading = false,
  error = "",
  fallback = false,
  onRetry,
}) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [savedProducts, setSavedProducts] = useState(new Set());
  const [shareState, setShareState] = useState('idle');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const scrollTriggersRef = useRef([]);

  // Carregar likedProducts da wishlist
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('zenvra-wishlist') || '[]');
    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    const likedIds = new Set(safeWishlist.map(item => item.id));
    setLikedProducts(likedIds);
  }, [products]);

  useEffect(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const initialSizes = safeProducts.reduce((acc, product) => {
      acc[product.id] = product.sizes?.[0] || "";
      return acc;
    }, {});

    setSelectedSizes(initialSizes);
  }, [products]);

  useEffect(() => {
    if (quickCategory) {
      setSelectedCategory(quickCategory);
    }
  }, [quickCategory]);

  const categories = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    return ["Todos", ...new Set(safeProducts.map((product) => product.category))];
  }, [products]);

  const sizes = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const uniqueSizes = [
      ...new Set(safeProducts.flatMap((product) => product.sizes || [])),
    ].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

    return ["Todos", ...uniqueSizes];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = safeProducts.filter((product) => {
      const byName = product.name.toLowerCase().includes(normalizedSearch);
      const byCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      const bySize =
        selectedSizeFilter === "Todos" ||
        product.sizes?.includes(selectedSizeFilter);

      return byName && byCategory && bySize;
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedSizeFilter, sortBy]);

  // Animações GSAP cinematográficas
  useEffect(() => {
    if (visibleProducts.length === 0) return;

    // Limpar ScrollTriggers anteriores
    scrollTriggersRef.current.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
    scrollTriggersRef.current = [];

    const ctx = gsap.context(() => {
      // Animação do header
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
        );
      }

      // Animação dos filtros
      if (filtersRef.current) {
        gsap.fromTo(filtersRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
        );
      }

      // Animação cinematográfica dos cards
      gsap.fromTo(cardRefs.current.filter(Boolean),
        { 
          opacity: 0, 
          y: 80, 
          scale: 0.85,
          rotationX: 25,
          transformPerspective: 1200
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotationX: 0,
          duration: 1.4, 
          ease: "power4.out",
          stagger: 0.15,
          delay: 0.4
        }
      );

      // Parallax profundo nos cards
      cardRefs.current.filter(Boolean).forEach((card, index) => {
        const trigger = ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8,
          onUpdate: (self) => {
            gsap.to(card, {
              y: self.progress * -40,
              scale: 1 + (self.progress * 0.08),
              rotationY: self.progress * 15,
              ease: "none",
              transformPerspective: 1200
            });
          }
        });
        scrollTriggersRef.current.push(trigger);
      });

    }, containerRef);

    return () => {
      scrollTriggersRef.current.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, [visibleProducts]);

  // Handlers premium
  const handleLike = (productId) => {
    // Encontrar o produto completo
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Carregar wishlist atual
    const wishlist = JSON.parse(localStorage.getItem('zenvra-wishlist') || '[]');
    const exists = wishlist.some(item => item.id === productId);

    if (exists) {
      // Remover da wishlist
      const updatedWishlist = wishlist.filter(item => item.id !== productId);
      localStorage.setItem('zenvra-wishlist', JSON.stringify(updatedWishlist));
      toast.info(`${product.name} removido dos favoritos`, { duration: 3000 });
    } else {
      // Adicionar à wishlist
      const completeProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        images: product.images || [product.image],
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand || 'Zenvra',
        sizes: product.sizes || [],
        colors: product.colors || [],
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        tags: product.tags || [],
        stock: product.stock || 0,
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      const updatedWishlist = [...wishlist, completeProduct];
      localStorage.setItem('zenvra-wishlist', JSON.stringify(updatedWishlist));
      toast.success(`${product.name} adicionado aos favoritos!`, { duration: 3000 });
    }

    // Atualizar estado local
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    // Disparar evento para atualizar a Wishlist
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleSave = (productId) => {
    setSavedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleShare = async (product) => {
    setShareState('sharing');
    
    try {
      const text = `Confira este produto na Zenvra: ${product.name} - R$ ${product.price}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Zenvra - ${product.name}`,
          text,
          url: `${window.location.href}#product-${product.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${text} - ${window.location.href}#product-${product.id}`);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      }
    } catch (err) {
      console.log('Share failed:', err);
      setShareState('idle');
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todos");
    setSelectedSizeFilter("Todos");
    setSortBy("featured");
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  // Render principal com design Apple-style cinematográfico
  return (
    <section 
      ref={containerRef}
      id="produtos" 
      className="relative py-24 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405] overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-400/6 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 h-64 w-64 rounded-full bg-emerald-300/4 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-zinc-800/3 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header cinematográfico */}
        <div ref={headerRef} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 backdrop-blur-sm mb-8">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">COLEÇÃO EXCLUSIVA</span>
          </div>
          
          <h2 className="text-5xl font-black leading-tight text-[#f3f4f6] sm:text-6xl mb-8">
            Nossa
            <span className="block text-emerald-400">vitrine.</span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Explore nossa curadoria premium de sneakers, roupas e acessórios. 
            Peças selecionadas para elevar seu streetwear ao próximo nível.
          </p>
        </div>

        {/* Filtros premium */}
        <div ref={filtersRef} className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Advanced Search */}
            <div className="flex-1 max-w-md">
              <AdvancedSearch
                products={products}
                onSearch={(query) => setSearchTerm(query)}
                onFilter={(filter) => setSelectedCategory(filter)}
              />
            </div>

            {/* Filtros group */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none rounded-full border border-white/10 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* Size filter */}
              <div className="relative">
                <select
                  value={selectedSizeFilter}
                  onChange={(e) => setSelectedSizeFilter(e.target.value)}
                  className="appearance-none rounded-full border border-white/10 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all cursor-pointer"
                >
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-full border border-white/10 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all cursor-pointer"
                >
                  <option value="featured">Destaques</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* Toggle filters */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 text-white hover:bg-zinc-800/50 transition-all"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(searchTerm || selectedCategory !== "Todos" || selectedSizeFilter !== "Todos") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">
                  <span>"{searchTerm}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-emerald-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedCategory !== "Todos" && (
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">
                  <span>{selectedCategory}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("Todos")}
                    className="ml-1 hover:text-emerald-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedSizeFilter !== "Todos" && (
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">
                  <span>Tamanho: {selectedSizeFilter}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSizeFilter("Todos")}
                    className="ml-1 hover:text-emerald-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Limpar todos
              </button>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && <ErrorState error={error} onRetry={onRetry} />}

        {/* Products grid cinematográfico */}
        {!loading && !error && (
          <>
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {visibleProducts.map((product, index) => {
                const isLiked = likedProducts.has(product.id);
                const isSaved = savedProducts.has(product.id);
                const isHovered = hoveredProduct === product.id;
                
                return (
                  <div
                    key={product.id}
                    ref={el => cardRefs.current[index] = el}
                    className="group relative"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Glow effect */}
                    <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br from-emerald-400/12 via-emerald-300/6 to-transparent blur-2xl transition-all duration-700 ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} />
                    
                    {/* Product card */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-emerald-400/15">
                      {/* Action buttons overlay */}
                      <div className={`absolute top-4 right-4 z-10 flex gap-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        <button
                          type="button"
                          onClick={() => handleLike(product.id)}
                          aria-pressed={isLiked}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                          <Heart 
                            className={`h-4 w-4 transition-colors ${
                              isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                            }`} 
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSave(product.id)}
                          aria-pressed={isSaved}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                          <Bookmark 
                            className={`h-4 w-4 transition-colors ${
                              isSaved ? 'fill-emerald-400 text-emerald-400' : 'text-white'
                            }`} 
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleShare(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                          <Share2 className="h-4 w-4 text-white" />
                        </button>
                      </div>

                      {/* ProductCard component */}
                      <ProductCard
                        product={product}
                        selectedSize={selectedSizes[product.id]}
                        onSizeChange={handleSizeChange}
                        onOpenModal={setSelectedProduct}
                        whatsappNumber={WHATSAPP_NUMBER}
                      />

                      {/* Share feedback */}
                      {shareState === 'copied' && (
                        <div className="absolute bottom-4 left-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                          Link copiado!
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {visibleProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-600/30 bg-zinc-800/50 px-4 py-2 backdrop-blur-sm mb-6">
                  <ShoppingBag className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-400">Nenhum produto encontrado</span>
                </div>
                <p className="text-zinc-400 mb-6">
                  Tente ajustar os filtros ou busca para encontrar o que procura.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-emerald-400 hover:bg-emerald-400/20 transition-all"
                >
                  <X className="h-4 w-4" />
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        )}

        {/* Product modal */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            selectedSize={selectedSizes[selectedProduct.id]}
            onSizeChange={handleSizeChange}
            onClose={() => setSelectedProduct(null)}
            whatsappNumber={WHATSAPP_NUMBER}
          />
        )}
      </div>
    </section>
  );
}

export default ProductGrid;
