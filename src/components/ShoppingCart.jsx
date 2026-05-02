import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
  Heart,
  Bookmark,
  Share2
} from "lucide-react";
import { WHATSAPP_NUMBER } from "../config/constants";
import { createGenericWhatsappLink } from "../utils/whatsapp";
import { useToast } from "../contexts/ToastContext";

gsap.registerPlugin(ScrollTrigger);

function ShoppingCart({ onCheckout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [checkoutState, setCheckoutState] = useState('idle'); // idle, processing, success
  
  const cartRef = useRef(null);
  const bagRef = useRef(null);
  const itemsRef = useRef([]);
  const overlayRef = useRef(null);
  const toast = useToast();

  // Carregar itens do carrinho do localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('zenvra-cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (err) {
          console.error('Erro ao carregar carrinho:', err);
        }
      }
    };

    loadCart();

    // Escutar atualizações do carrinho
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  // Salvar itens no localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('zenvra-cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('zenvra-cart');
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

      // Cart slide in
      gsap.fromTo(cartRef.current,
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

    }, cartRef);

    return () => ctx.revert();
  }, [isOpen]);

  const addToCart = (product, size, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && item.size === size
      );

      if (existingItem) {
        toast.success(`${product.name} - Quantidade atualizada!`, {
          duration: 3000
        });
        return prev.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success(`${product.name} adicionado à sacola! 🛍️`, {
        duration: 4000
      });

      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity,
        category: product.category
      }];
    });

    // Animar bag icon
    if (bagRef.current) {
      gsap.to(bagRef.current, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (index) => {
    const item = items[index];
    toast.info(`${item.name} removido da sacola`, {
      duration: 3000
    });
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    if (items.length === 0) {
      toast.info('Sua sacola já está vazia', {
        duration: 2000
      });
      return;
    }
    
    toast.warning('Sacola limpa! Todos os itens removidos', {
      duration: 3000
    });
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio', {
        duration: 3000
      });
      return;
    }

    // Fechar carrinho e abrir checkout
    setIsOpen(false);
    
    if (onCheckout) {
      onCheckout();
    } else {
      // Fallback para WhatsApp se não houver onCheckout
      setCheckoutState('processing');

      try {
        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 2000));

        const message = `� *NOVO PEDIDO ZENVRA* �
        
📦 *Produtos:*
${items.map(item => `• ${item.name} - Tamanho: ${item.size} - Qtd: ${item.quantity} - R$ ${item.price.toFixed(2)}`).join('\n')}

📊 *Resumo:*
• Subtotal: R$ ${getTotalPrice().toFixed(2)}
• Total: R$ ${getTotalPrice().toFixed(2)}

📍 *Entrega:*
A combinar com cliente

💳 *Pagamento:* A combinar

---
*Pedido recebido! Aguardamos confirmação para prosseguir.*`;

        const whatsappLink = createGenericWhatsappLink(WHATSAPP_NUMBER, message);
        window.open(whatsappLink, '_blank');
        
        toast.special('🎉 Pedido enviado com sucesso! Redirecionando para WhatsApp...', {
          duration: 5000,
          persistent: true
        });
        
        setCheckoutState('success');
        setTimeout(() => {
          clearCart();
          setIsOpen(false);
          setCheckoutState('idle');
        }, 2000);
        
      } catch (err) {
        console.error('Erro no checkout:', err);
        toast.error('Erro ao processar pedido. Tente novamente.', {
          duration: 4000
        });
        setCheckoutState('idle');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <>
      {/* Bag Icon Button */}
      <button
        ref={bagRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full border border-emerald-400/30 bg-emerald-400/10 backdrop-blur-sm transition-all hover:scale-110 hover:bg-emerald-400/20 hover:shadow-emerald-400/25 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0f1a21]"
        aria-label="Abrir carrinho de compras"
      >
        <ShoppingBag className="h-6 w-6 text-emerald-400" />
        
        {/* Badge com quantidade */}
        {getTotalItems() > 0 && (
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-black">
            {getTotalItems()}
          </div>
        )}
      </button>

      {/* Cart Overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Cart Panel */}
      <div
        ref={cartRef}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10">
              <ShoppingBag className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Sua Sacola</h2>
              <p className="text-sm text-zinc-400">{getTotalItems()} itens</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 mb-4">
                <ShoppingBag className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Sua sacola está vazia</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Adicione produtos incríveis para começar
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-emerald-400 transition-all hover:bg-emerald-400/20"
              >
                <Sparkles className="h-4 w-4" />
                Explorar produtos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}`}
                  ref={el => itemsRef.current[index] = el}
                  className="group rounded-2xl border border-white/10 bg-zinc-800/50 p-4 transition-all hover:border-emerald-400/30"
                >
                  <div className="flex gap-4">
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
                          <ShoppingBag className="h-6 w-6 text-zinc-500" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{item.name}</h4>
                      <p className="text-sm text-zinc-400">Tamanho: {item.size}</p>
                      <p className="text-sm font-semibold text-emerald-400">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 transition-all hover:bg-red-400/20 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full transition-all hover:bg-white/10 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3 text-white" />
                        </button>
                        
                        <span className="text-sm font-medium text-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full transition-all hover:bg-white/10"
                        >
                          <Plus className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Subtotal</span>
                      <span className="text-sm font-semibold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
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
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-xl font-bold text-emerald-400">
                {formatPrice(getTotalPrice())}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutState === 'processing'}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20 hover:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutState === 'processing' ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                  Processando...
                </>
              ) : checkoutState === 'success' ? (
                <>
                  <Check className="h-5 w-5" />
                  Pedido enviado!
                </>
              ) : (
                <>
                  Finalizar compra
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Clear Cart */}
            <button
              type="button"
              onClick={clearCart}
              className="w-full text-center text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Limpar sacola
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ShoppingCart;
