"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { CartSynergyAnalyzer } from "@/components/ai/cart-synergy-analyzer";

export const CartDrawer = () => {
  const pathname = usePathname();
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const isAdminRoute = pathname?.startsWith("/admin");

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const freeShippingThreshold = 50.0;
  const progressPercent = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);

  // Bloquear scroll del fondo cuando el drawer está abierto
  useEffect(() => {
    if (isOpen && !isAdminRoute) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isAdminRoute]);

  if (!isOpen || isAdminRoute) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf8f5] shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Header del Carrito */}
          <div className="p-6 border-b border-stone-200/80 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="font-serif text-xl font-medium text-stone-900">
                Tu Bolsa ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de progreso de envío gratis */}
          <div className="bg-emerald-900/5 px-6 py-3 border-b border-emerald-900/10 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-stone-700">
                Agrega <strong className="text-emerald-900 font-semibold">${remainingForFreeShipping.toFixed(2)}</strong> más para obtener <span className="font-semibold text-emerald-800">Envío Gratis</span>.
              </p>
            ) : (
              <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ¡Has desbloqueado Envío Gratis de cortesía!
              </p>
            )}
            <div className="w-full bg-stone-200/80 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl text-stone-800 mb-1">Tu bolsa está vacía</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6 font-light">
                  Descubre las fórmulas activas recomendadas para tu piel o explora nuestro catálogo clínico.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-all"
                >
                  Continuar Explorando
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-4 p-4 rounded-2xl bg-white border border-stone-200/70 shadow-sm"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0">
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
                        <h4 className="font-serif text-sm font-medium text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-400 font-light mt-0.5">
                        {item.product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Controles de cantidad */}
                      <div className="flex items-center border border-stone-200 rounded-full bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-stone-900"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2 text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:text-stone-900"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-sans font-semibold text-sm text-stone-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del Carrito con Subtotal y Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-stone-200/80 space-y-4">
              <CartSynergyAnalyzer compact />
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal Estimado</span>
                <span className="font-semibold text-stone-900 font-sans">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Impuestos & Envío</span>
                <span>Calculados en el siguiente paso</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-md group"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
