import { motion } from "framer-motion";
import { Headphones, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Entrega ágil",
    description: "Despacho rápido e rastreamento completo para todo o Brasil.",
  },
  {
    icon: Headphones,
    title: "Atendimento humano",
    description: "Suporte direto no WhatsApp para tirar dúvidas e fechar pedidos.",
  },
  {
    icon: ShieldCheck,
    title: "Seleção premium",
    description: "Produtos escolhidos por qualidade, conforto e estética atual.",
  },
];

function Benefits() {
  return (
    <section id="beneficios" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold tracking-[0.22em] text-emerald-300">BENEFÍCIOS</p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Experiência feita para quem vive o streetwear
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.article
                key={benefit.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-xl border border-white/10 bg-zinc-900/60 p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-300/20 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{benefit.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Benefits;
