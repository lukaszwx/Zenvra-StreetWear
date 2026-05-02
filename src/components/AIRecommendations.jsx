import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Brain,
  ArrowRight,
  X,
  Shuffle,
  Heart,
  ShoppingCart,
  Star,
  Zap
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

function AIRecommendations({ 
  currentProduct = null, 
  userBehavior = null, 
  maxRecommendations = 8,
  className = "" 
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState("hybrid"); // collaborative, content, hybrid
  const [explanation, setExplanation] = useState("");
  
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const toast = useToast();

  // Mock AI algorithms (em prod, viria da API ML)
  const aiAlgorithms = {
    collaborative: {
      name: "Colaborativo",
      description: "Baseado em usuários similares",
      icon: Users
    },
    content: {
      name: "Conteúdo",
      description: "Baseado em características do produto",
      icon: Brain
    },
    hybrid: {
      name: "Híbrido",
      description: "Combinação inteligente de múltiplos fatores",
      icon: Sparkles
    }
  };

  // Mock recommendations data (em prod, viria da API ML)
  const generateRecommendations = async (algo) => {
    setLoading(true);
    
    // Simular API call com delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseProducts = [
      {
        id: 1,
        name: "Nike Air Max 270 React",
        price: 899.90,
        originalPrice: 1099.90,
        image: "/images/velocityOne.png",
        category: "Sneakers",
        subcategory: "Running",
        brand: "Nike",
        rating: 4.8,
        reviews: 234,
        tags: ["comfortable", "running", "trendy"],
        colors: ["Preto", "Branco", "Azul"],
        sizes: ["38", "39", "40", "41", "42"],
        confidence: 0.92,
        reason: "Similar ao que você está visualizando",
        trending: true
      },
      {
        id: 2,
        name: "Adidas Ultraboost 22",
        price: 1299.90,
        originalPrice: 1499.90,
        image: "/images/velocityOne.png",
        category: "Sneakers",
        subcategory: "Running",
        brand: "Adidas",
        rating: 4.9,
        reviews: 189,
        tags: ["premium", "comfortable", "performance"],
        colors: ["Preto", "Branco", "Cinza"],
        sizes: ["38", "39", "40", "41", "42"],
        confidence: 0.88,
        reason: "Clientes que gostaram de produtos similares também compraram este",
        trending: true
      },
      {
        id: 3,
        name: "New Balance 550",
        price: 699.90,
        originalPrice: 799.90,
        image: "/images/velocityOne.png",
        category: "Sneakers",
        subcategory: "Lifestyle",
        brand: "New Balance",
        rating: 4.7,
        reviews: 156,
        tags: ["retro", "versatile", "comfortable"],
        colors: ["Verde", "Branco", "Marrom"],
        sizes: ["38", "39", "40", "41", "42"],
        confidence: 0.85,
        reason: "Baseado no seu histórico de visualizações",
        trending: false
      },
      {
        id: 4,
        name: "Jordan Retro 1 High",
        price: 1599.90,
        originalPrice: 1899.90,
        image: "/images/velocityOne.png",
        category: "Sneakers",
        subcategory: "Basketball",
        brand: "Jordan",
        rating: 4.9,
        reviews: 312,
        tags: ["iconic", "basketball", "collectible"],
        colors: ["Vermelho", "Preto", "Branco"],
        sizes: ["38", "39", "40", "41", "42"],
        confidence: 0.79,
        reason: "Tendendo entre usuários com seu perfil",
        trending: true
      },
      {
        id: 5,
        name: "Converse Chuck 70",
        price: 449.90,
        originalPrice: 499.90,
        image: "/images/velocityOne.png",
        category: "Sneakers",
        subcategory: "Lifestyle",
        brand: "Converse",
        rating: 4.6,
        reviews: 98,
        tags: ["classic", "versatile", "casual"],
        colors: ["Preto", "Branco", "Azul"],
        sizes: ["36", "37", "38", "39", "40"],
        confidence: 0.76,
        reason: "Complemento perfeito para seu estilo",
        trending: false
      },
      {
        id: 6,
        name: "Vans Old Skool",
        price: 549.90,
        originalPrice: 599.90,
        image: "/images/velocityOne.png",
        category: "Sneakers",
        subcategory: "Skate",
        brand: "Vans",
        rating: 4.5,
        reviews: 145,
        tags: ["skate", "durable", "classic"],
        colors: ["Preto", "Branco", "Vermelho"],
        sizes: ["36", "37", "38", "39", "40"],
        confidence: 0.73,
        reason: "Popular entre usuários com gostos similares",
        trending: false
      },
      {
        id: 7,
        name: "Puma Suede Classic",
        price: 499.90,
        originalPrice: 549.90,
        image: "/images/velocityOne.png",
        category: "Sneakers",
        subcategory: "Lifestyle",
        brand: "Puma",
        rating: 4.4,
        reviews: 87,
        tags: ["classic", "comfortable", "versatile"],
        colors: ["Preto", "Branco", "Azul"],
        sizes: ["38", "39", "40", "41", "42"],
        confidence: 0.71,
        reason: "Match perfeito com suas preferências",
        trending: false
      },
      {
        id: 8,
        name: "Yeezy Boost 350 V2",
        price: 2299.90,
        originalPrice: 2599.90,
        image: "/images/velocityOne.png",
        category: "Sneakers",
        subcategory: "Lifestyle",
        brand: "Yeezy",
        rating: 4.8,
        reviews: 267,
        tags: ["exclusive", "trendy", "comfortable"],
        colors: ["Cinza", "Preto", "Branco"],
        sizes: ["38", "39", "40", "41", "42"],
        confidence: 0.68,
        reason: "Produto premium para seu perfil",
        trending: true
      }
    ];

    // Aplicar algoritmo específico
    let filtered = [...baseProducts];
    
    switch (algo) {
      case "collaborative":
        filtered = filtered
          .sort((a, b) => b.confidence - a.confidence)
          .map(item => ({
            ...item,
            reason: "Clientes com gostos similares adoraram este produto"
          }));
        setExplanation("Baseado no comportamento de usuários similares a você");
        break;
        
      case "content":
        filtered = filtered
          .sort((a, b) => b.rating - a.rating)
          .map(item => ({
            ...item,
            reason: "Características semelhantes ao que você está visualizando"
          }));
        setExplanation("Baseado nas características do produto atual");
        break;
        
      case "hybrid":
      default:
        filtered = filtered
          .sort((a, b) => (b.confidence * 0.6 + b.rating * 0.4) - (a.confidence * 0.6 + a.rating * 0.4))
          .map(item => ({
            ...item,
            reason: "Recomendação inteligente baseada em múltiplos fatores"
          }));
        setExplanation("Combinação de comportamento de usuários e características do produto");
        break;
    }

    setRecommendations(filtered.slice(0, maxRecommendations));
    setLoading(false);
  };

  useEffect(() => {
    generateRecommendations(algorithm);
  }, [algorithm, currentProduct, maxRecommendations]);

  // Animações GSAP
  useEffect(() => {
    if (!recommendations.length || loading) return;

    const ctx = gsap.context(() => {
      // Container animation
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      // Cards stagger animation
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, scale: 0.9, y: 20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.4, 
          ease: "power2.out",
          stagger: 0.1
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [recommendations, loading]);

  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    toast.info(`Alterando para algoritmo ${aiAlgorithms[newAlgorithm].name}...`, {
      duration: 2000
    });
  };

  const handleShuffle = () => {
    const shuffled = [...recommendations].sort(() => Math.random() - 0.5);
    setRecommendations(shuffled);
    
    // Animação de shuffle
    gsap.fromTo(cardsRef.current.filter(Boolean),
      { scale: 0.95, rotationY: 180 },
      { scale: 1, rotationY: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }
    );
    
    toast.info("Recomendações reorganizadas! 🎲", {
      duration: 2000
    });
  };

  const handleAddToCart = (product) => {
    // Integrar com carrinho existente
    const cart = JSON.parse(localStorage.getItem('zenvra-cart') || '[]');
    const newCartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: product.sizes?.[0] || 'Único',
      quantity: 1,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      addedAt: new Date().toISOString(),
      source: "ai-recommendation"
    };
    
    localStorage.setItem('zenvra-cart', JSON.stringify([...cart, newCartItem]));
    
    toast.success(`${product.name} adicionado ao carrinho!`, {
      duration: 4000
    });
  };

  const handleAddToWishlist = (product) => {
    // Integrar com wishlist existente
    const wishlist = JSON.parse(localStorage.getItem('zenvra-wishlist') || '[]');
    const exists = wishlist.some(item => item.id === product.id);
    
    if (exists) {
      toast.info(`${product.name} já está nos favoritos`, {
        duration: 3000
      });
      return;
    }
    
    const completeProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      images: [product.image],
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      sizes: product.sizes,
      colors: product.colors,
      rating: product.rating,
      reviews: product.reviews,
      tags: product.tags,
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      source: "ai-recommendation"
    };
    
    localStorage.setItem('zenvra-wishlist', JSON.stringify([...wishlist, completeProduct]));
    
    toast.success(`${product.name} adicionado aos favoritos!`, {
      duration: 4000
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Recomendações IA</h3>
              <p className="text-sm text-zinc-400">Analisando seu perfil...</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
              <div className="h-32 bg-zinc-800/50 rounded-xl mb-3 animate-pulse" />
              <div className="h-4 bg-zinc-800/50 rounded mb-2 animate-pulse" />
              <div className="h-4 bg-zinc-800/50 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recomendações IA</h3>
            <p className="text-sm text-zinc-400">{explanation}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Algorithm Selector */}
          <div className="flex rounded-xl border border-white/10 bg-zinc-900/50 p-1">
            {Object.entries(aiAlgorithms).map(([key, algo]) => {
              const Icon = algo.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleAlgorithmChange(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    algorithm === key
                      ? "bg-emerald-400/20 text-emerald-400"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  title={algo.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{algo.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400 transition-all hover:text-white hover:bg-white/5"
            title="Reorganizar recomendações"
          >
            <Shuffle className="h-4 w-4" />
            <span className="hidden sm:inline">Embaralhar</span>
          </button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((product, index) => (
          <div
            key={product.id}
            ref={el => cardsRef.current[index] = el}
            className="group relative rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden transition-all hover:border-emerald-400/30 hover:shadow-emerald-400/10"
          >
            {/* AI Badge */}
            <div className="absolute top-3 left-3 z-10">
              <div className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-1 text-xs font-medium text-emerald-400">
                <Brain className="h-3 w-3" />
                {Math.round(product.confidence * 100)}% match
              </div>
            </div>
            
            {/* Trending Badge */}
            {product.trending && (
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1 rounded-full bg-orange-400/20 px-2 py-1 text-xs font-medium text-orange-400">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </div>
              </div>
            )}

            {/* Product Image */}
            <div className="aspect-square overflow-hidden bg-zinc-800/50">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Sparkles className="h-8 w-8 text-zinc-600" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              {/* Brand & Name */}
              <div>
                <p className="text-xs text-zinc-500">{product.brand}</p>
                <h4 className="font-medium text-white line-clamp-2">{product.name}</h4>
              </div>

              {/* Rating */}
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

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-zinc-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* AI Reason */}
              <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-400/5 border border-emerald-400/10">
                <Brain className="h-3 w-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-300">{product.reason}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-400/20"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Carrinho
                </button>
                
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="flex items-center justify-center rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-400 transition-all hover:bg-red-400/20"
                  title="Adicionar aos favoritos"
                >
                  <Heart className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 mx-auto mb-4">
            <Brain className="h-8 w-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Nenhuma recomendação disponível</h3>
          <p className="text-sm text-zinc-400">
            Nossa IA está analisando seu perfil para encontrar as melhores recomendações.
          </p>
        </div>
      )}
    </div>
  );
}

export default AIRecommendations;
