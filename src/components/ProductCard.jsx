import { motion } from "framer-motion";
import { Eye, MessageCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import { formatBRL } from "../utils/format";
import { createProductWhatsappLink } from "../utils/whatsapp";
import { useToast } from "../contexts/ToastContext";

function ProductCard({
  product,
  selectedSize,
  onSizeChange,
  onOpenModal,
  whatsappNumber,
}) {
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const coverImage = images[0];
  const hasStock = product.stock !== 0;
  const toast = useToast();

  const addToCart = () => {
    if (!selectedSize) {
      toast.error("Selecione um tamanho", { duration: 3000 });
      return;
    }

    if (!hasStock) {
      toast.error("Produto sem estoque", { duration: 3000 });
      return;
    }

    // Carregar carrinho atual
    const cart = JSON.parse(localStorage.getItem('zenvra-cart') || '[]');
    
    // Verificar se produto já está no carrinho
    const existingItem = cart.find(item => 
      item.id === product.id && item.size === selectedSize
    );

    if (existingItem) {
      // Atualizar quantidade
      const updatedCart = cart.map(item => 
        item.id === product.id && item.size === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('zenvra-cart', JSON.stringify(updatedCart));
      toast.success(`${product.name} atualizado no carrinho!`, { duration: 3000 });
    } else {
      // Adicionar novo item
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        images: product.images || [product.image],
        size: selectedSize,
        quantity: 1,
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand || 'Zenvra',
        addedAt: new Date().toISOString()
      };
      
      const updatedCart = [...cart, newItem];
      localStorage.setItem('zenvra-cart', JSON.stringify(updatedCart));
      toast.success(`${product.name} adicionado ao carrinho!`, { duration: 3000 });
    }

    // Disparar evento para atualizar o carrinho
    window.dispatchEvent(new Event('cart-updated'));
  };

  const whatsappLink = createProductWhatsappLink(
    whatsappNumber,
    product.name,
    product.price,
    selectedSize,
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 shadow-[0_18px_50px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/45 hover:shadow-[0_24px_70px_rgba(16,185,129,0.12)]"
    >
      <button
        type="button"
        onClick={() => onOpenModal(product)}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-zinc-950 text-left"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-lg font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Sem imagem
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-black">
          {product.tag}
        </span>

        {product.oldPrice ? (
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            Oferta
          </span>
        ) : null}

        {!hasStock ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/65 text-xl font-black uppercase tracking-[0.16em] text-white">
            Esgotado
          </span>
        ) : null}

        <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
          Toque para ampliar
        </span>
      </button>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
            {product.category}
          </p>

          <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-black leading-tight text-white">
            {product.name}
          </h3>

          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-white">
              {formatBRL(product.price)}
            </span>

            {product.oldPrice ? (
              <span className="pb-1 text-sm text-zinc-500 line-through">
                {formatBRL(product.oldPrice)}
              </span>
            ) : null}
          </div>
        </div>

        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Escolha o tamanho
          </span>

          <select
            value={selectedSize}
            disabled={!hasStock}
            onChange={(event) => onSizeChange(product.id, event.target.value)}
            className="h-11 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 text-sm font-medium text-white outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.sizes?.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-2">
          {hasStock ? (
            <>
              <button
                type="button"
                onClick={addToCart}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-black text-emerald-400 transition hover:bg-emerald-400/20 hover:border-emerald-400/50"
              >
                <ShoppingCart className="h-4 w-4" />
                Adicionar ao Carrinho
              </button>
              
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-black text-black shadow-[0_0_26px_rgba(52,211,153,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-300"
              >
                <MessageCircle className="h-4 w-4" />
                Comprar pelo WhatsApp
              </a>
            </>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-zinc-700 px-4 text-sm font-black text-zinc-400"
            >
              Produto esgotado
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenModal(product)}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 text-sm font-semibold text-zinc-100 transition hover:border-white/35 hover:bg-white/7"
          >
            <Eye className="h-4 w-4" />
            Ver detalhes
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400">
          <ShoppingBag className="h-4 w-4 text-emerald-300" />
          Compra rápida com mensagem pronta no WhatsApp.
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;