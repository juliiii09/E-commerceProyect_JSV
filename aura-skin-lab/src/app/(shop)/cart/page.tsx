"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Check,
  ChevronRight
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { CartSynergyAnalyzer } from "@/components/ai/cart-synergy-analyzer";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const rawSubtotal = getTotalPrice();
  const totalItems = getTotalItems();
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const discountedSubtotal = rawSubtotal - discountAmount;
  const shippingCost = rawSubtotal >= 50 || rawSubtotal === 0 ? 0 : 4.99;
  const finalTotal = discountedSubtotal + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();

    if (code === "AURA15") {
      setDiscountPercent(15);
      setPromoApplied(true);
    } else if (code === "AURA20") {
      setDiscountPercent(20);
      setPromoApplied(true);
    } else {
      setPromoError("Código no válido. Prueba usando 'AURA15'");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-stone-900">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-medium">Bolsa de Compras</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-stone-200/80 mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light">
              Tu Bolsa de Fórmulas
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {totalItems} {totalItems === 1 ? "producto seleccionado" : "productos seleccionados"}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-stone-400 hover:text-red-500 transition-colors underline"
            >
              Vaciar bolsa
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Estado Vacío */
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 p-8 max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl text-stone-900">Tu bolsa está vacía</h2>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Aún no has agregado fórmulas clínicas a tu régimen. Puedes explorar nuestro catálogo o realizar el test dermatológico con IA para una recomendación a la medida.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-sm"
              >
                Explorar Catálogo
              </Link>
              <Link
                href="/ai-consultant"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider hover:bg-stone-50 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Test con IA</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Carrito Lleno: 2 Columnas */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Lista de Productos (8 Columnas) */}
            <div className="lg:col-span-8 space-y-4">
              <CartSynergyAnalyzer />
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row gap-4 p-5 rounded-3xl bg-white border border-stone-200/80 shadow-sm"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
                            {item.product.category}
                          </span>
                          <Link href={`/product/${item.product.slug}`} className="hover:text-emerald-800 transition-colors block">
                            <h3 className="font-serif text-lg font-medium text-stone-900 mt-0.5">
                              {item.product.name}
                            </h3>
                          </Link>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-stone-500 mt-1 line-clamp-1 font-light">
                        {item.product.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                      {/* Control de cantidad */}
                      <div className="flex items-center border border-stone-300 rounded-full bg-white p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-stone-900 font-sans">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold font-sans text-stone-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="block text-[10px] text-stone-400">
                          ${item.product.price.toFixed(2)} c/u
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-emerald-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continuar Comprando</span>
                </Link>
              </div>
            </div>

            {/* Resumen del Pedido (4 Columnas) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-6">
              <h2 className="font-serif text-2xl font-light text-stone-900">
                Resumen del Pedido
              </h2>

              {/* Formulario de Cupón */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex items-center rounded-full border border-stone-300 p-1 bg-stone-50 focus-within:border-emerald-700">
                  <Tag className="w-4 h-4 text-stone-400 ml-3" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Código (ej: AURA15)"
                    className="w-full bg-transparent px-3 py-1.5 text-xs text-stone-800 uppercase focus:outline-none placeholder:normal-case"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    ¡Cupón {discountPercent}% aplicado con éxito!
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-red-600">{promoError}</p>
                )}
              </form>

              {/* Desglose de Costos */}
              <div className="space-y-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 font-sans">${rawSubtotal.toFixed(2)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Descuento ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Envío</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-800 font-semibold uppercase tracking-wider">Gratis</span>
                  ) : (
                    <span className="font-sans">${shippingCost.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Garantía de Satisfacción</span>
                  <span className="text-emerald-800 font-medium">Incluida (30 días)</span>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-between text-base font-semibold text-stone-900">
                  <span className="font-serif">Total Final</span>
                  <span className="font-sans text-xl">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Botón a Checkout */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-md group"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Sellos de Seguridad */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>Pago cifrado con seguridad bancaria SSL 256-bit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>Envío directo desde laboratorio con empaque térmico</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
