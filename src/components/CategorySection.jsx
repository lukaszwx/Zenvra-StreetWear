import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Sneakers",
    description: "Modelos para performance e lifestyle urbano.",
    image: "/images/velocityOne.png",
  },
  {
    name: "Roupas",
    description: "Peças premium para compor o visual completo.",
    image: "/images/ZenvraBlock.png",
  },
  {
    name: "Acessórios",
    description: "Itens essenciais para rotina streetwear.",
    image: null,
  },
];

function CategorySection({ onSelectCategory }) {
  return (
    <section id="categorias" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-300">CATEGORIAS</p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Explore por estilo
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.article
              key={category.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="group overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60"
            >
              <div className="aspect-[16/10] overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-lg font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Esgotado
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <p className="text-sm text-zinc-300">{category.description}</p>
                <button
                  type="button"
                  onClick={() => onSelectCategory(category.name)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Ver {category.name}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
