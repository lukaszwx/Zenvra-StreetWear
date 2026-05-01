import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "../config/constants";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import ProductSkeleton from "./ProductSkeleton";

function ProductGrid({
  products = [],
  quickCategory,
  loading = false,
  error = "",
  fallback = false,
  onRetry,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const initialSizes = products.reduce((acc, product) => {
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
    return ["Todos", ...new Set(products.map((product) => product.category))];
  }, [products]);

  const sizes = useMemo(() => {
    const uniqueSizes = [
      ...new Set(products.flatMap((product) => product.sizes || [])),
    ].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

    return ["Todos", ...uniqueSizes];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
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

  const selectedModalSize = selectedProduct
    ? selectedSizes[selectedProduct.id]
    : "";

  if (loading) {
    return (
      <section id="produtos" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-300">
              VITRINE ZENVRA
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Carregando produtos...
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && !fallback && products.length === 0) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <>
      <section id="produtos" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10">
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-300">
              VITRINE ZENVRA
            </p>

            <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-black text-white sm:text-4xl">
                  Escolha seu próximo destaque
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                  Filtre por categoria, tamanho ou preço e compre direto pelo
                  WhatsApp com uma mensagem pronta.
                </p>
              </div>

              <p className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-zinc-300">
                {visibleProducts.length} produto
                {visibleProducts.length === 1 ? "" : "s"} encontrado
                {visibleProducts.length === 1 ? "" : "s"}
              </p>
            </div>

            {fallback ? (
              <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-950/20 p-4 text-sm text-yellow-100">
                A API falhou, então mostramos uma vitrine reserva para o site
                não ficar vazio.
              </div>
            ) : null}
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 sm:mb-8">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              <label className="md:col-span-2">
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  <Search className="h-3.5 w-3.5" />
                  Busca por nome
                </span>

                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Ex.: Zenvra Velocity One"
                    className="h-11 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 pr-11 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-300"
                  />
                  <button
                    type="button"
                    aria-label="Buscar"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-emerald-300"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </label>

              <label>
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Categoria
                </span>

                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-11 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-emerald-300"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  Tamanho
                </span>

                <select
                  value={selectedSizeFilter}
                  onChange={(event) =>
                    setSelectedSizeFilter(event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-emerald-300"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  Ordenar
                </span>

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-11 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-emerald-300"
                >
                  <option value="featured">Destaques</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold text-zinc-400 transition hover:text-emerald-300"
            >
              Limpar filtros
            </button>
          </div>

          {visibleProducts.length ? (
            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedSize={selectedSizes[product.id]}
                  onSizeChange={handleSizeChange}
                  onOpenModal={setSelectedProduct}
                  whatsappNumber={WHATSAPP_NUMBER}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        selectedSize={selectedModalSize}
        onSizeChange={handleSizeChange}
        whatsappNumber={WHATSAPP_NUMBER}
      />
    </>
  );
}

export default ProductGrid;