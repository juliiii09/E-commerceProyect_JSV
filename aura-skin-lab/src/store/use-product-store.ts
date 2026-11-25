import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductItem, PRODUCTS_CATALOG } from "@/data/mock-products";

const DEFAULT_FEATURED_IDS = new Set(["prod-1", "prod-2", "prod-3", "prod-4"]);

function withViewDefaults(items: ProductItem[]): ProductItem[] {
  return items.map((p) => ({
    ...p,
    isVisible: p.isVisible ?? true,
    isFeatured: p.isFeatured ?? DEFAULT_FEATURED_IDS.has(p.id),
    aiRecommended: p.aiRecommended ?? true,
    gallery:
      p.gallery && p.gallery.length > 0
        ? p.gallery
        : [
            p.image,
            "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
          ],
  }));
}

interface ProductStore {
  products: ProductItem[];
  addProduct: (
    product: Omit<ProductItem, "id" | "slug" | "reviewsCount" | "rating">
  ) => ProductItem;
  updateProduct: (id: string, updatedFields: Partial<ProductItem>) => void;
  toggleVisibility: (id: string) => void;
  toggleFeatured: (id: string) => void;
  toggleAiRecommended: (id: string) => void;
  deleteProduct: (id: string) => void;
  resetToDefault: () => void;
  getProductBySlug: (slug: string) => ProductItem | undefined;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: withViewDefaults(PRODUCTS_CATALOG),

      addProduct: (newProductData) => {
        const id = "prod-" + Date.now();
        const baseSlug = newProductData.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        const existingSlugs = new Set(get().products.map((p) => p.slug));
        const slug = existingSlugs.has(baseSlug)
          ? `${baseSlug}-${id.slice(-4)}`
          : baseSlug || id;

        const gallery =
          newProductData.gallery && newProductData.gallery.length > 0
            ? newProductData.gallery
            : [newProductData.image];

        const newProduct: ProductItem = {
          ...newProductData,
          id,
          slug,
          image: gallery[0] || newProductData.image,
          gallery,
          isVisible: newProductData.isVisible ?? true,
          isFeatured: newProductData.isFeatured ?? true,
          aiRecommended: newProductData.aiRecommended ?? true,
          rating: 5.0,
          reviewsCount: 1,
        };

        set({ products: [newProduct, ...get().products] });
        return newProduct;
      },

      updateProduct: (id, updatedFields) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p
          ),
        });
      },

      toggleVisibility: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, isVisible: p.isVisible === false } : p
          ),
        });
      },

      toggleFeatured: (id) => {
        set({
          products: get().products.map((p) => {
            if (p.id !== id) return p;
            const currentlyFeatured =
              p.isFeatured ?? DEFAULT_FEATURED_IDS.has(p.id);
            return { ...p, isFeatured: !currentlyFeatured };
          }),
        });
      },

      toggleAiRecommended: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id
              ? { ...p, aiRecommended: p.aiRecommended === false }
              : p
          ),
        });
      },

      deleteProduct: (id) => {
        set({
          products: get().products.filter((p) => p.id !== id),
        });
      },

      resetToDefault: () => {
        set({ products: withViewDefaults(PRODUCTS_CATALOG) });
      },

      getProductBySlug: (slug) => {
        return get().products.find((p) => p.slug === slug);
      },
    }),
    {
      name: "meve-products-store",
    }
  )
);
