import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatBRL } from "../utils/format";
import { createProductWhatsappLink } from "../utils/whatsapp";

function ProductModal({
  product,
  onClose,
  selectedSize,
  onSizeChange,
  whatsappNumber,
}) {
  const [activeImage, setActiveImage] = useState(0);

  const images = useMemo(() => {
    if (product?.images?.length) return product.images;
    if (product?.image) return [product.image];
    return [];
  }, [product]);

  const hasStock = product?.stock !== 0;

  useEffect(() => {
    setActiveImage(0);
  }, [product]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();

      if (event.key === "ArrowRight") {
        setActiveImage((prev) => (prev + 1) % Math.max(images.length, 1));
      }

      if (event.key === "ArrowLeft") {
        setActiveImage((prev) =>
          prev === 0 ? Math.max(images.length - 1, 0) : prev - 1,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, onClose]);

  if (!product) return null;

  const whatsappLink =
    selectedSize && hasStock
      ? createProductWhatsappLink(
          whatsappNumber,
          product.name,
          product.price,
          selectedSize,
        )
      : "#";

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 sm:items-center sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-900 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:rounded-3xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Detalhes do produto
              </p>
              <h3 className="mt-1 line-clamp-1 text-base font-bold text-white sm:text-lg">
                {product.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-zinc-300 transition hover:border-white/35 hover:text-white"
              aria-label="Fechar detalhes"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid max-h-[calc(92vh-73px)] gap-6 overflow-y-auto p-5 pb-28 sm:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] sm:p-6 sm:pb-6">
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                {images.length ? (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="h-[330px] w-full object-cover sm:h-[520px]"
                  />
                ) : (
                  <div className="flex h-[330px] items-center justify-center text-zinc-500 sm:h-[520px]">
                    Sem imagem
                  </div>
                )}

                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={previousImage}
                      className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md transition hover:bg-black/80"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md transition hover:bg-black/80"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                      {activeImage + 1}/{images.length}
                    </span>
                  </>
                ) : null}
              </div>

              {images.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition ${
                        activeImage === index
                          ? "border-emerald-300"
                          : "border-white/10 hover:border-white/35"
                      }`}
                      aria-label={`Ver imagem ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  {product.category}
                </p>

                <h4 className="mt-2 text-3xl font-black leading-tight text-white">
                  {product.name}
                </h4>

                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {product.description}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white">
                    {formatBRL(product.price)}
                  </span>

                  {product.oldPrice ? (
                    <span className="text-sm text-zinc-500 line-through">
                      {formatBRL(product.oldPrice)}
                    </span>
                  ) : null}
                </div>

                {hasStock ? (
                  <p className="mt-2 text-sm text-emerald-300">
                    Disponível para compra rápida.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-red-300">
                    Produto esgotado no momento.
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-zinc-200">
                  Escolha o tamanho
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      type="button"
                      key={size}
                      disabled={!hasStock}
                      onClick={() => onSizeChange(product.id, size)}
                      className={`inline-flex h-11 min-w-12 items-center justify-center rounded-xl border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        selectedSize === size
                          ? "border-emerald-300 bg-emerald-300/15 text-emerald-200"
                          : "border-white/15 text-zinc-200 hover:border-white/40 hover:bg-white/5"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300 sm:block">
                Compra pelo WhatsApp com mensagem automática contendo produto,
                tamanho e preço.
              </div>

              {hasStock ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-black text-black shadow-[0_0_30px_rgba(52,211,153,0.22)] transition hover:bg-emerald-300 sm:inline-flex"
                >
                  <MessageCircle className="h-4 w-4" />
                  Comprar pelo WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="hidden h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-zinc-700 px-4 text-sm font-black text-zinc-400 sm:inline-flex"
                >
                  Produto esgotado
                </button>
              )}
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-zinc-950/95 p-4 backdrop-blur-md sm:hidden">
            {hasStock ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-black text-black"
              >
                <MessageCircle className="h-4 w-4" />
                Comprar pelo WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-zinc-700 px-4 text-sm font-black text-zinc-400"
              >
                Produto esgotado
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProductModal;