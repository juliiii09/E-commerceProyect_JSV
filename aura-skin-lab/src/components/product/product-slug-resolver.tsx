"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductItem } from "@/data/mock-products";
import { useProductStore } from "@/store/use-product-store";
import { ProductView } from "@/components/product/product-view";
import { useHasMounted } from "@/hooks/use-has-mounted";

export function ProductSlugResolver({
  slug,
  initialProduct,
}: {
  slug: string;
  initialProduct?: ProductItem;
}) {
  const mounted = useHasMounted();
  const { getProductBySlug } = useProductStore();

  const resolvedProduct = mounted
    ? getProductBySlug(slug) ?? initialProduct
    : initialProduct;

  if (!mounted && !initialProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#faf8f5] text-xs text-stone-500">
        Cargando fórmula dermatológica...
      </div>
    );
  }

  if (!resolvedProduct) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#faf8f5]">
        <div className="max-w-md bg-white p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest">
            Fórmula no encontrada
          </span>
          <h1 className="font-serif text-3xl text-stone-900 font-light">
            Producto no disponible
          </h1>
          <p className="text-xs text-stone-500 font-light">
            El producto que buscas con identificador &ldquo;{slug}&rdquo; no existe o ha sido descontinuado de nuestro laboratorio.
          </p>
          <div className="pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Catálogo</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ProductView product={resolvedProduct} />;
}
