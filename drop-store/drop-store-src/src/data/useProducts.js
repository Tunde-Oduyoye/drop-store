// useProducts.js — fetches real products from the backend API
// Falls back to mock data if the API is unreachable (e.g. offline dev)
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { ALL_PRODUCTS, slugify } from "./products";

let cachedProducts = null;

export function useProducts() {
  const [products, setProducts] = useState(cachedProducts || ALL_PRODUCTS);
  const [loading, setLoading] = useState(!cachedProducts);

  useEffect(() => {
    if (cachedProducts) return;
    api.products.list({ limit: 100 })
      .then(({ products: apiProducts }) => {
        if (apiProducts?.length) {
          // Merge API shape with frontend shape — API products have UUID ids
          // and match the same fields we use in the frontend
          cachedProducts = apiProducts.map(p => ({
            ...p,
            rating: p.rating || 4.5,
            reviews: p._count?.reviews || 0,
            slug: p.slug || slugify(p.name),
          }));
          setProducts(cachedProducts);
        }
      })
      .catch(() => {
        // Silently fall back to mock data if backend unreachable
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
