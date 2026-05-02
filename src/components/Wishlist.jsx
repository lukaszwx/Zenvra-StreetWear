import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Heart, 
  X, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  Trash2,
  Share2,
  Eye
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { WHATSAPP_NUMBER } from "../config/constants";
import { createGenericWhatsappLink } from "../utils/whatsapp";

function Wishlist() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const wishlistRef = useRef(null);
  const heartRef = useRef(null);
  const itemsRef = useRef([]);
  const overlayRef = useRef(null);
  const toast = useToast();

  // Carregar wishlist do localStorage com validação robusta
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('zenvra-wishlist');
        if (!savedWishlist) {
          setItems([]);
          return;
        }

        const parsed = JSON.parse(savedWishlist);
        
        // Validar se é array e se os itens são válidos
        if (!Array.isArray(parsed)) {
          console.warn('Wishlist não é um array válido, limpando...');
          localStorage.removeItem('zenvra-wishlist');
          setItems([]);
          return;
        }

        // Validar cada item
        const validItems = parsed.filter(item => {
          const isValid = item && 
            typeof item === 'object' && 
            item.id && 
            item.name && 
            (typeof item.price === 'number' || typeof item.price === 'string') &&
            (typeof item.price === 'number' ? item.price > 0 : parseFloat(item.price) > 0);
          
          if (!isValid) {
            console.warn('Item inválido encontrado na wishlist:', item);
          }
          
          return isValid;
        });

        setItems(validItems);
        
        // Se itens inválidos foram removidos, salvar novamente
        if (validItems.length !== parsed.length) {
          localStorage.setItem('zenvra-wishlist', JSON.stringify(validItems));
          toast.warning('Alguns itens inválidos foram removidos da sua lista', {
            duration: 3000
          });
        }
        
      } catch (err) {
        console.error('Erro ao carregar wishlist:', err);
        localStorage.removeItem('zenvra-wishlist');
        setItems([]);
        toast.error('Erro ao carregar favoritos. Lista foi resetada.', {
          duration: 4000
        });
      }
    };

    loadWishlist();

    // Escutar atualizações da wishlist
    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, []);

  // Salvar wishlist no localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('zenvra-wishlist', JSON.stringify(items));
    } else {
      localStorage.removeItem('zenvra-wishlist');
    }
  }, [items]);

  // Animações GSAP
  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      // Overlay fade in
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      // Wishlist slide in
      gsap.fromTo(wishlistRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power4.out" }
      );

      // Items stagger animation
      gsap.fromTo(itemsRef.current.filter(Boolean),
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.4, 
          ease: "power3.out",
          stagger: 0.1
        }
      );

    }, wishlistRef);

    return () => ctx.revert();
  }, [isOpen]);

  const addToWishlist = (product) => {
    // Validar produto completo
    if (!product || !product.id || !product.name || !product.price) {
      toast.error("Produto inválido para adicionar aos favoritos", {
        duration: 3000
      });
      return;
    }

    setItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      
      if (exists) {
        toast.info(`${product.name} já está nos favoritos ❤️`, {
          duration: 3000
        });
        return prev;
      }

      toast.success(`${product.name} adicionado aos favoritos! ❤️`, {
        duration: 4000
      });

      // Salvar produto COMPLETO com todos os detalhes
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
        description: product.description || '',
        material: product.material || '',
        model: product.model || '',
        year: product.year || new Date().getFullYear(),
        tags: product.tags || [],
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        inStock: product.inStock !== false,
        stock: product.stock || 999,
        featured: product.featured || false,
        new: product.new || false,
        sale: product.sale || false,
        discountPercentage: product.discountPercentage || 0,
        weight: product.weight || 0,
        dimensions: product.dimensions || {},
        careInstructions: product.careInstructions || [],
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      return [...prev, completeProduct];
    });

    // Animar heart icon
    if (heartRef.current) {
      gsap.to(heartRef.current, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  const removeFromWishlist = (productId) => {
    const item = items.find(item => item.id === productId);
    
    setItems(prev => prev.filter(item => item.id !== productId));
    
    toast.info(`${item.name} removido dos favoritos`, {
      duration: 3000
    });
  };

  const clearWishlist = () => {
    if (items.length === 0) {
      toast.info('Sua lista de favoritos já está vazia', {
        duration: 2000
      });
      return;
    }
    
    toast.warning('Lista de favoritos limpa!', {
      duration: 3000
    });
    setItems([]);
  };

  const addToCart = (product) => {
    // Validar se produto tem tamanhos disponíveis
    if (!product.sizes || product.sizes.length === 0) {
      toast.error('Este produto não está disponível no momento', {
        duration: 3000
      });
      return;
    }

    // Verificar se já existe no carrinho
    const cart = JSON.parse(localStorage.getItem('zenvra-cart') || '[]');
    const existingItem = cart.find(item => 
      item.id === product.id && item.size === product.sizes[0]
    );

    if (existingItem) {
      // Atualizar quantidade se já existe
      const updatedCart = cart.map(item =>
        item.id === product.id && item.size === product.sizes[0]
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      
      localStorage.setItem('zenvra-cart', JSON.stringify(updatedCart));
      toast.success(`${product.name} - Quantidade atualizada no carrinho!`, {
        duration: 4000
      });
    } else {
      // Adicionar novo item ao carrinho
      const newCartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        images: product.images || [product.image],
        size: product.sizes[0],
        quantity: 1,
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand || 'Zenvra',
        inStock: product.inStock !== false,
        addedAt: new Date().toISOString()
      };
      
      localStorage.setItem('zenvra-cart', JSON.stringify([...cart, newCartItem]));
      toast.success(`${product.name} adicionado ao carrinho!`, {
        duration: 4000
      });
    }

    // Disparar evento para atualizar o carrinho
    window.dispatchEvent(new Event('cart-updated'));
  };

  const shareWishlist = async () => {
    if (items.length === 0) {
      toast.warning('Adicione produtos para compartilhar', {
        duration: 3000
      });
      return;
    }

    try {
      const message = `💝 *Minha Wishlist Zenvra* 💝
      
${items.map((item, index) => 
  `${index + 1}. ${item.name}
   - Preço: R$ ${item.price.toFixed(2)}
   - Categoria: ${item.category || 'N/A'}`
).join('\n\n')}

*Total: ${items.length} produtos*
*Valor total: R$ ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}*

---
*Compartilhado via Zenvra Store*`;

      if (navigator.share) {
        await navigator.share({
          title: 'Minha Wishlist Zenvra',
          text: message
        });
      } else {
        await navigator.clipboard.writeText(message);
        toast.success('Link da wishlist copiado!', {
          duration: 3000
        });
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      toast.error('Erro ao compartilhar wishlist', {
        duration: 3000
      });
    }
  };

  const getTotalItems = () => items.length;
  const getTotalValue = () => items.reduce((sum, item) => sum + item.price, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <>
      {/* Heart Icon Button */}
      <button
        ref={heartRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 z-40 flex items-center justify-center h-14 w-14 rounded-full border border-red-400/30 bg-red-400/10 backdrop-blur-sm transition-all hover:scale-110 hover:bg-red-400/20 hover:shadow-red-400/25 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#0f1a21]"
        aria-label="Abrir lista de favoritos"
      >
        <Heart className="h-6 w-6 text-red-400" />
        
        {/* Badge com quantidade */}
        {getTotalItems() > 0 && (
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-400 text-xs font-bold text-white">
            {getTotalItems()}
          </div>
        )}
      </button>

      {/* Wishlist Overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Wishlist Panel */}
      <div
        ref={wishlistRef}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-400/10">
              <Heart className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Favoritos</h2>
              <p className="text-sm text-zinc-400">{getTotalItems()} itens</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 mb-4">
                <Heart className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Sua lista está vazia</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Adicione produtos que você ama
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-red-400 transition-all hover:bg-red-400/20"
              >
                <Sparkles className="h-4 w-4" />
                Explorar produtos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  ref={el => itemsRef.current[index] = el}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-800/50 p-4 transition-all hover:border-red-400/30"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-400/8 via-red-300/4 to-transparent blur-2xl opacity-50" />
                  
                  <div className="relative flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-700/50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Heart className="h-6 w-6 text-zinc-500" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="space-y-1">
                        {/* Brand and Name */}
                        <div className="flex items-center gap-2">
                          {item.brand && (
                            <span className="text-xs text-zinc-500">{item.brand}</span>
                          )}
                          <h4 className="font-medium text-white truncate">{item.name}</h4>
                        </div>
                        
                        {/* Category and Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-zinc-400">{item.category || 'Sem categoria'}</span>
                          
                          {item.new && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5">
                              <span className="text-xs text-emerald-400">Novo</span>
                            </span>
                          )}
                          
                          {item.sale && item.discountPercentage > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-400/20 px-2 py-0.5">
                              <span className="text-xs text-red-400">-{item.discountPercentage}%</span>
                            </span>
                          )}
                          
                          {item.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-400/20 px-2 py-0.5">
                              <span className="text-xs text-purple-400">Destaque</span>
                            </span>
                          )}
                        </div>
                        
                        {/* Sizes Available */}
                        {item.sizes && item.sizes.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500">Tamanhos:</span>
                            <div className="flex gap-1">
                              {item.sizes.slice(0, 3).map(size => (
                                <span key={size} className="text-xs bg-zinc-800/50 px-2 py-0.5 rounded text-zinc-300">
                                  {size}
                                </span>
                              ))}
                              {item.sizes.length > 3 && (
                                <span className="text-xs text-zinc-500">+{item.sizes.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Rating */}
                        {item.rating > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(item.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-zinc-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-zinc-400">
                              {item.rating} ({item.reviews || 0})
                            </span>
                          </div>
                        )}
                        
                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-red-400">
                            {formatPrice(item.price)}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-xs text-zinc-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </p>
                          )}
                        </div>
                        
                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                          {item.inStock !== false ? (
                            <span className="text-xs text-emerald-400">Em estoque</span>
                          ) : (
                            <span className="text-xs text-red-400">Esgotado</span>
                          )}
                          
                          {item.stock && item.stock < 10 && item.inStock !== false && (
                            <span className="text-xs text-yellow-400">
                              Apenas {item.stock} unidades
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 transition-all hover:bg-red-400/20 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 transition-all hover:bg-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          title="Adicionar ao carrinho"
                        >
                          <ShoppingBag className="h-4 w-4 text-emerald-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total de itens</span>
                <span className="text-sm font-medium text-white">{getTotalItems()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Valor total</span>
                <span className="text-xl font-bold text-red-400">
                  {formatPrice(getTotalValue())}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={shareWishlist}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-600/30 bg-zinc-800/50 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                <Share2 className="h-5 w-5" />
                Compartilhar lista
              </button>

              <button
                type="button"
                onClick={clearWishlist}
                className="w-full text-center text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Limpar favoritos
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;
