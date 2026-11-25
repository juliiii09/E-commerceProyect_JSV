"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  Sun, 
  Moon, 
  ShoppingBag, 
  Heart, 
  ChevronRight, 
  ChevronDown,
  Flame,
  Check
} from "lucide-react";
import { FEATURED_PRODUCTS, ProductItem } from "@/data/mock-products";
import { useCartStore } from "@/store/use-cart-store";
import { useProductStore } from "@/store/use-product-store";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { IngredientCompatibilityLab } from "@/components/ai/ingredient-compatibility-lab";

export default function Home() {
  const mounted = useHasMounted();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [activeConcern, setActiveConcern] = useState<number>(0);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { addItem } = useCartStore();
  const { products: storedProducts } = useProductStore();

  const showcaseProducts = mounted
    ? storedProducts.filter((p) => p.isVisible !== false && p.isFeatured)
    : FEATURED_PRODUCTS;

  const handleAddToCart = (product: ProductItem) => {
    addItem(product, 1);
    setAddedItem(product.name);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const concernsDemo = [
    {
      title: "Poros dilatados y exceso de brillo",
      skinType: "Piel Mixta / Grasa",
      recommendedActive: "Niacinamida 10% + Zinc PCA 1%",
      benefit: "Equilibra la producción sebácea y descongestiona la textura en 14 días.",
      product: FEATURED_PRODUCTS[1], // Niacinamide
      step: "Paso 2 • Tratamiento Activo"
    },
    {
      title: "Deshidratación, tirantez y líneas finas",
      skinType: "Piel Seca o Deshidratada",
      recommendedActive: "Ácido Hialurónico 4D + Vitamina B5",
      benefit: "Infundido con 4 pesos moleculares para hidratar desde la dermis superficial hasta la profunda.",
      product: FEATURED_PRODUCTS[2], // Hyaluronic
      step: "Paso 2 • Hidratación Profunda"
    },
    {
      title: "Rojeces, descamación y barrera irritada",
      skinType: "Piel Reactiva / Sensible",
      recommendedActive: "5 Ceramidas Bioidénticas + Centella",
      benefit: "Sella micro-fisuras celulares y devuelve el confort inmediato sin sensación grasa.",
      product: FEATURED_PRODUCTS[0], // Ceramide
      step: "Paso 3 • Restauración Lipídica"
    },
    {
      title: "Protección diaria contra fotodaño y manchas",
      skinType: "Todas las pieles",
      recommendedActive: "Óxido de Zinc No-Nano 12% + Ectoína",
      benefit: "Defensa invisible contra rayos UV y luz azul sin dejar capa blanquecina ni residuos.",
      product: FEATURED_PRODUCTS[3], // Sunscreen
      step: "Paso 4 • Fotoprotección Mineral"
    }
  ];

  const categories = ["Todos", "Serums", "Hidratantes", "Protección Solar", "Limpiadores"];

  const filteredProducts = selectedCategory === "Todos" 
    ? showcaseProducts 
    : showcaseProducts.filter(p => p.category === selectedCategory);

  const testimonials = [
    {
      name: "Dra. Valentina Montes",
      role: "Médica Especialista en Dermatología",
      quote: "Aura ha logrado lo que pocas marcas consiguen: balancear concentraciones de activos clínicos sin sacrificar la tolerancia dérmica. Recomiendo constantemente su crema de ceramidas.",
      rating: 5,
      skinProfile: "Recomendación Profesional"
    },
    {
      name: "Camila R.",
      role: "Compradora Verificada",
      quote: "El test de IA me recomendó la combinación exacta de Niacinamida y la crema de Ceramidas. En solo dos semanas mis poros lucen limpios y ya no tengo esa sensación tirante en las mejillas.",
      rating: 5,
      skinProfile: "Piel Mixta & Sensible • 28 años"
    },
    {
      name: "Sofía H.",
      role: "Compradora Verificada",
      quote: "Por fin un protector solar mineral que no me deja blanca como un fantasma ni me saca granitos. El acabado mate sedoso es perfecto para usar antes del maquillaje.",
      rating: 5,
      skinProfile: "Piel Grasa • 32 años"
    }
  ];

  const faqs = [
    {
      q: "¿Cómo funciona el asesor dermatológico con IA?",
      a: "Nuestro asesor analiza tu tipo de piel, nivel de sensibilidad y preocupaciones cutáneas específicas. Cruzamos esos datos con una matriz de compatibilidad bioquímica para sugerirte una rutina de mañana y noche con los activos exactos, previniendo mezclas que puedan irritar tu barrera."
    },
    {
      q: "¿Las fórmulas son aptas para pieles con rosácea o acné?",
      a: "Sí. Todas nuestras fórmulas son 100% no comedogénicas, sin fragancias sintéticas, alcoholes secantes ni aceites esenciales agresivos. Cada ingrediente es testeado en pieles hipersensibles con pH biocompatible 5.5."
    },
    {
      q: "¿Puedo combinar el Serum de Niacinamida con otros activos?",
      a: "Totalmente. Nuestra fórmula de Niacinamida 10% está tamponada con Zinc PCA y Alantoína, siendo compatible tanto con Ácido Hialurónico como con Ceramidas y Protectores Solares."
    },
    {
      q: "¿Cuánto tarda el envío y cuál es la política de devoluciones?",
      a: "El envío es gratuito en pedidos superiores a $50 y tarda entre 2 a 4 días hábiles. Si un producto no es compatible con tu piel, dispones de 30 días para una devolución o cambio sin costo alguno."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ========================================================
          1. HERO SECTION (Editorial, Minimalista & Sofisticada)
         ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-[#faf8f5]">
        
        {/* Glow de fondo decorativo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/40 via-amber-50/50 to-stone-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Texto Hero */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/5 border border-emerald-900/15 text-emerald-900 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-spin-slow" />
                <span>Formulación Clínica Limpia Guiada por IA</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-light tracking-tight text-stone-900 leading-[1.08]">
                La ciencia de tu piel, <br />
                <span className="italic font-normal text-emerald-900">personalizada</span> al miligramo.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Desarrollamos cosmética botánica con activos de alta pureza médica. Nuestro asesor inteligente diagnostica tus necesidades únicas y formula una rutina exacta y sinérgica en 60 segundos.
              </p>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/ai-consultant"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-stone-900 text-white font-medium text-sm hover:bg-emerald-950 transition-all shadow-md hover:shadow-lg group"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Crear mi Rutina con IA</span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/catalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full border border-stone-300 bg-white/70 backdrop-blur-sm text-stone-800 font-medium text-sm hover:bg-stone-50 transition-all hover:border-stone-400"
                >
                  Explorar Catálogo Clínico
                </Link>
              </div>

              {/* Métricas de Confianza */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">4.9★</div>
                  <div className="text-xs text-stone-500 mt-0.5">Satisfacción comprobada</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">100%</div>
                  <div className="text-xs text-stone-500 mt-0.5">Vegano & Clean</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">+14k</div>
                  <div className="text-xs text-stone-500 mt-0.5">Rutinas formuladas</div>
                </div>
              </div>

            </div>

            {/* Fotografía de Impacto con Tarjetas Flotantes */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 bg-stone-100">
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85"
                  alt="Serum botánico en cristal ámbar sobre mármol con luz matutina"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                  <div className="text-[11px] uppercase tracking-widest text-emerald-300 font-semibold mb-1">
                    Colección Esencial
                  </div>
                  <div className="font-serif text-lg font-medium leading-snug">
                    Fórmulas bio-compatibles sin fragancias sintéticas.
                  </div>
                </div>
              </div>

              {/* Tarjeta Flotante Superior: Diagnóstico con IA */}
              <div className="absolute -top-4 -left-4 sm:-left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/80 max-w-[240px] hidden sm:block">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="p-1 rounded-full bg-emerald-100 text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-stone-900">Diagnóstico Inteligente</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Compatibilidad dermatológica calculada según tu tipo de piel.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
                  <span>99.4% Precisión</span>
                  <span className="text-stone-400">Paso 1 de 3</span>
                </div>
              </div>

              {/* Tarjeta Flotante Inferior: Ingrediente Activo */}
              <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/80 max-w-[220px] hidden sm:block">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-bold text-stone-900 uppercase tracking-wider">Activo Médico</span>
                </div>
                <div className="font-serif text-sm font-semibold text-stone-900">
                  Niacinamida 10%
                </div>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Regula sebo & afina la textura en 14 días.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          2. ASESOR INTERACTIVO CON IA (Minimalista & Editorial)
         ======================================================== */}
      <section className="py-24 bg-[#f4f1ea] border-y border-stone-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3d5245] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Orientación Dermatológica IA</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight">
              ¿Cuál es tu prioridad cutánea hoy?
            </h2>
            <p className="mt-3 text-sm text-stone-500 font-light">
              Selecciona una necesidad para visualizar el activo específico y la fórmula recomendada por nuestro laboratorio.
            </p>
          </div>

          {/* Selector minimalista de Preocupaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {concernsDemo.map((item, index) => {
              const isSelected = activeConcern === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveConcern(index)}
                  className={`text-left p-5 rounded-2xl transition-all border ${
                    isSelected 
                      ? "bg-white border-stone-900 shadow-sm" 
                      : "bg-[#faf8f5]/70 border-stone-200/80 hover:bg-white hover:border-stone-300 text-stone-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                      0{index + 1}
                    </span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#2f3e33]" />}
                  </div>
                  <h4 className={`text-xs sm:text-sm leading-snug ${isSelected ? "font-medium text-stone-900" : "font-light text-stone-600"}`}>
                    {item.title}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Tarjeta Editorial Serena */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(28,25,23,0.04)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="md:col-span-4 relative aspect-square rounded-2xl overflow-hidden bg-[#faf8f5] border border-stone-200/60">
                <Image
                  src={concernsDemo[activeConcern].product.image}
                  alt={concernsDemo[activeConcern].product.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/90 text-stone-700 text-[10px] uppercase tracking-wider font-medium px-3 py-1 rounded-full backdrop-blur-sm border border-stone-200/70">
                  {concernsDemo[activeConcern].step}
                </span>
              </div>

              <div className="md:col-span-8 space-y-5">
                
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-stone-400">
                  <span className="text-[#3d5245] font-semibold">
                    {concernsDemo[activeConcern].skinType}
                  </span>
                  <span>·</span>
                  <span>Selección Clínica IA</span>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-stone-100">
                  <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light">
                    {concernsDemo[activeConcern].product.name}
                  </h3>
                  <span className="text-xl font-semibold font-sans text-stone-900">
                    ${concernsDemo[activeConcern].product.price.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#3d5245] uppercase tracking-[0.18em]">
                    Activo clave · {concernsDemo[activeConcern].recommendedActive}
                  </div>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    {concernsDemo[activeConcern].benefit}
                  </p>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleAddToCart(concernsDemo[activeConcern].product)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2f3e33] text-[#faf8f5] text-xs font-medium uppercase tracking-wider hover:bg-stone-900 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Añadir a la Bolsa</span>
                  </button>

                  <Link
                    href={`/product/${concernsDemo[activeConcern].product.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-stone-300 text-stone-800 text-xs font-medium uppercase tracking-wider hover:border-stone-900 transition-colors"
                  >
                    <span>Ver Fórmula</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/ai-consultant"
                    className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-normal py-2 sm:ml-auto transition-colors"
                  >
                    <span>Diagnóstico completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          3. CATÁLOGO DESTACADO (Best Sellers Clínicos)
         ======================================================== */}
      <section className="py-20 lg:py-28 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-900 mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Fórmulas de Culto
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light">
                Esenciales del Laboratorio
              </h2>
              <p className="text-stone-500 text-sm mt-1 max-w-md font-light">
                Tratamientos de alta pureza formulados sin agentes de relleno ni siliconas oclusivas.
              </p>
            </div>

            {/* Filtros por Categoría */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-stone-200/60 text-stone-700 hover:bg-stone-200 hover:text-stone-950"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group flex flex-col bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
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

                <div className="flex-1 flex flex-col">
                  
                  <div className="flex items-center gap-1.5 text-xs mb-1.5">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-stone-400 text-[11px]">({product.reviewsCount})</span>
                  </div>

                  <Link href={`/product/${product.slug}`} className="hover:text-emerald-900 transition-colors">
                    <h3 className="font-serif text-lg font-medium text-stone-900 leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 font-light">
                    {product.tagline}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.activeIngredients.slice(0, 2).map((ing, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>

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
                          <span>¡Añadido!</span>
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

          <div className="mt-14 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-900 hover:text-emerald-800 transition-colors border-b-2 border-stone-900 pb-0.5 hover:border-emerald-800"
            >
              <span>Ver Colección Completa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Simulador Bioquímico Interactivo con IA */}
      <IngredientCompatibilityLab />

      {/* ========================================================
          4. COMPARATIVA DE RUTINA (Día vs Noche)
         ======================================================== */}
      <section className="py-20 bg-[#f4f1ea] border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-widest text-emerald-900 uppercase">
              Sincronía Circadiana
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-2 font-light">
              El Ritmo Biológico de tu Piel
            </h2>
            <p className="text-sm text-stone-600 mt-2 font-light">
              La piel se defiende durante el día y se regenera durante la noche. Nuestras rutinas están diseñadas para apoyar ambos ciclos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Rutina de Mañana */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-900">Rutina Matutina</h3>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Objetivo: Defensa Antioxidante & Hidratación</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-stone-50">
                  <span className="text-xs font-bold text-stone-400 mt-0.5">01</span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-800">Limpieza Suave pH 5.5</h4>
                    <p className="text-xs text-stone-500">Elimina el exceso de lípidos nocturnos sin agredir.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-stone-50">
                  <span className="text-xs font-bold text-stone-400 mt-0.5">02</span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-800">Serum Hidratante + B5</h4>
                    <p className="text-xs text-stone-500">Retención de agua para evitar la sequedad por clima o aire acondicionado.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <span className="text-xs font-bold text-amber-700 mt-0.5">03</span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">Protección Mineral SPF 50+</h4>
                    <p className="text-xs text-stone-600">Escudo infrarrojo y UVA/UVB no negociable.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rutina de Noche */}
            <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 border border-stone-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-indigo-950 text-indigo-300">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-white">Rutina Nocturna</h3>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">Objetivo: Renovación Celular & Reparación</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-stone-800/80">
                  <span className="text-xs font-bold text-stone-500 mt-0.5">01</span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">Doble Limpieza</h4>
                    <p className="text-xs text-stone-400">Descompone fotoprotector y partículas de polución acumuladas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-stone-800/80">
                  <span className="text-xs font-bold text-stone-500 mt-0.5">02</span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">Activo Renovador (Niacinamida / Retinol)</h4>
                    <p className="text-xs text-stone-400">Estimula la biosíntesis de colágeno y el recambio epidérmico.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
                  <span className="text-xs font-bold text-emerald-400 mt-0.5">03</span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Crema con 5 Ceramidas Bioidénticas</h4>
                    <p className="text-xs text-stone-300">Sello reparador intensivo para despertar con la piel restaurada.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          5. TESTIMONIOS & SOCIAL PROOF
         ======================================================== */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-widest text-emerald-900 uppercase">
              Resultados Comprobados
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-2 font-light">
              La Voz de Nuestra Comunidad
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-400 gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="font-serif italic text-base text-stone-800 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100">
                  <div className="font-semibold text-sm text-stone-900">{t.name}</div>
                  <div className="text-xs text-emerald-800 font-medium">{t.role}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{t.skinProfile}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================
          6. PREGUNTAS FRECUENTES (FAQ Acordeón)
         ======================================================== */}
      <section className="py-20 bg-[#f4f1ea] border-t border-stone-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest text-emerald-900 uppercase">
              Dudas Comunes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-2 font-light">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-stone-50 transition-colors"
                  >
                    <span className="font-serif text-base font-medium text-stone-900">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-stone-600 font-light leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ========================================================
          7. BANNER FINAL CTA
         ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto rounded-[36px] bg-stone-900 text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden text-center shadow-2xl">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-semibold uppercase tracking-widest border border-emerald-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              Asesoría Gratuita & Rápida
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
              Descubre qué necesita tu piel en menos de 60 segundos.
            </h2>

            <p className="text-stone-400 text-sm sm:text-base font-light">
              Sin conjeturas ni compras innecesarias. Responde un breve cuestionario y deja que nuestro modelo determine la sinergia de activos óptima para tu rostro.
            </p>

            <div className="pt-2">
              <Link
                href="/ai-consultant"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-emerald-500 text-stone-950 font-semibold text-sm hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20 group"
              >
                <span>Comenzar Diagnóstico con IA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-[11px] text-stone-500">
              No requiere tarjeta ni registro previo • Recomendación instantánea
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
