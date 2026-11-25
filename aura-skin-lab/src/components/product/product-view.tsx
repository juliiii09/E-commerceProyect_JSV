"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ShoppingBag,
  Leaf,
  Droplets,
  Check,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  EyeOff,
} from "lucide-react";
import { ProductItem, PRODUCTS_CATALOG } from "@/data/mock-products";
import { useCartStore } from "@/store/use-cart-store";
import { useProductStore } from "@/store/use-product-store";
import { ProductAiInsight } from "@/components/ai/product-ai-insight";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useRouter } from "next/navigation";

export const ProductView: React.FC<{ product: ProductItem }> = ({ product }) => {
  const mounted = useHasMounted();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"formula" | "usage" | "clean">(
    "formula"
  );
  const [added, setAdded] = useState(false);

  const { addItem } = useCartStore();
  const { products: storedProducts } = useProductStore();
  const router = useRouter();

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const activeImage =
    galleryImages[selectedImageIdx] || galleryImages[0] || product.image;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  const catalog = mounted ? storedProducts : PRODUCTS_CATALOG;
  const relatedProducts = catalog
    .filter((p) => p.id !== product.id && p.isVisible !== false)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Aviso si el producto está oculto (vista previa desde Admin) */}
        {product.isVisible === false && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-medium">
              <EyeOff className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Esta fórmula se encuentra actualmente <strong>Oculta / Borrador</strong> en la tienda pública. Solo es accesible mediante enlace directo o desde el Admin Panel.
              </span>
            </div>
            <Link
              href="/admin/products"
              className="px-3 py-1 rounded-full bg-amber-900 text-white text-[11px] font-semibold shrink-0"
            >
              Volver al Admin
            </Link>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-stone-900">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/catalog" className="hover:text-stone-900">
            Catálogo
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Sección Principal de Producto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Columna Izquierda: Galería Multi-Vista */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-md">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500"
                priority
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-stone-900/85 backdrop-blur-md text-stone-100 text-[11px] tracking-wider uppercase font-medium px-3 py-1.5 rounded-full">
                  {product.badge}
                </span>
              )}
              {galleryImages.length > 1 && (
                <span className="absolute bottom-4 right-4 bg-white/85 backdrop-blur-md text-stone-800 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-stone-200">
                  Vista {selectedImageIdx + 1} de {galleryImages.length}
                </span>
              )}
            </div>

            {/* Miniaturas de Vistas Configuradas en el Admin Panel */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all ${
                      selectedImageIdx === idx
                        ? "border-emerald-700 shadow-sm ring-2 ring-emerald-700/20"
                        : "border-stone-200/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} - vista ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Badges de Garantía Bioquímica */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white border border-stone-200/80 text-center">
                <Clock className="w-4 h-4 text-emerald-800 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-semibold text-stone-700 block">
                  {product.timeOfDay}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-stone-200/80 text-center">
                <Droplets className="w-4 h-4 text-emerald-800 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-semibold text-stone-700 block">
                  pH 5.5 Neutro
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-stone-200/80 text-center">
                <Leaf className="w-4 h-4 text-emerald-800 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-semibold text-stone-700 block">
                  100% Vegano
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Detalles, Compra & Copiloto IA */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-stone-400 font-normal">
                  {product.routineStep}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Reviews y Calificación */}
              <div className="mt-3 flex items-center gap-3 text-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="font-semibold text-stone-800">
                  {product.rating} / 5.0
                </span>
                <span className="text-stone-400">
                  ({product.reviewsCount} reseñas clínicas verificadas)
                </span>
              </div>
            </div>

            {/* Precio & Volumen */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-stone-200/80">
              <span className="text-3xl font-bold font-sans text-stone-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {product.volume}
              </span>
            </div>

            {/* Descripción */}
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              {product.description}
            </p>

            {/* Beneficios Comprobados */}
            <div className="space-y-2 p-4 rounded-2xl bg-stone-100/70 border border-stone-200/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Eficacia Comprobada:
              </h4>
              {product.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-stone-700"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Activos Destacados */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                Activos Clave en Concentración Eficaz:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.activeIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-900/15 px-3 py-1 rounded-full font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Controles de Compra */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-full bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold text-stone-900 font-sans">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md ${
                    added
                      ? "bg-emerald-700 text-white"
                      : "bg-stone-900 text-white hover:bg-emerald-950"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Añadido a la Bolsa!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Añadir a la Bolsa • $
                        {(product.price * quantity).toFixed(2)}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-full border border-stone-800 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition-all text-center"
              >
                Comprar Ahora con 1 Clic
              </button>
            </div>

            {/* MÓDULO NUEVO: Evaluación de Afinidad & Capas con IA */}
            <ProductAiInsight product={product} />

            {/* Pestañas de Información Técnica */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex border-b border-stone-200 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("formula")}
                  className={`pb-3 px-4 transition-colors ${
                    activeTab === "formula"
                      ? "border-b-2 border-stone-900 text-stone-900 font-bold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Fórmula & Bio-Compatibilidad
                </button>
                <button
                  onClick={() => setActiveTab("usage")}
                  className={`pb-3 px-4 transition-colors ${
                    activeTab === "usage"
                      ? "border-b-2 border-stone-900 text-stone-900 font-bold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Modo de Uso
                </button>
                <button
                  onClick={() => setActiveTab("clean")}
                  className={`pb-3 px-4 transition-colors ${
                    activeTab === "clean"
                      ? "border-b-2 border-stone-900 text-stone-900 font-bold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Compromiso Clean
                </button>
              </div>

              <div className="py-4 text-xs text-stone-600 font-light leading-relaxed">
                {activeTab === "formula" && (
                  <div className="space-y-2">
                    <p>
                      <strong>Textura:</strong> {product.texture}.
                    </p>
                    <p>
                      <strong>Compatibilidad de piel:</strong>{" "}
                      {product.skinTypes.join(", ")}.
                    </p>
                    <p>
                      <strong>Objetivos dérmicos:</strong>{" "}
                      {product.concerns.join(", ")}.
                    </p>
                  </div>
                )}
                {activeTab === "usage" && (
                  <div className="space-y-2">
                    <p>
                      <strong>Aplicación recomendada:</strong>{" "}
                      {product.howToUse}
                    </p>
                    <p>
                      <strong>Frecuencia:</strong> {product.timeOfDay}.
                    </p>
                  </div>
                )}
                {activeTab === "clean" && (
                  <div className="space-y-2">
                    <p>
                      Formulado rigurosamente sin parabenos, sulfatos agresivos
                      (SLS/SLES), aceites minerales, ftalatos ni fragancias
                      artificiales ocluyentes.
                    </p>
                    <p>
                      Envasado en vidrio reciclable con recubrimiento de
                      protección contra la radiación lumínica que preserva la
                      estabilidad de los activos biológicos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Sinergias Recomendadas */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-stone-200/80">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-semibold tracking-widest text-emerald-900 uppercase">
                Sinergia Biológica
              </span>
              <h2 className="font-serif text-3xl text-stone-900 mt-1 font-light">
                Fórmulas que Potencian este Tratamiento
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 mb-3">
                      <Image
                        src={rel.image}
                        alt={rel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
                      {rel.category}
                    </span>
                    <Link
                      href={`/product/${rel.slug}`}
                      className="hover:text-emerald-800 transition-colors block"
                    >
                      <h4 className="font-serif font-medium text-stone-900 text-base mt-1 line-clamp-1">
                        {rel.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-stone-500 mt-1 font-light line-clamp-2">
                      {rel.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-stone-900 font-sans">
                      ${rel.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addItem(rel, 1)}
                      className="text-xs bg-stone-900 text-white px-3.5 py-1.5 rounded-full hover:bg-stone-800 transition-colors"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
