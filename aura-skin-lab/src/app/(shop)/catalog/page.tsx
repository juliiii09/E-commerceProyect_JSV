"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  ArrowRight,
  SlidersHorizontal,
  Check
} from "lucide-react";
import { PRODUCTS_CATALOG, ProductItem } from "@/data/mock-products";
import { useCartStore } from "@/store/use-cart-store";
import { useProductStore } from "@/store/use-product-store";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { matchProductsBySymptom } from "@/lib/clinical-ai-engine";

export default function CatalogPage() {
  const mounted = useHasMounted();
  const [searchTerm, setSearchTerm] = useState("");
  const [symptomQuery, setSymptomQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSkinType, setSelectedSkinType] = useState("Todas");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const { addItem } = useCartStore();
  const { products: storedProducts } = useProductStore();

  const catalogProducts = useMemo(
    () =>
      (mounted ? storedProducts : PRODUCTS_CATALOG).filter(
        (p) => p.isVisible !== false
      ),
    [mounted, storedProducts]
  );

  const aiSymptomMatches = useMemo(
    () => matchProductsBySymptom(symptomQuery, catalogProducts),
    [symptomQuery, catalogProducts]
  );

  const categories = ["Todos", "Limpiadores", "Serums", "Hidratantes", "Protección Solar"];
  const skinTypes = ["Todas", "Grasa", "Mixta", "Seca", "Sensible", "Normal"];

  const handleAddToCart = (product: ProductItem) => {
    addItem(product, 1);
    setAddedItem(product.name);
    setTimeout(() => setAddedItem(null), 2000);
  };

  // Filtrado y ordenamiento reactivo
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      // Filtro de búsqueda por nombre, descripción o activo
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.activeIngredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro por categoría
      const matchesCategory = 
        selectedCategory === "Todos" || product.category === selectedCategory;

      // Filtro por tipo de piel
      const matchesSkinType = 
        selectedSkinType === "Todas" ||
        product.skinTypes.includes(selectedSkinType as ProductItem["skinTypes"][number]);

      return matchesSearch && matchesCategory && matchesSkinType;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured/default
    });
  }, [catalogProducts, searchTerm, selectedCategory, selectedSkinType, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todos");
    setSelectedSkinType("Todas");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera del Catálogo */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-200/80 gap-6">
          <div>
            <span className="text-xs font-semibold tracking-widest text-emerald-900 uppercase">
              Colección Clínica Completa
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-stone-900 mt-2">
              Fórmulas Dermatológicas
            </h1>
            <p className="text-stone-500 text-sm mt-1 max-w-lg font-light">
              Desarrolladas con pureza botánica y concentraciones respaldadas por evidencia clínica.
            </p>
          </div>

          {/* Banner sutil de ayuda con IA */}
          <Link
            href="/ai-consultant"
            className="inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#f4f1ea] border border-stone-200/90 text-stone-800 text-xs hover:border-stone-400 transition-all group shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#3d5245] shrink-0" />
            <div>
              <div className="font-medium text-stone-900 flex items-center gap-1">
                <span>¿Dudas con tu elección?</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-stone-500 font-light">Diagnóstico guiado en 60 segundos</p>
            </div>
          </Link>
        </div>

        {/* MÓDULO IA EN CATÁLOGO: Minimalista & Luminoso */}
        <div className="mt-8 p-5 sm:px-7 sm:py-6 rounded-2xl bg-white border border-stone-200/80 space-y-4 shadow-[0_4px_20px_rgba(28,25,23,0.03)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#3d5245] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Búsqueda por Necesidad Cutánea</span>
              </div>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Describe cómo sientes tu piel y te sugeriremos las formulaciones más afines.
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={symptomQuery}
                onChange={(e) => setSymptomQuery(e.target.value)}
                placeholder="Ej. piel mixta con poros visibles y rojeces..."
                className="w-full pl-4 pr-9 py-2.5 rounded-full bg-[#faf8f5] border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#3d5245]"
              />
              {symptomQuery && (
                <button
                  type="button"
                  onClick={() => setSymptomQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-stone-400 mr-1">Sugerencias:</span>
            {[
              "Poros abiertos y brillo",
              "Tirantez y rojeces",
              "Líneas finas y manchas",
              "Protector solar ligero",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setSymptomQuery(chip)}
                className={`px-3 py-1 rounded-full text-[11px] border transition-colors ${
                  symptomQuery === chip
                    ? "bg-[#2f3e33] text-[#faf8f5] border-[#2f3e33]"
                    : "bg-[#faf8f5] border-stone-200/80 text-stone-600 hover:border-stone-400"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {symptomQuery.trim() && (
            <div className="pt-4 border-t border-stone-100">
              {aiSymptomMatches.length === 0 ? (
                <p className="text-xs text-stone-400 font-light">
                  Prueba con términos como poros, acné, sequedad, rojeces, líneas de expresión o manchas.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiSymptomMatches.map(({ product, score, aiReason }) => (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200/70 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200/50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <Link
                              href={`/product/${product.slug}`}
                              className="font-serif text-base text-stone-900 hover:text-[#2f3e33] truncate"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[10px] italic font-serif text-[#3d5245] shrink-0">
                              {score}% afinidad
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 font-light line-clamp-1 mt-0.5">
                            {aiReason}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-stone-300 text-stone-800 text-[11px] font-medium hover:border-stone-900 shrink-0 transition-colors"
                      >
                        + ${product.price.toFixed(0)}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Barra de Filtros & Búsqueda */}
        <div className="py-8 space-y-6">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Input de Búsqueda */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por activo (Niacinamida, Hialurónico) o fórmula..."
                className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-stone-200/80 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Ordenar por */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-stone-500" />
              <span className="text-xs text-stone-500 font-medium">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "featured" | "price-asc" | "price-desc" | "rating"
                  )
                }
                className="px-3.5 py-2.5 rounded-full bg-white border border-stone-200/80 text-xs text-stone-800 focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
              </select>
            </div>

          </div>

          {/* Categorías Principales */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 font-medium mr-2">Categoría:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-white border border-stone-200/80 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tipo de Piel */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 font-medium mr-2">Tipo de piel:</span>
            {skinTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedSkinType(type)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  selectedSkinType === type
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-emerald-50/60 border border-emerald-900/10 text-emerald-900 hover:bg-emerald-100/60"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

        </div>

        {/* Contador de resultados */}
        <div className="mb-6 flex justify-between items-center text-xs text-stone-500">
          <span>Mostrando {filteredProducts.length} fórmulas</span>
          {(searchTerm || selectedCategory !== "Todos" || selectedSkinType !== "Todas") && (
            <button
              onClick={clearAllFilters}
              className="text-emerald-800 hover:text-emerald-950 font-semibold underline"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {/* ========================================================
            GRID DE PRODUCTOS
           ======================================================== */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-stone-900">
              No encontramos productos que coincidan
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-light">
              Intenta buscar con otros términos como &ldquo;Niacinamida&rdquo;, &ldquo;Crema&rdquo; o limpia los filtros activos.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800"
            >
              Limpiar Todos los Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group flex flex-col bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Imagen del Producto */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-sm text-stone-100 text-[10px] tracking-wider uppercase font-medium px-2.5 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}

                  <button 
                    aria-label="Guardar favorito"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-stone-700 hover:text-red-500 hover:bg-white transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info del Producto */}
                <div className="flex-1 flex flex-col">
                  
                  {/* Calificación & Categoría */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-stone-400 text-[11px]">({product.reviewsCount})</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                      {product.category}
                    </span>
                  </div>

                  <Link href={`/product/${product.slug}`} className="hover:text-emerald-900 transition-colors">
                    <h3 className="font-serif text-lg font-medium text-stone-900 leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 font-light">
                    {product.tagline}
                  </p>

                  {/* Activos principales */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.activeIngredients.slice(0, 2).map((ing, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>

                  {/* Precio y Botón de Añadir */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-semibold text-stone-900 font-sans">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="block text-[10px] text-stone-400">
                        {product.volume}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all shadow-sm ${
                        addedItem === product.name
                          ? "bg-emerald-700 text-white"
                          : "bg-stone-900 text-white hover:bg-emerald-950"
                      }`}
                    >
                      {addedItem === product.name ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Listo!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Añadir</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
