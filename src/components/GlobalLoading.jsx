import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import AppleLoading from "./AppleLoading";

export default function GlobalLoading() {
  const [showLoading, setShowLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Esconder loading após animação completa
      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setShowLoading(false);
          }
        });
      }, 1000); // Reduzido para 1 segundo - melhor UX

      return () => clearTimeout(timer);
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  if (!showLoading) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50">
      <AppleLoading />
    </div>
  );
}
