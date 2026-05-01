import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";
import { WHATSAPP_NUMBER } from "../config/constants";
import { createGenericWhatsappLink } from "../utils/whatsapp";
import { usePremiumAnimations } from "../hooks/usePremiumAnimations";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);
  
  const whatsappLink = createGenericWhatsappLink(
    WHATSAPP_NUMBER,
    "Olá! Quero atendimento para escolher meu próximo produto na Zenvra.",
  );

  const {
    createStaggerReveal,
    createParallaxEffect,
    createTextReveal,
    createMagneticButton,
    createGlowEffect,
    createFloatingAnimation,
    createScaleOnScroll,
    cleanup
  } = usePremiumAnimations();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Estado inicial com transformações 3D
      gsap.set(contentRef.current, { 
        opacity: 0, 
        y: 60, 
        scale: 0.95,
        rotationY: -15,
        transformPerspective: 1000
      });
      gsap.set(badgeRef.current, { 
        opacity: 0, 
        scale: 0.5,
        rotation: -180,
        transformPerspective: 1000
      });
      gsap.set(titleRef.current, { 
        opacity: 0, 
        y: 80,
        rotationX: -45,
        transformPerspective: 1000
      });
      gsap.set(subtitleRef.current, { 
        opacity: 0, 
        y: 60,
        rotationX: -30,
        transformPerspective: 1000
      });
      gsap.set(buttonsRef.current, { 
        opacity: 0, 
        y: 40,
        scale: 0.9,
        transformPerspective: 1000
      });
      gsap.set(imageRef.current, {
        opacity: 0,
        scale: 1.2,
        rotationY: 45,
        transformPerspective: 1000
      });
      gsap.set(statsRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.8
      });

      // Timeline principal com animações cinematográficas
      const tl = gsap.timeline({
        onComplete: () => {
          // Animações contínuas após a entrada
          createFloatingAnimation(badgeRef.current, { amplitude: 8, duration: 3 });
          createGlowEffect(badgeRef.current, { color: "rgba(16, 185, 129, 0.6)" });
          createMagneticButton(buttonsRef.current?.querySelector('a'));
        }
      });
      
      // Animação do container principal
      tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 1.2,
        ease: "power4.out"
      })
      
      // Badge com efeito elástico
      .to(badgeRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.8")
      
      // Título com rotação 3D
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6")
      
      // Subtítulo
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
      
      // Botões com escala
      .to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.2)"
      }, "-=0.3")
      
      // Imagem com rotação 3D reversa
      .to(imageRef.current, {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.6")
      
      // Estatísticas com stagger
      .to(statsRef.current?.children, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.3)"
      }, "-=0.4");

      // Parallax avançado no scroll
      createParallaxEffect(contentRef.current, 0.8);
      createParallaxEffect(imageRef.current, 1.2);
      
      // Scale no scroll para imagem
      createScaleOnScroll(imageRef.current, 1.1);

    }, heroRef);

    return () => {
      ctx.revert();
      cleanup();
    };
  }, [createStaggerReveal, createParallaxEffect, createTextReveal, createMagneticButton, createGlowEffect, createFloatingAnimation, createScaleOnScroll, cleanup]);

  return (
    <section ref={heroRef} id="inicio" className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_left,rgba(15,23,42,0.98),rgba(2,6,23,1)_52%)]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,540px)] lg:gap-14 lg:px-8">
        <div ref={contentRef} className="max-w-2xl space-y-7">
          <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-300">
            <ShoppingBag className="h-3.5 w-3.5" />
            STREETWEAR PREMIUM
          </div>

          <div ref={titleRef} className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Vista presença.
              <span className="block text-emerald-300">Compre estilo.</span>
            </h1>

            <p ref={subtitleRef} className="max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              Sneakers, roupas e acessórios selecionados para quem quer um visual urbano,
              premium e fácil de comprar pelo WhatsApp.
            </p>
          </div>

          <div ref={buttonsRef} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-bold text-black transition-all hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/25 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Comprar pelo WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#produtos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-700 hover:border-zinc-600 sm:w-auto"
            >
              <ShoppingBag className="h-5 w-5" />
              Ver produtos
            </a>
          </div>

          <div ref={statsRef} className="grid max-w-xl grid-cols-3 gap-3 pt-2">
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
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-emerald-300/25 via-emerald-300/10 to-transparent blur-2xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/70 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:p-4">
            <div className="absolute left-6 top-6 z-10 rounded-full bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur-md">
              <span className="text-zinc-400">Nova coleção</span>{" "}
              <span className="text-white">Zenvra</span>{" "}
              <span className="text-emerald-400">Street-Black</span>
            </div>

            <div ref={imageRef} className="overflow-hidden rounded-[22px] w-full">
              <img
                src="/images/hero.png"
                alt="Campanha streetwear premium da Zenvra"
                className="w-full h-[420px] object-cover object-center sm:h-[520px] lg:h-[620px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;