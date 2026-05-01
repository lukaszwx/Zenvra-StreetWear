import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function ProductSkeleton() {
  const skeletonRef = useRef(null);
  const shimmerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação de entrada do skeleton
      gsap.fromTo(skeletonRef.current, {
        opacity: 0,
        scale: 0.95,
        rotationY: -15,
        transformPerspective: 1000
      }, {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.6,
        ease: "power2.out"
      });

      // Animação do shimmer effect
      gsap.fromTo(shimmerRef.current, {
        x: "-100%"
      }, {
        x: "200%",
        duration: 1.5,
        repeat: -1,
        ease: "power1.inOut"
      });

      // Animação de pulse suave
      gsap.to(skeletonRef.current, {
        scale: 1.02,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, skeletonRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={skeletonRef} className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
      {/* Shimmer effect */}
      <div 
        ref={shimmerRef}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
        }}
      />
      
      <div className="relative h-64 bg-zinc-800">
        {/* Placeholder de imagem animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-700 animate-pulse" />
      </div>

      <div className="relative space-y-4 p-5">
        <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
        <div className="h-6 w-4/5 bg-zinc-800 rounded animate-pulse" />
        <div className="h-7 w-32 bg-zinc-800 rounded animate-pulse" />
        <div className="h-11 bg-zinc-800 rounded-xl animate-pulse" />
        <div className="h-12 bg-zinc-800 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default ProductSkeleton;