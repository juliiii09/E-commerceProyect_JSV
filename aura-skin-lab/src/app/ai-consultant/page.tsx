"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ShoppingBag, 
  RotateCcw
} from "lucide-react";
import { PRODUCTS_CATALOG, ProductItem } from "@/data/mock-products";
import { useCartStore } from "@/store/use-cart-store";
import { useProductStore } from "@/store/use-product-store";
import { useHasMounted } from "@/hooks/use-has-mounted";

export default function AiConsultantPage() {
  const mounted = useHasMounted();
  const { products: storedProducts } = useProductStore();
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisText, setAnalysisText] = useState<string>("Sincronizando con modelo dermatológico...");
  
  // Respuestas del usuario
  const [skinType, setSkinType] = useState<string>("Mixta");
  const [mainConcern, setMainConcern] = useState<string>("poros");
  const [sensitivity, setSensitivity] = useState<string>("Media");
  const [preferredTexture, setPreferredTexture] = useState<string>("Ligera");

  // Rutina recomendada calculada
  const [recommendation, setRecommendation] = useState<{
    summary: string;
    morningRoutine: { stepNumber: number; role: string; product: ProductItem; reason: string }[];
    nightRoutine: { stepNumber: number; role: string; product: ProductItem; reason: string }[];
    clinicalTip: string;
    routineProducts: ProductItem[];
  } | null>(null);

  const [routineAdded, setRoutineAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisText("Analizando biotipo dérmico y factores de hidratación...");

    setTimeout(() => {
      setAnalysisText("Evaluando compatibilidad de activos (Niacinamida, Hialurónico, Ceramidas)...");
    }, 1100);

    setTimeout(() => {
      setAnalysisText("Descartando mezclas irritantes y formulando sinergia circadiana...");
    }, 2200);

    setTimeout(() => {
      // Generar la recomendación médica basada en el catálogo real
      generateRoutine();
      setIsAnalyzing(false);
      setStep(5); // Pantalla de resultados
    }, 3200);
  };

  const generateRoutine = () => {
    const activePool = (mounted ? storedProducts : PRODUCTS_CATALOG).filter(
      (p) => p.isVisible !== false && p.aiRecommended !== false
    );
    const pool = activePool.length >= 3 ? activePool : PRODUCTS_CATALOG;

    const findBest = (
      category: ProductItem["category"],
      concernTarget?: string,
      fallbackTime?: string
    ): ProductItem => {
      const candidates = pool.filter((p) => p.category === category);
      if (candidates.length === 0) return pool[0];

      const scored = candidates
        .map((p) => {
          let score = 0;
          if (concernTarget && p.concerns.includes(concernTarget as ProductItem["concerns"][number])) score += 3;
          if (p.skinTypes.includes(skinType as ProductItem["skinTypes"][number])) score += 2;
          if (fallbackTime && p.timeOfDay === fallbackTime) score += 1;
          return { p, score };
        })
        .sort((a, b) => b.score - a.score);

      return scored[0].p;
    };

    const cleanser = findBest("Limpiadores", mainConcern);
    const sunscreen = findBest("Protección Solar", mainConcern);
    const morningSerum = findBest("Serums", mainConcern === "antiedad" ? "deshidratación" : mainConcern, "Día y Noche");
    const nightTreatment =
      pool.find(
        (p) =>
          p.id !== morningSerum.id &&
          p.concerns.includes(mainConcern as ProductItem["concerns"][number]) &&
          (p.category === "Serums" || p.timeOfDay === "Solo Noche")
      ) || findBest("Serums", mainConcern, "Solo Noche");
    const cream = findBest("Hidratantes", mainConcern);

    const morningSteps = [
      {
        stepNumber: 1,
        role: "Limpieza Fisiológica",
        product: cleanser,
        reason: "Limpia residuos nocturnos sin agredir el manto ácido graso de la piel."
      },
      {
        stepNumber: 2,
        role: "Hidratación & Regulación",
        product: morningSerum,
        reason: "Activos en concentración clínica para reforzar la reserva de agua celular durante el día."
      },
      {
        stepNumber: 3,
        role: "Escudo Mineral Diurno",
        product: sunscreen,
        reason: "Fotoprotección 100% física contra radiación ultravioleta y luz azul sin obstruir los poros."
      }
    ];

    const nightSteps = [
      {
        stepNumber: 1,
        role: "Purificación Nocturna",
        product: cleanser,
        reason: "Disuelve partículas de polución ambiental y el protector mineral acumulado durante la jornada."
      },
      {
        stepNumber: 2,
        role: "Tratamiento Activo Intensivo",
        product: nightTreatment,
        reason: "Aprovecha la fase circadiana de máxima regeneración epidérmica para corregir imperfecciones y textura."
      },
      {
        stepNumber: 3,
        role: "Sellado de Barrera Lipídica",
        product: cream,
        reason: "Complejo de 5 ceramidas bioidénticas para sellar los activos y prevenir la deshidratación nocturna."
      }
    ];

    // Array de productos únicos para añadir al carrito
    const uniqueProducts = Array.from(new Set([cleanser, morningSerum, sunscreen, nightTreatment, cream]));

    setRecommendation({
      summary: `Biotipo identificado como Piel ${skinType} con necesidad prioritaria en control de ${mainConcern} y reactividad ${sensitivity}. Tu barrera cutánea requiere activos calmantes sinérgicos sin oclusivos pesados.`,
      morningRoutine: morningSteps,
      nightRoutine: nightSteps,
      clinicalTip: sensitivity === "Alta" 
        ? "Dado tu nivel de sensibilidad dérmica, introduce cualquier nuevo activo espaciando su aplicación cada 48 horas durante la primera semana."
        : "Asegúrate de aplicar el serum sobre la piel ligeramente húmeda para maximizar la absorción de sus activos higroscópicos.",
      routineProducts: uniqueProducts
    });
  };

  const handleAddFullRoutine = () => {
    if (!recommendation) return;
    recommendation.routineProducts.forEach(product => {
      addItem(product, 1);
    });
    setRoutineAdded(true);
    openCart();
    setTimeout(() => setRoutineAdded(false), 3000);
  };

  const resetQuiz = () => {
    setStep(1);
    setRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera del Asesor */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 text-stone-600 text-[10px] font-medium tracking-[0.2em] uppercase mb-4">
            <Sparkles className="w-3 h-3 text-[#3d5245]" />
            <span>Diagnóstico Dermatológico · IA</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-stone-900 leading-tight">
            Descubre tu Rutina Sinérgica
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-500 font-light">
            Responde 4 preguntas breves para que nuestro algoritmo clínico formule tu protocolo exacto de mañana y noche.
          </p>
        </div>

        {/* Barra de Progreso del Cuestionario */}
        {step < 5 && !isAnalyzing && (
          <div className="mb-10 max-w-md mx-auto">
            <div className="flex justify-between text-[11px] text-stone-500 font-normal tracking-wide mb-2">
              <span>Paso {step} de 4</span>
              <span>{step === 1 ? "Biotipo" : step === 2 ? "Preocupación" : step === 3 ? "Sensibilidad" : "Textura"}</span>
            </div>
            <div className="w-full bg-stone-200/70 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-[#2f3e33] h-full rounded-full transition-all duration-300" 
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            ESTADO DE CARGA / ANÁLISIS DE IA
           ======================================================== */}
        {isAnalyzing && (
          <div className="bg-white rounded-3xl p-12 border border-stone-200/80 shadow-sm text-center max-w-xl mx-auto my-12 space-y-6">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-stone-200 border-t-[#2f3e33] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#3d5245] animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-light">
                Sintetizando tu diagnóstico...
              </h3>
              <p className="text-sm text-stone-500 mt-2 font-light animate-fade-in">
                {analysisText}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f2ec] text-stone-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3d5245]" />
              <span>Algoritmo de Compatibilidad Bioquímica</span>
            </div>
          </div>
        )}

        {/* ========================================================
            PASOS DEL CUESTIONARIO
           ======================================================== */}
        {!isAnalyzing && step === 1 && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="font-serif text-2xl text-stone-900 font-light text-center">
              1. ¿Cómo describirías el comportamiento de tu piel?
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {[
                { type: "Mixta", desc: "Brillo y poros visibles en la zona T (frente, nariz, barbilla), con mejillas normales o secas." },
                { type: "Grasa", desc: "Tendencia al brillo generalizado, poros dilatados y propensión a puntos negros o brotes." },
                { type: "Seca", desc: "Sensación constante de tirantez, textura áspera o descamación ocasional sin brillo." },
                { type: "Sensible", desc: "Reactiva al frío, viento o productos cosméticos habituales con rojez inmediata." },
                { type: "Normal", desc: "Equilibrada, sin exceso de grasa notable ni deshidratación marcada." },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSkinType(item.type)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    skinType === item.type 
                      ? "border-[#2f3e33] bg-[#f5f2ec]/80" 
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{item.type}</h4>
                    <p className="text-xs text-stone-500 mt-0.5 font-light">{item.desc}</p>
                  </div>
                  {skinType === item.type && <Check className="w-4 h-4 text-[#2f3e33] shrink-0 ml-2" />}
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-md"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {!isAnalyzing && step === 2 && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="font-serif text-2xl text-stone-900 font-light text-center">
              2. ¿Cuál es tu objetivo o preocupación principal?
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {[
                { id: "poros", title: "Poros dilatados y exceso de sebo", desc: "Equilibrar textura irregular y regular brillo excesivo." },
                { id: "deshidratación", title: "Deshidratación profunda y falta de luminosidad", desc: "Restaurar volumen hídrico y elasticidad." },
                { id: "antiedad", title: "Líneas de expresión y firmeza", desc: "Estimular síntesis de colágeno y renovación celular." },
                { id: "acné", title: "Puntos negros, imperfecciones y marcas", desc: "Descongestionar el canal del poro y unificar tono." },
                { id: "rojeces", title: "Rojeces, tirantez o barrera comprometida", desc: "Reparación intensiva de lípidos protectores." },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMainConcern(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    mainConcern === item.id 
                      ? "border-[#2f3e33] bg-[#f5f2ec]/80" 
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5 font-light">{item.desc}</p>
                  </div>
                  {mainConcern === item.id && <Check className="w-4 h-4 text-[#2f3e33] shrink-0 ml-2" />}
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider hover:bg-stone-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-md"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {!isAnalyzing && step === 3 && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="font-serif text-2xl text-stone-900 font-light text-center">
              3. ¿Qué tan reactiva es tu piel ante productos nuevos?
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {[
                { level: "Baja", title: "Resistente y tolerante", desc: "Rara vez experimento ardor, rojez o irritación con cosméticos." },
                { level: "Media", title: "Moderadamente sensible", desc: "Puedo experimentar rojez ocasional con exfoliantes fuertes o cambios de temperatura." },
                { level: "Alta", title: "Hipersensible o reactiva", desc: "Se enrojece con facilidad, picor frecuente o diagnóstico previo de rosácea/dermatitis." },
              ].map((item) => (
                <button
                  key={item.level}
                  onClick={() => setSensitivity(item.level)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    sensitivity === item.level 
                      ? "border-[#2f3e33] bg-[#f5f2ec]/80" 
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5 font-light">{item.desc}</p>
                  </div>
                  {sensitivity === item.level && <Check className="w-4 h-4 text-[#2f3e33] shrink-0 ml-2" />}
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider hover:bg-stone-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-md"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {!isAnalyzing && step === 4 && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="font-serif text-2xl text-stone-900 font-light text-center">
              4. ¿Qué tipo de textura prefieres en tu rostro?
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {[
                { id: "Ligera", title: "Fluidos ultra ligeros & acabado mate", desc: "Sensación de piel desnuda sin peso ni residuos." },
                { id: "Nutritiva", title: "Cremas sedosas y reconfortantes", desc: "Sensación de nutrición envolvente y confort prolongado." },
                { id: "Equilibrada", title: "Geles crema frescos y acuosos", desc: "Hidratación equilibrada de absorción rápida." },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPreferredTexture(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    preferredTexture === item.id 
                      ? "border-[#2f3e33] bg-[#f5f2ec]/80" 
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5 font-light">{item.desc}</p>
                  </div>
                  {preferredTexture === item.id && <Check className="w-4 h-4 text-[#2f3e33] shrink-0 ml-2" />}
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider hover:bg-stone-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
              <button
                onClick={handleStartAnalysis}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2f3e33] text-[#faf8f5] text-xs font-medium uppercase tracking-wider hover:bg-stone-900 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Formular mi Rutina</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            PASO 5: RECOMENDACIÓN FINAL DE LA IA (Minimalista & Luminosa)
           ======================================================== */}
        {!isAnalyzing && step === 5 && recommendation && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Tarjeta Editorial de Diagnóstico */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-[0_8px_30px_rgba(28,25,23,0.04)] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="inline-flex items-center gap-2 text-[11px] text-[#3d5245] font-semibold uppercase tracking-[0.2em]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Diagnóstico Clínico Personalizado</span>
                </div>

                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir test</span>
                </button>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light">
                Tu Protocolo Bio-Compatible
              </h2>

              <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-3xl">
                {recommendation.summary}
              </p>

              {/* Nota dermatológica serena */}
              <div className="p-4 rounded-2xl bg-[#f5f2ec] border border-stone-200/70 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#3d5245] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider">
                    Nota del Especialista
                  </span>
                  <p className="text-xs text-stone-600 mt-0.5 font-light leading-relaxed">
                    {recommendation.clinicalTip}
                  </p>
                </div>
              </div>

              {/* Botón Maestro Minimalista */}
              <div className="pt-2">
                <button
                  onClick={handleAddFullRoutine}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                    routineAdded
                      ? "bg-[#3d5245] text-white"
                      : "bg-stone-900 text-[#faf8f5] hover:bg-[#2f3e33]"
                  }`}
                >
                  {routineAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Rutina añadida a tu bolsa</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Añadir rutina completa ({recommendation.routineProducts.length} fórmulas)
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Rutina de Mañana Desglosada */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-900">
                    Protocolo de Mañana
                  </h3>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">
                    Defensa Antioxidante • Hidratación • Fotoprotección SPF 50+
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendation.morningRoutine.map((step) => (
                  <div key={step.stepNumber} className="flex flex-col justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div>
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-2 uppercase tracking-wider">
                        <span>Paso 0{step.stepNumber}</span>
                        <span className="text-[10px] text-stone-400 font-normal">{step.role}</span>
                      </div>

                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3">
                        <Image
                          src={step.product.image}
                          alt={step.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <Link href={`/product/${step.product.slug}`} className="hover:text-emerald-800 transition-colors">
                        <h4 className="font-serif font-medium text-stone-900 text-base leading-snug">
                          {step.product.name}
                        </h4>
                      </Link>

                      <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed">
                        {step.reason}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="font-semibold text-sm text-stone-900">${step.product.price.toFixed(2)}</span>
                      <button
                        onClick={() => addItem(step.product, 1)}
                        className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-full hover:bg-stone-800 transition-colors"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rutina de Noche Desglosada */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-900">
                    Protocolo de Noche
                  </h3>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">
                    Doble Limpieza • Renovación Epidérmica • Sellado Lipídico
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendation.nightRoutine.map((step) => (
                  <div key={step.stepNumber} className="flex flex-col justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div>
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-2 uppercase tracking-wider">
                        <span>Paso 0{step.stepNumber}</span>
                        <span className="text-[10px] text-stone-400 font-normal">{step.role}</span>
                      </div>

                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3">
                        <Image
                          src={step.product.image}
                          alt={step.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <Link href={`/product/${step.product.slug}`} className="hover:text-emerald-800 transition-colors">
                        <h4 className="font-serif font-medium text-stone-900 text-base leading-snug">
                          {step.product.name}
                        </h4>
                      </Link>

                      <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed">
                        {step.reason}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="font-semibold text-sm text-stone-900">${step.product.price.toFixed(2)}</span>
                      <button
                        onClick={() => addItem(step.product, 1)}
                        className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-full hover:bg-stone-800 transition-colors"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
