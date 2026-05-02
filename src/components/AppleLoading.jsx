import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AppleLoading() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const particlesRef = useRef([]);
  const textRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Criar partículas flutuantes
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-emerald-400 rounded-full';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        containerRef.current?.appendChild(particle);
        particlesRef.current.push(particle);
      }

      // Animação do logo
      gsap.fromTo(logoRef.current, {
        scale: 0,
        rotation: -720,
        opacity: 0
      }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        ease: "back.out(1.7)"
      });

      // Animação das partículas
      particlesRef.current.forEach((particle, index) => {
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          opacity: Math.random() * 0.6 + 0.2,
          duration: Math.random() * 4 + 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1
        });
      });

      // Animação do texto
      gsap.fromTo(textRef.current, {
        y: 20,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.8,
        ease: "power2.out"
      });

      // Animação da barra de progresso
      gsap.fromTo(progressRef.current, {
        width: "0%"
      }, {
        width: "100%",
        duration: 2,
        delay: 1,
        ease: "power2.inOut",
        onComplete: () => {
          // Piscar no final
          gsap.to(progressRef.current, {
            opacity: 0,
            duration: 0.3,
            repeat: 3,
            yoyo: true
          });
        }
      });

      // Efeito de brilho no logo
      gsap.to(logoRef.current, {
        boxShadow: "0 0 60px rgba(16, 185, 129, 0.8)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Animação contínua do container
      gsap.to(containerRef.current, {
        scale: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => {
      ctx.revert();
      // Limpar partículas manualmente
      particlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      particlesRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at 30% 40%, #0f1a21 0%, #050709 50%, #030405 100%)'
      }}
    >
      <div className="relative text-center">
        {/* Logo premium - usando logo da Zenvra */}
        <div 
          ref={logoRef}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <img
            src="/images/zenvralogo.png"
            alt="Logo Zenvra"
            className="w-full h-full object-contain rounded-2xl"
          />
          
          {/* Anel giratório ao redor */}
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/20 animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-1 rounded-xl border border-emerald-400/10 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        </div>

        {/* Texto elegante */}
        <div className="space-y-4">
          <div 
            ref={textRef}
            className="text-emerald-400 text-xl font-light tracking-widest uppercase"
          >
            Carregando Experiência
          </div>

          {/* Barra de progresso premium */}
          <div className="relative w-64 h-1 mx-auto bg-zinc-800 rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
              style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.8)' }}
            />
          </div>

          {/* Loading dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-2 h-2 bg-emerald-400 rounded-full"
                style={{
                  animation: `pulse 1.4s infinite ease-in-out`,
                  animationDelay: `${index * 0.16}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
