import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchActivePromotions } from "../services/api";
import { 
  Sparkles, 
  Gift, 
  Clock,
  Tag,
  Percent,
  X
} from "lucide-react";

export default function PromotionBanner() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  
  const containerRef = useRef(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(loadPromotions, 60000);
    return () => clearInterval(interval);
  }, []);

  // Escutar eventos de criação de promoção
  useEffect(() => {
    const handlePromotionCreated = () => {
      console.log('🔄 Refreshing promotions after creation...');
      loadPromotions();
    };

    window.addEventListener('promotion-created', handlePromotionCreated);
    return () => window.removeEventListener('promotion-created', handlePromotionCreated);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = {};
      promotions.forEach(promo => {
        if (promo.endDate) {
          const endTime = new Date(promo.endDate).getTime();
          const now = new Date().getTime();
          const distance = endTime - now;
          
          if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            newTimeLeft[promo.id] = {
              days: days.toString().padStart(2, '0'),
              hours: hours.toString().padStart(2, '0'),
              minutes: minutes.toString().padStart(2, '0'),
              seconds: seconds.toString().padStart(2, '0')
            };
          }
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [promotions]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await fetchActivePromotions();
      const promotionsArray = Array.isArray(data) ? data : (data?.promotions || []);
      setPromotions(promotionsArray);
      setError(null);
    } catch (err) {
      setError('Promoções temporariamente indisponíveis');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  const formatDiscount = (promo) => {
    if (promo.discountType === 'percentage') {
      return `${promo.discountValue}% OFF`;
    }
    return `R$ ${promo.discountValue} OFF`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 backdrop-blur-sm mb-8">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">Carregando promoções...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-3xl bg-zinc-800/50 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 backdrop-blur-sm mb-8">
            <X className="h-4 w-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">{error}</span>
          </div>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Gift className="h-12 w-12 text-zinc-600" />
            <p className="text-zinc-400">Nenhuma promoção ativa no momento</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      id="promocoes" 
      className="py-20 bg-gradient-to-b from-[#0f1a21] via-[#050709] to-[#030405]"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-emerald-400/5 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-emerald-300/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 backdrop-blur-sm mb-6">
            <Tag className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Promoções Exclusivas</span>
          </div>
          
          <h2 className="text-4xl font-black leading-tight text-[#f3f4f6] sm:text-5xl mb-6">
            Ofertas que não pode
            <span className="block text-emerald-400">perder.</span>
          </h2>
          
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Aproveite condições especiais em produtos selecionados. 
            Promoções por tempo limitado com descontos imperdíveis.
          </p>
        </div>

        {/* Mobile carousel - horizontal scroll snap */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  delay: index * 0.15
                }}
                className="flex-none w-80 snap-center"
              >
                <PromotionCard promo={promo} timeLeft={timeLeft[promo.id]} getImageUrl={getImageUrl} formatDiscount={formatDiscount} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.96 }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  delay: index * 0.15
                }}
              >
                <PromotionCard promo={promo} timeLeft={timeLeft[promo.id]} getImageUrl={getImageUrl} formatDiscount={formatDiscount} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function PromotionCard({ promo, timeLeft, getImageUrl, formatDiscount }) {
  const imageUrl = getImageUrl(promo.bannerImage);
  
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-emerald-400/10">
      {/* Glow effect */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-emerald-400/10 via-emerald-300/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Badge de desconto */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
          <Percent className="h-3 w-3" />
          {formatDiscount(promo)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Image */}
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-zinc-800/50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={promo.title}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center">
              <Gift className="h-12 w-12 text-zinc-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {promo.title}
            </h3>
            <p className="text-zinc-300 text-sm line-clamp-3">{promo.description}</p>
          </div>

          {/* Countdown Timer */}
          {timeLeft && (
            <div className="flex items-center gap-2 text-emerald-400">
              <Clock className="h-4 w-4" />
              <div className="flex items-center gap-1 text-xs font-medium">
                {timeLeft.days && <span>{timeLeft.days}d</span>}
                {timeLeft.hours && <span>{timeLeft.hours}h</span>}
                {timeLeft.minutes && <span>{timeLeft.minutes}m</span>}
                {timeLeft.seconds && <span>{timeLeft.seconds}s</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
