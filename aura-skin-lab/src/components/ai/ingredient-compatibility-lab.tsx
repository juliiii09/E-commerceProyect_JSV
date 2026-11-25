"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Plus, Check } from "lucide-react";
import { PRODUCTS_CATALOG, ProductItem } from "@/data/mock-products";
import { useProductStore } from "@/store/use-product-store";
import { useCartStore } from "@/store/use-cart-store";
import { useHasMounted } from "@/hooks/use-has-mounted";

const ACTIVES = [
  { id: "niacinamide", label: "Niacinamida 10%", keyword: "niacinamid" },
  { id: "retinol", label: "Retinol 0.3%", keyword: "retinol" },
  { id: "salicylic", label: "Ácido Salicílico 2%", keyword: "salic" },
  { id: "hyaluronic", label: "Ácido Hialurónico 4D", keyword: "hialur" },
  { id: "ceramides", label: "Ceramidas + Centella", keyword: "ceramid" },
  { id: "spf", label: "Óxido de Zinc SPF 50+", keyword: "zinc" },
] as const;

type ActiveId = (typeof ACTIVES)[number]["id"];

export function IngredientCompatibilityLab() {
  const mounted = useHasMounted();
  const { products: storedProducts } = useProductStore();
  const { addItem } = useCartStore();

  const [activeA, setActiveA] = useState<ActiveId>("retinol");
  const [activeB, setActiveB] = useState<ActiveId>("ceramides");
  const [addedId, setAddedId] = useState<string | null>(null);

  const catalog = useMemo(
    () =>
      (mounted ? storedProducts : PRODUCTS_CATALOG).filter(
        (p) => p.isVisible !== false
      ),
    [mounted, storedProducts]
  );

  const evaluation = useMemo(() => {
    const pair = new Set([activeA, activeB]);

    if (activeA === activeB) {
      return {
        tone: "caution" as const,
        tag: "Mismo activo seleccionado",
        title: "Evita duplicar la misma concentración",
        explanation:
          "Superponer dos fórmulas con idéntico activo principal no multiplica su eficacia. Selecciona un segundo ingrediente complementario para evaluar su sinergia.",
        protocol: "Sugerencia: combina un activo renovador con uno hidratante o reparador.",
      };
    }

    if (pair.has("retinol") && pair.has("salicylic")) {
      return {
        tone: "caution" as const,
        tag: "Uso en noches alternas",
        title: "Retinol y BHA requieren espaciar su aplicación",
        explanation:
          "Ambos estimulan la renovación del estrato córneo en distintos rangos de pH. Aplicarlos en la misma sesión puede sensibilizar la barrera cutánea.",
        protocol:
          "Protocolo recomendado: alterna una noche de Ácido Salicílico y la siguiente de Retinol, sellando siempre con ceramidas.",
      };
    }

    if (pair.has("retinol") && pair.has("ceramides")) {
      return {
        tone: "harmony" as const,
        tag: "Sinergia óptima · 99%",
        title: "Renovación celular con barrera protegida",
        explanation:
          "Las ceramidas bioidénticas reponen la matriz lipídica y neutralizan la sequedad asociada al retinol, ofreciendo firmeza sin irritación.",
        protocol:
          "Protocolo recomendado: aplica el Retinol sobre piel seca y sella tres minutos después con la crema de Ceramidas.",
      };
    }

    if (pair.has("niacinamide") && pair.has("salicylic")) {
      return {
        tone: "harmony" as const,
        tag: "Sinergia equilibrante · 97%",
        title: "Control de poros y descongestión profunda",
        explanation:
          "El Ácido Salicílico limpia el canal folicular mientras la Niacinamida equilibra la producción sebácea y calma la piel.",
        protocol:
          "Protocolo recomendado: aplica primero el exfoliante BHA y continúa con 3 gotas de Niacinamida 10%.",
      };
    }

    if (pair.has("spf")) {
      return {
        tone: "harmony" as const,
        tag: "Defensa diurna esencial",
        title: "Estabilidad y protección frente al fotodaño",
        explanation:
          "El filtro mineral de Óxido de Zinc resguarda los resultados de tus activos de tratamiento frente a la radiación UVA/UVB.",
        protocol:
          "Protocolo recomendado: finaliza tu rutina de mañana con dos líneas generosas de SPF 50+.",
      };
    }

    return {
      tone: "harmony" as const,
      tag: "100% biocompatible",
      title: "Equilibrio de pH e hidratación multicapa",
      explanation:
        "Ambos ingredientes actúan en perfecta armonía fisiológica, fortaleciendo la luminosidad y elasticidad sin saturar la piel.",
      protocol:
        "Protocolo recomendado: aplica de la textura más ligera y acuosa hacia la emulsión más nutritiva.",
    };
  }, [activeA, activeB]);

  const matchingProducts = useMemo(() => {
    const metaA = ACTIVES.find((a) => a.id === activeA);
    const metaB = ACTIVES.find((a) => a.id === activeB);
    const results: ProductItem[] = [];

    for (const meta of [metaA, metaB]) {
      if (!meta) continue;
      const found = catalog.find((p) =>
        [p.name, ...p.activeIngredients]
          .join(" ")
          .toLowerCase()
          .includes(meta.keyword)
      );
      if (found && !results.some((r) => r.id === found.id)) {
        results.push(found);
      }
    }
    return results;
  }, [activeA, activeB, catalog]);

  const handleQuickAdd = (product: ProductItem) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="py-24 bg-[#faf8f5] border-t border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-[#3d5245] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guía de Formulación IA</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light">
            Compatibilidad de Activos
          </h2>
          <p className="text-sm text-stone-500 mt-2 font-light">
            Selecciona dos ingredientes para consultar al instante su afinidad bioquímica y orden de aplicación.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-[0_8px_30px_rgba(28,25,23,0.04)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Selección Minimalista */}
          <div className="lg:col-span-5 p-7 sm:p-10 bg-[#f6f4ef]/70 border-b lg:border-b-0 lg:border-r border-stone-200/70 space-y-7">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold mb-3">
                01 · Primer ingrediente
              </span>
              <div className="flex flex-wrap gap-2">
                {ACTIVES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveA(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all border ${
                      activeA === item.id
                        ? "bg-stone-900 text-[#faf8f5] border-stone-900 font-medium"
                        : "bg-white text-stone-600 border-stone-200/90 hover:border-stone-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200/70">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold mb-3">
                02 · Segundo ingrediente
              </span>
              <div className="flex flex-wrap gap-2">
                {ACTIVES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveB(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all border ${
                      activeB === item.id
                        ? "bg-[#2f3e33] text-[#faf8f5] border-[#2f3e33] font-medium"
                        : "bg-white text-stone-600 border-stone-200/90 hover:border-stone-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resultado Editorial */}
          <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span
                className={`inline-block text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded-full border ${
                  evaluation.tone === "harmony"
                    ? "bg-[#eef2ee] text-[#2f3e33] border-[#d6e0d7]"
                    : "bg-[#f8f3eb] text-[#7c5c34] border-[#e8dcc8]"
                }`}
              >
                {evaluation.tag}
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light leading-snug">
                {evaluation.title}
              </h3>

              <p className="text-sm text-stone-600 font-light leading-relaxed">
                {evaluation.explanation}
              </p>

              <p className="text-xs text-[#2f3e33] bg-[#f6f4ef] px-4 py-3 rounded-xl border border-stone-200/60 font-light">
                {evaluation.protocol}
              </p>
            </div>

            {matchingProducts.length > 0 && (
              <div className="pt-6 border-t border-stone-100 space-y-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold block">
                  Fórmulas relacionadas
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-2.5 rounded-2xl bg-[#faf8f5] border border-stone-200/70 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200/50">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/product/${prod.slug}`}
                            className="font-serif text-sm text-stone-900 hover:text-[#2f3e33] truncate block"
                          >
                            {prod.name}
                          </Link>
                          <span className="text-[11px] text-stone-500">
                            ${prod.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(prod)}
                        className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-700 hover:border-stone-900 hover:text-stone-900 flex items-center justify-center shrink-0 transition-colors"
                        aria-label="Añadir"
                      >
                        {addedId === prod.id ? (
                          <Check className="w-3.5 h-3.5 text-[#2f3e33]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
