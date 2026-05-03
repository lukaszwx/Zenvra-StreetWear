import { useEffect, useState } from "react";
import { products as fallbackProducts } from "../data/products";
import { fetchProducts } from "../services/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      setFallback(false);

      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro inesperado ao carregar produtos.");
      setProducts(fallbackProducts);
      setFallback(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fallback,
    retry: loadProducts,
  };
}