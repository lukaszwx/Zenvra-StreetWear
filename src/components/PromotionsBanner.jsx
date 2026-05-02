import { useState, useEffect } from "react";
import { X, Tag, Truck, Gift } from "lucide-react";
import { promotionStorage } from "../utils/promotionStorage";

function PromotionsBanner() {
  const [promotions, setPromotions] = useState([]);
  const [currentPromotion, setCurrentPromotion] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const loadPromotions = () => {
      try {
        const allPromotions = promotionStorage.getPromotions();
        console.log('Todas as promoções:', allPromotions);
        
        const activePromotions = promotionStorage.getActivePromotions();
        console.log('Promoções ativas:', activePromotions);
        
        setPromotions(activePromotions);
      } catch (error) {
        console.error('Error loading promotions:', error);
      }
    };

    loadPromotions();

    // Escutar atualizações de promoções
    const handlePromotionsUpdated = () => {
      loadPromotions();
    };

    window.addEventListener('promotions-updated', handlePromotionsUpdated);
    return () => window.removeEventListener('promotions-updated', handlePromotionsUpdated);
  }, []);

  // Auto-rotate promoções
  useEffect(() => {
    if (promotions.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPromotion((prev) => (prev + 1) % promotions.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [promotions.length]);

  if (!isVisible || promotions.length === 0) return null;

  const promotion = promotions[currentPromotion];
  
  const getPromotionIcon = (type) => {
    switch (type) {
      case "discount": return <Tag className="h-5 w-5" />;
      case "shipping": return <Truck className="h-5 w-5" />;
      case "buyonegetone": return <Gift className="h-5 w-5" />;
      default: return <Tag className="h-5 w-5" />;
    }
  };

  const getPromotionText = (promotion) => {
    if (promotion.type === "discount") {
      if (promotion.discountType === "percentage") {
        return `${promotion.discountValue}% OFF`;
      } else {
        return `R$ ${promotion.discountValue} OFF`;
      }
    } else if (promotion.type === "shipping") {
      return "FRETE GRÁTIS";
    } else if (promotion.type === "buyonegetone") {
      return "LEVE 2 PAGUE 1";
    }
    return promotion.name;
  };

  const getPromotionDescription = (promotion) => {
    if (promotion.type === "shipping" && promotion.minPurchaseAmount) {
      return `em compras acima de R$ ${promotion.minPurchaseAmount}`;
    }
    return promotion.description;
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Ícone da Promoção */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              {getPromotionIcon(promotion.type)}
            </div>

            {/* Conteúdo da Promoção */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold tracking-wide">
                  {getPromotionText(promotion)}
                </span>
                <span className="text-sm opacity-90 hidden sm:inline">
                  {getPromotionDescription(promotion)}
                </span>
              </div>
              
              {/* Indicadores para múltiplas promoções */}
              {promotions.length > 1 && (
                <div className="flex gap-1 mt-1">
                  {promotions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAnimating(true);
                        setTimeout(() => {
                          setCurrentPromotion(index);
                          setIsAnimating(false);
                        }, 300);
                      }}
                      className={`h-1 w-6 rounded-full transition-all ${
                        index === currentPromotion 
                          ? 'bg-white' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Ver promoção ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botão Fechar */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Fechar promoção"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Animação de transição */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-300 ${
        isAnimating ? '-translate-x-full' : 'translate-x-full'
      }`} style={{
        animation: isAnimating ? 'shimmer 0.6s ease-out' : 'none'
      }}></div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default PromotionsBanner;
