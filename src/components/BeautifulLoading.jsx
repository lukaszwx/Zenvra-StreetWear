import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function BeautifulLoading() {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const textRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Criar partículas
      const particles = [];
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-emerald-400 rounded-full';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        containerRef.current?.appendChild(particle);
        particles.push(particle);
      }
      particlesRef.current = particles;

      // Animação do logo
      gsap.fromTo(logoRef.current, {
        scale: 0,
        rotation: -180,
        opacity: 0
      }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        ease: "back.out(1.7)"
      });

      // Animação do texto
      gsap.fromTo(textRef.current, {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "power2.out"
      });

      // Animação das partículas
      particles.forEach((particle, index) => {
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          opacity: Math.random() * 0.5 + 0.5,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.1
        });
      });

      // Animação de brilho no logo
      gsap.to(logoRef.current, {
        boxShadow: "0 0 40px rgba(16, 185, 129, 0.8)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      // Texto digitando efeito
      const textElement = textRef.current;
      const originalText = "CARREGANDO...";
      let currentText = "";
      let charIndex = 0;

      const typeWriter = () => {
        if (charIndex < originalText.length) {
          currentText += originalText[charIndex];
          textElement.textContent = currentText;
          charIndex++;
          setTimeout(typeWriter, 100);
        } else {
          // Efeito de piscar no final
          gsap.to(textElement, {
            opacity: 0.3,
            duration: 0.5,
            repeat: -1,
            yoyo: true
          });
        }
      };

      setTimeout(typeWriter, 800);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at top left, #0f1a21 0%, #050709 45%, #030405 100%)'
      }}
    >
      <div className="relative text-center">
        {/* Logo animado */}
        <div 
          ref={logoRef}
          className="w-24 h-24 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl transform rotate-45"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl transform rotate-45 flex items-center justify-center">
            <span className="transform -rotate-45 text-emerald-400 font-bold text-2xl">Z</span>
          </div>
        </div>

        {/* Texto animado */}
        <div 
          ref={textRef}
          className="text-emerald-400 text-2xl font-bold tracking-wider mb-4"
        >
          CARREGANDO...
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-3 h-3 bg-emerald-400 rounded-full"
              style={{
                animation: `bounce 1.4s infinite ease-in-out both`,
                animationDelay: `${index * 0.16}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
