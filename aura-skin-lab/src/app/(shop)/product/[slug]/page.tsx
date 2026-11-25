import React from "react";
import { PRODUCTS_CATALOG } from "@/data/mock-products";
import { ProductSlugResolver } from "@/components/product/product-slug-resolver";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const staticProduct = PRODUCTS_CATALOG.find((p) => p.slug === slug);

  return <ProductSlugResolver slug={slug} initialProduct={staticProduct} />;
}
