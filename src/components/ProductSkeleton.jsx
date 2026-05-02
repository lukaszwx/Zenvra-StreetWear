import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function ProductSkeleton() {
  const skeletonRef = useRef(null);
  const shimmerRef = useRef(null);
  const cardRef = useRef(null);
  const pulseRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação cinematográfica de entrada
      gsap.fromTo(skeletonRef.current, {
        opacity: 0,
        scale: 0.85,
        rotationX: 25,
        transformPerspective: 1200
      }, {
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 1.2,
        ease: "power4.out"
      });

      // Shimmer effect premium
      gsap.fromTo(shimmerRef.current, {
        x: "-150%",
        skewX: -20
      }, {
        x: "250%",
        skewX: 20,
        duration: 2.5,
        repeat: -1,
        ease: "power2.inOut"
      });

      // Pulse animado nos elementos
      pulseRefs.current.filter(Boolean).forEach((ref, index) => {
        gsap.to(ref, {
          opacity: 0.3,
          duration: 1.5 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1
        });
      });

      // Subtle float animation
      gsap.to(cardRef.current, {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, skeletonRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={skeletonRef}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm"
    >
      {/* Glow effect */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-emerald-400/8 via-emerald-300/4 to-transparent blur-2xl opacity-50" />
      
      {/* Shimmer overlay */}
      <div 
        ref={shimmerRef}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
      />

      {/* Image skeleton */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800/50">
        <div 
          ref={el => pulseRefs.current[0] = el}
          className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900"
        />
        
        {/* Placeholder icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-zinc-700/50 animate-pulse" />
        </div>

        {/* Action buttons skeleton */}
        <div className="absolute top-4 right-4 flex gap-2">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              ref={el => pulseRefs.current[i] = el}
              className="h-9 w-9 rounded-full bg-zinc-700/50 backdrop-blur-sm"
            />
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Brand badge */}
        <div 
          ref={el => pulseRefs.current[4] = el}
          className="h-6 w-20 rounded-full bg-zinc-800/50"
        />

        {/* Title */}
        <div className="space-y-2">
          <div 
            ref={el => pulseRefs.current[5] = el}
            className="h-6 w-full bg-zinc-800/50 rounded-lg"
          />
          <div 
            ref={el => pulseRefs.current[6] = el}
            className="h-6 w-3/4 bg-zinc-800/50 rounded-lg"
          />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div 
            ref={el => pulseRefs.current[7] = el}
            className="h-8 w-24 bg-zinc-800/50 rounded-lg"
          />
          <div 
            ref={el => pulseRefs.current[8] = el}
            className="h-6 w-16 bg-zinc-700/50 rounded-lg"
          />
        </div>

        {/* Size selector */}
        <div className="space-y-2">
          <div 
            ref={el => pulseRefs.current[9] = el}
            className="h-4 w-16 bg-zinc-800/50 rounded-full"
          />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                ref={el => pulseRefs.current[9 + i] = el}
                className="h-10 w-10 rounded-full bg-zinc-800/50"
              />
            ))}
          </div>
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i}
              ref={el => pulseRefs.current[14 + i] = el}
              className="h-4 w-4 rounded bg-zinc-800/50"
            />
          ))}
          <div 
            ref={el => pulseRefs.current[20] = el}
            className="h-4 w-12 bg-zinc-800/50 rounded"
          />
        </div>

        {/* CTA buttons */}
        <div className="space-y-3 pt-2">
          <div 
            ref={el => pulseRefs.current[21] = el}
            className="h-12 w-full rounded-full bg-emerald-400/20"
          />
          <div 
            ref={el => pulseRefs.current[22] = el}
            className="h-12 w-full rounded-full border border-zinc-700/50 bg-zinc-800/30"
          />
        </div>
      </div>

      {/* Footer info skeleton */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div 
            ref={el => pulseRefs.current[23] = el}
            className="h-4 w-20 bg-zinc-800/50 rounded"
          />
          <div 
            ref={el => pulseRefs.current[24] = el}
            className="h-4 w-16 bg-zinc-800/50 rounded"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
