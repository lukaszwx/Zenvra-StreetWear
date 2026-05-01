import { useState } from "react";

import Benefits from "../components/Benefits";
import CategorySection from "../components/CategorySection";
import FloatingWhatsapp from "../components/FloatingWhatsapp";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";

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

        <CategorySection onSelectCategory={handleSelectCategory} />

        <ProductGrid
          products={products}
          quickCategory={quickCategory}
          loading={loading}
          error={error}
          onRetry={retry}
        />

        <Benefits />
      </main>

      <Footer />
      <FloatingWhatsapp />
    </div>
  );
}

export default StorePage;