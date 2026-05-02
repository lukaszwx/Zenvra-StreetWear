import { useEffect, useRef, useMemo, useState } from "react";
import { gsap } from "gsap";
import { Menu, MessageCircle, X } from "lucide-react";
import { STORE_NAME, WHATSAPP_NUMBER } from "../config/constants";
import { createGenericWhatsappLink } from "../utils/whatsapp";
import { usePremiumAnimations } from "../hooks/usePremiumAnimations";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Categorias", href: "#categorias" },
  { label: "Produtos", href: "#produtos" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Contato", href: "#contato" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const whatsappLink = useMemo(
    () => createGenericWhatsappLink(WHATSAPP_NUMBER),
    [],
  );

  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const buttonRef = useRef(null);

  const {
    createMagneticButton,
    createGlowEffect,
    createFloatingAnimation,
    cleanup
  } = usePremiumAnimations();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação inicial do navbar
      gsap.fromTo(navbarRef.current, {
        y: -100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      });

      // Animação do logo - apenas a imagem animada
      const logoImage = logoRef.current?.querySelector('img');
      if (logoImage) {
        gsap.fromTo(logoImage, {
          scale: 0,
          rotation: -180,
          opacity: 0
        }, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.7)"
        });
      }

      // Animação dos links desktop
      const desktopLinks = document.querySelectorAll('.hidden.lg\\:flex > a');
      gsap.fromTo(desktopLinks, {
        y: -30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out"
      });

      // Animação do botão WhatsApp
      gsap.fromTo(buttonRef.current, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        delay: 0.8,
        ease: "back.out(1.3)"
      });

      // Efeitos contínuos - brilho apenas na imagem da logo
      if (logoRef.current) {
        const logoImage = logoRef.current.querySelector('img');
        if (logoImage) {
          createGlowEffect(logoImage, { color: "rgba(52, 211, 153, 0.4)" });
          createMagneticButton(logoRef.current);
        }
      }
      createMagneticButton(buttonRef.current);

    }, navbarRef);

    return () => {
      ctx.revert();
      cleanup();
    };
  }, [createMagneticButton, createGlowEffect, cleanup]);

  // Animação do menu mobile
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (mobileOpen && linksRef.current) {
        gsap.fromTo(linksRef.current, {
          opacity: 0,
          y: -20,
          height: 0
        }, {
          opacity: 1,
          y: 0,
          height: 'auto',
          duration: 0.3,
          ease: "power2.out"
        });
      } else if (linksRef.current) {
        gsap.to(linksRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.inOut"
        });
      }
    }, linksRef);

    return () => ctx.revert();
  }, [mobileOpen]);

  return (
    <header ref={navbarRef} className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#040607]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a ref={logoRef} href="#inicio" className="flex items-center gap-3">
          <img
            src="/images/zenvralogo.png"
            alt="Logo Zenvra"
            className="h-9 w-9 rounded-lg bg-white/5 object-contain shadow-[0_0_18px_rgba(52,211,153,0.35)] ring-1 ring-emerald-300/50"
          />
          <span className="text-base font-semibold tracking-wide text-white sm:text-lg">
            {STORE_NAME}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-zinc-200 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
          <div 
            ref={linksRef}
            className="border-t border-white/10 bg-[#040607] px-4 py-4 lg:hidden"
          >
            <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4">
              {links.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black"
              >
                <MessageCircle className="h-4 w-4" />
                Comprar no WhatsApp
              </a>
            </nav>
          </div>
        )}
    </header>
  );
}

export default Navbar;
