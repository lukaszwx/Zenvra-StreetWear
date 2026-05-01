import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";
import { WHATSAPP_NUMBER } from "../config/constants";
import { createGenericWhatsappLink } from "../utils/whatsapp";

function Hero() {
  const whatsappLink = createGenericWhatsappLink(
    WHATSAPP_NUMBER,
    "Olá! Quero atendimento para escolher meu próximo produto na Zenvra.",
  );

  return (
    <section id="inicio" className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_left,rgba(15,23,42,0.98),rgba(2,6,23,1)_52%)]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,540px)] lg:gap-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-2xl space-y-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-300">
            <ShoppingBag className="h-3.5 w-3.5" />
            STREETWEAR PREMIUM
          </span>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Vista presença.
              <span className="block text-emerald-300">Compre estilo.</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              Sneakers, roupas e acessórios selecionados para quem quer um visual urbano,
              premium e fácil de comprar pelo WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#produtos"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 text-base font-black text-black shadow-[0_0_32px_rgba(52,211,153,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_0_42px_rgba(52,211,153,0.42)]"
            >
              Ver produtos
              <ArrowRight className="h-5 w-5" />
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" />
              Falar com atendimento
            </a>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <strong className="block text-lg text-white">+20</strong>
              <span className="text-xs text-zinc-400">peças selecionadas</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <strong className="block text-lg text-white">100%</strong>
              <span className="text-xs text-zinc-400">curadoria premium</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <strong className="block text-lg text-white">Zap</strong>
              <span className="text-xs text-zinc-400">compra rápida</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-emerald-300/25 via-emerald-300/10 to-transparent blur-2xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/70 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:p-4">
            <div className="absolute left-6 top-6 z-10 rounded-full bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur-md">
              <span className="text-zinc-400">Nova coleção</span>{" "}
              <span className="text-white">Zenvra</span>{" "}
              <span className="text-emerald-400">Street-Black</span>
            </div>

            <div className="overflow-hidden rounded-[22px]">
              <img
                src="/images/hero.png"
                alt="Campanha streetwear premium da Zenvra"
                className="h-[420px] w-full object-cover object-[56%_center] sm:h-[520px] lg:h-[620px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;