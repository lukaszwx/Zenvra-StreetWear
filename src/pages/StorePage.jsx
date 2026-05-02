import { useState } from "react";

import Benefits from "../components/Benefits";
import CategorySection from "../components/CategorySection";
import CouponDisplay from "../components/CouponDisplay";
import FloatingWhatsapp from "../components/FloatingWhatsapp";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import PromotionBanner from "../components/PromotionBanner";
import AIRecommendations from "../components/AIRecommendations";

import { useProducts } from "../hooks/useProducts";

function StorePage() {
  const [quickCategory, setQuickCategory] = useState("Todos");

  const { products, loading, error, retry } = useProducts();

  const handleSelectCategory = (category) => {
    setQuickCategory(category);
    document.getElementById("produtos")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen pt-20">
      <Navbar />

      <main>
        <Hero />

        <PromotionBanner />

        <CategorySection onSelectCategory={handleSelectCategory} />

        <ProductGrid
          products={products}
          quickCategory={quickCategory}
          loading={loading}
          error={error}
          onRetry={retry}
        />

        {/* AI Recommendations Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <AIRecommendations 
              products={products}
              maxRecommendations={8}
            />
          </div>
        </section>

        <CouponDisplay />

        <Benefits />
      </main>

      <Footer />
      <FloatingWhatsapp />
    </div>
  );
}

export default StorePage;