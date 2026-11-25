"use client";

import React, { useMemo } from "react";
import { Sparkles, Plus } from "lucide-react";
import { PRODUCTS_CATALOG } from "@/data/mock-products";
import { useProductStore } from "@/store/use-product-store";
import { useCartStore } from "@/store/use-cart-store";
import { analyzeCartSynergy } from "@/lib/clinical-ai-engine";
import { useHasMounted } from "@/hooks/use-has-mounted";

export function CartSynergyAnalyzer({ compact = false }: { compact?: boolean }) {
  const mounted = useHasMounted();
  const { items, addItem } = useCartStore();
  const { products: storedProducts } = useProductStore();

  const catalog = mounted ? storedProducts : PRODUCTS_CATALOG;
  const cartProducts = useMemo(
    () => (mounted ? items.map((i) => i.product) : []),
    [mounted, items]
  );

  const report = useMemo(
    () => analyzeCartSynergy(cartProducts, catalog),
    [cartProducts, catalog]
  );

  if (!mounted || cartProducts.length === 0) return null;

  const steps = [
    { label: "Limpieza", done: report.coveredSteps.cleanse },
    { label: "Activos", done: report.coveredSteps.treat },
    { label: "Barrera", done: report.coveredSteps.moisturize },
    { label: "SPF", done: report.coveredSteps.protect },
  ];

  const primaryAlert = report.alerts[0];

  return (
    <div className="rounded-2xl bg-[#f5f2ec] border border-stone-200/80 p-4 space-y-3">
      {/* Cabecera Minimalista */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#3d5245]" />
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-stone-600">
            Armonía de Rutina
          </span>
        </div>
        <span className="font-serif text-base italic text-[#2f3e33]">
          {report.score}% compatible
        </span>
      </div>

      {/* Indicador lineal sutil de los 4 pasos */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map((s) => (
          <div key={s.label} className="space-y-1">
            <div
              className={`h-1 rounded-full transition-colors ${
                s.done ? "bg-[#3d5245]" : "bg-stone-300/60"
              }`}
            />
            <span
              className={`block text-[10px] ${
                s.done ? "text-stone-800 font-medium" : "text-stone-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Nota Clínica Serena */}
      {primaryAlert && (
        <p
          className={`text-[11px] font-light leading-relaxed ${
            primaryAlert.type === "warning"
              ? "text-[#7c5c34]"
              : "text-stone-600"
          }`}
        >
          <strong className="font-medium text-stone-800">
            {primaryAlert.title}:
          </strong>{" "}
          {primaryAlert.detail}
        </p>
      )}

      {/* Sugerencia sutil del paso faltante */}
      {!compact && report.missingSuggestion && (
        <div className="pt-2.5 border-t border-stone-200/70 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-stone-400 block">
              Sugerido para completar ({report.missingSuggestion.stepLabel})
            </span>
            <span className="font-serif text-sm text-stone-900 truncate block">
              {report.missingSuggestion.product.name} · $
              {report.missingSuggestion.product.price.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => addItem(report.missingSuggestion!.product, 1)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-stone-300 text-stone-800 text-[11px] font-medium hover:border-stone-800 transition-colors shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>Sumar</span>
          </button>
        </div>
      )}
    </div>
  );
}
