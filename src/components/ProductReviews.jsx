import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  User, 
  Calendar,
  Image as ImageIcon,
  Camera,
  Send,
  X,
  Check,
  TrendingUp
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // recent, helpful, rating
  
  const reviewsRef = useRef(null);
  const formRef = useRef(null);
  const toast = useToast();

  // Mock reviews data (em prod, viria da API)
  const mockReviews = [
    {
      id: 1,
      author: "João Silva",
      rating: 5,
      comment: "Sneaker incrível! Super confortável e o design é fenomenal. Vale cada centavo.",
      date: "2024-01-15",
      helpful: 24,
      images: [],
      verified: true,
      size: "42"
    },
    {
      id: 2,
      author: "Maria Santos",
      rating: 4,
      comment: "Produto de ótima qualidade, apenas demorou um pouco na entrega. Recomendo!",
      date: "2024-01-10",
      helpful: 18,
      images: [],
      verified: true,
      size: "38"
    },
    {
      id: 3,
      author: "Pedro Costa",
      rating: 5,
      comment: "Exatamente como esperado! Material premium e acabamento impecável. Compraria novamente.",
      date: "2024-01-05",
      helpful: 31,
      images: [],
      verified: false,
      size: "40"
    }
  ];

  useEffect(() => {
    // Em produção, buscar reviews da API
    setReviews(mockReviews);
  }, [productId]);

  // Animações GSAP
  useEffect(() => {
    if (!reviews.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(reviewsRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.5, 
          ease: "power3.out",
          stagger: 0.1
        }
      );
    }, reviewsRef);

    return () => ctx.revert();
  }, [reviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.comment.trim()) {
      toast.error("Escreva um comentário para sua avaliação", {
        duration: 3000
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const review = {
        id: Date.now(),
        author: "Você",
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        images: newReview.images,
        verified: false,
        size: "Selecionado"
      };

      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 5, comment: "", images: [] });
      setShowReviewForm(false);
      
      toast.success("Avaliação enviada com sucesso! ⭐", {
        duration: 4000
      });
    } catch (err) {
      toast.error("Erro ao enviar avaliação. Tente novamente.", {
        duration: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
    
    toast.success("Avaliação marcada como útil! 👍", {
      duration: 2000
    });
  };

  const getAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, size = "small", interactive = false) => {
    const stars = [];
    const starSize = size === "large" ? "h-6 w-6" : "h-4 w-4";
    
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      stars.push(
        <Star
          key={i}
          className={`${starSize} ${
            filled 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-zinc-600"
          } ${interactive ? "cursor-pointer hover:text-yellow-400 transition-colors" : ""}`}
          onClick={() => interactive && setNewReview(prev => ({ ...prev, rating: i }))}
        />
      );
    }
    
    return stars;
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "helpful":
        return b.helpful - a.helpful;
      case "rating":
        return b.rating - a.rating;
      case "recent":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <div className="space-y-8">
      {/* Header Statistics */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">
              {averageRating}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(averageRating), "large")}
            </div>
            <p className="text-zinc-400">
              Baseado em {reviews.length} avaliações
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-zinc-400 w-8">{rating}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                    style={{ 
                      width: `${reviews.length > 0 ? (distribution[rating] / reviews.length) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm text-zinc-400 w-8 text-right">
                  {distribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20 hover:border-emerald-400/50"
        >
          <MessageCircle className="h-5 w-5" />
          Escrever avaliação
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div ref={formRef} className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Sua avaliação
              </label>
              <div className="flex gap-2">
                {renderStars(newReview.rating, "large", true)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Seu comentário
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Conte sua experiência com este produto..."
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-zinc-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400/50 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Enviar avaliação
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="rounded-full border border-zinc-600/30 bg-zinc-800/50 px-6 py-3 font-semibold text-zinc-400 transition-all hover:bg-zinc-700/50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Avaliações ({reviews.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-full border border-white/10 bg-zinc-800/50 backdrop-blur-sm px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="recent">Mais recentes</option>
          <option value="helpful">Mais úteis</option>
          <option value="rating">Melhor avaliadas</option>
        </select>
      </div>

      {/* Reviews List */}
      <div ref={reviewsRef} className="space-y-6">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all hover:border-emerald-400/30"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/50">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{review.author}</h4>
                    {review.verified && (
                      <div className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-1">
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">Verificado</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span>•</span>
                    <span>Tamanho {review.size}</span>
                    <span>•</span>
                    <span>{new Date(review.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <p className="text-zinc-300 mb-4 leading-relaxed">
              {review.comment}
            </p>

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                Útil ({review.helpful})
              </button>
              
              {review.images.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <ImageIcon className="h-4 w-4" />
                  {review.images.length} foto{review.images.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhuma avaliação ainda</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Seja o primeiro a avaliar este produto!
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-emerald-400 transition-all hover:bg-emerald-400/20"
            >
              <MessageCircle className="h-4 w-4" />
              Escrever primeira avaliação
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductReviews;
