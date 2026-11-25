"use client";

import React, { useMemo, useState } from "react";
import { Sparkles, Check, Plus } from "lucide-react";
import { PRODUCTS_CATALOG, ProductItem } from "@/data/mock-products";
import { useProductStore } from "@/store/use-product-store";
import { useCartStore } from "@/store/use-cart-store";
import { analyzeProductForSkin } from "@/lib/clinical-ai-engine";
import { useHasMounted } from "@/hooks/use-has-mounted";

const SKIN_OPTIONS: Array<"Mixta" | "Grasa" | "Seca" | "Sensible" | "Normal"> = [
  "Mixta",
  "Grasa",
  "Seca",
  "Sensible",
  "Normal",
];

export function ProductAiInsight({ product }: { product: ProductItem }) {
  const mounted = useHasMounted();
  const { products: storedProducts } = useProductStore();
  const { addItem } = useCartStore();

  const [selectedSkin, setSelectedSkin] = useState<
    "Mixta" | "Grasa" | "Seca" | "Sensible" | "Normal"
  >(product.skinTypes[0] || "Mixta");
  const [duoAdded, setDuoAdded] = useState(false);

  const catalog = mounted ? storedProducts : PRODUCTS_CATALOG;

  const insight = useMemo(
    () => analyzeProductForSkin(product, selectedSkin, catalog),
    [product, selectedSkin, catalog]
  );

  const handleAddSynergyDuo = () => {
    addItem(product, 1);
    if (insight.synergyPartner) {
      addItem(insight.synergyPartner, 1);
    }
    setDuoAdded(true);
    setTimeout(() => setDuoAdded(false), 2200);
  };

  return (
    <div className="rounded-2xl bg-[#f5f2ec]/90 border border-stone-200/80 p-5 sm:p-6 space-y-4">
      {/* Cabecera Editorial */}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#3d5245]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-600">
            Afinidad Dérmica IA
          </span>
        </div>
        <span className="font-serif text-lg italic text-[#2f3e33]">
          {insight.affinityScore}% afinidad
        </span>
      </div>

      {/* Selector minimalista de biotipo */}
      <div className="flex flex-wrap gap-1.5">
        {SKIN_OPTIONS.map((skin) => (
          <button
            key={skin}
            type="button"
            onClick={() => setSelectedSkin(skin)}
            className={`px-3 py-1 rounded-full text-[11px] transition-all border ${
              selectedSkin === skin
                ? "bg-[#2f3e33] text-[#faf8f5] border-[#2f3e33] font-medium"
                : "bg-white/70 text-stone-600 border-stone-200/90 hover:border-stone-400"
            }`}
          >
            {skin}
          </button>
        ))}
      </div>

      {/* Veredicto limpio */}
      <p className="text-xs text-stone-600 font-light leading-relaxed">
        <strong className="font-medium text-stone-900">
          {insight.statusLabel}.
        </strong>{" "}
        {insight.verdict}
      </p>

      {/* Orden de capas minimalista con divisores finos */}
      <div className="pt-3 border-t border-stone-200/70 space-y-1.5 text-[11px] text-stone-600 font-light">
        <div className="flex justify-between gap-4">
          <span className="text-stone-400 shrink-0">Aplicar después de</span>
          <span className="text-right text-stone-800">{insight.applyBefore}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-400 shrink-0">Sellar con</span>
          <span className="text-right text-stone-800">{insight.applyAfter}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-400 shrink-0">Nota bioquímica</span>
          <span className="text-right text-stone-700">{insight.avoidMixing}</span>
        </div>
      </div>

      {/* Pareja Sinérgica Discreta */}
      {insight.synergyPartner && (
        <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 block">
              Complemento ideal
            </span>
            <span className="font-serif text-base text-stone-900 truncate block">
              + {insight.synergyPartner.name}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddSynergyDuo}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-medium shrink-0 transition-all border ${
              duoAdded
                ? "bg-[#2f3e33] text-white border-[#2f3e33]"
                : "bg-white text-stone-800 border-stone-300 hover:border-stone-900"
            }`}
          >
            {duoAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Dúo en bolsa</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>
                  Sumar dúo ($
                  {(product.price + insight.synergyPartner.price).toFixed(2)})
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
