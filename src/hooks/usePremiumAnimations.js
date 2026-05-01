import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const usePremiumAnimations = () => {
  const timelineRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  const splitTextsRef = useRef([]);

  const createStaggerReveal = useCallback((elements, options = {}) => {
    const {
      delay = 0,
      stagger = 0.1,
      duration = 0.8,
      ease = "power3.out",
      from = { y: 50, opacity: 0 },
      to = { y: 0, opacity: 1 }
    } = options;

    const tl = gsap.timeline({ delay });
    
    tl.fromTo(elements, from, {
      duration,
      ease,
      stagger
    }, to);

    return tl;
  }, []);

  const createParallaxEffect = useCallback((element, speed = 0.5) => {
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.to(element, {
          y: self.progress * speed * -100,
          ease: "none"
        });
      }
    });

    scrollTriggersRef.current.push(trigger);
    return trigger;
  }, []);

  const createTextReveal = useCallback((element, options = {}) => {
    const {
      delay = 0,
      duration = 0.8,
      ease = "power3.out"
    } = options;

    if (!element) return null;

    gsap.set(element, {
      opacity: 0,
      y: 30,
      rotationX: -45,
      transformPerspective: 1000
    });

    const tl = gsap.timeline({ delay });
    tl.to(element, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration,
      ease
    });

    return tl;
  }, []);

  const createMagneticButton = useCallback((button, strength = 0.3) => {
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        rotation: x * 0.1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const createGlowEffect = useCallback((element, options = {}) => {
    const {
      intensity = 0.8,
      duration = 2,
      color = "rgba(16, 185, 129, 0.3)"
    } = options;

    if (!element) return;

    gsap.to(element, {
      boxShadow: `0 0 40px ${color}`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  const createFloatingAnimation = useCallback((element, options = {}) => {
    const {
      amplitude = 10,
      duration = 3,
      ease = "power1.inOut"
    } = options;

    if (!element) return;

    gsap.to(element, {
      y: amplitude,
      duration,
      repeat: -1,
      yoyo: true,
      ease
    });
  }, []);

  const createScaleOnScroll = useCallback((element, scale = 1.2) => {
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      end: "top 20%",
      scrub: 1,
      onUpdate: (self) => {
        const currentScale = 1 + (scale - 1) * self.progress;
        gsap.to(element, {
          scale: currentScale,
          ease: "none"
        });
      }
    });

    scrollTriggersRef.current.push(trigger);
    return trigger;
  }, []);

  const create3DFlip = useCallback((element, options = {}) => {
    const {
      duration = 0.8,
      ease = "power2.inOut",
      trigger = "mouseenter"
    } = options;

    if (!element) return;

    const handleFlip = () => {
      gsap.to(element, {
        rotationY: 180,
        duration,
        ease,
        onComplete: () => {
          gsap.set(element, { rotationY: 0 });
        }
      });
    };

    element.addEventListener(trigger, handleFlip);

    return () => {
      element.removeEventListener(trigger, handleFlip);
    };
  }, []);

  const cleanup = useCallback(() => {
    // Limpar ScrollTriggers
    scrollTriggersRef.current.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
    scrollTriggersRef.current = [];

    // SplitText não está sendo usado, removido

    // Limpar timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Limpar tweens
    gsap.killTweensOf("*");
  }, []);

  return {
    createStaggerReveal,
    createParallaxEffect,
    createTextReveal,
    createMagneticButton,
    createGlowEffect,
    createFloatingAnimation,
    createScaleOnScroll,
    create3DFlip,
    cleanup
  };
};
