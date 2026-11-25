"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowLeft, 
  Truck, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { useOrderStore } from "@/store/use-order-store";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Datos del formulario
  const [formData, setFormData] = useState({
    email: "cliente@auraskinlab.com",
    firstName: "Valentina",
    lastName: "Herrera",
    address: "Calle 93 # 14-20, Apto 402",
    city: "Bogotá",
    country: "Colombia",
    postalCode: "110221",
    phone: "+57 310 456 7890",
    cardNumber: "4242 •••• •••• 4242",
    expDate: "12/28",
    cvc: "888",
    cardName: "Valentina Herrera"
  });

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 50 || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedId = "AURA-" + Math.floor(100000 + Math.random() * 900000);
      addOrder({
        id: generatedId,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        phone: formData.phone,
        shippingAddress: formData.address,
        city: formData.city,
        country: formData.country,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          category: item.product.category,
        })),
        subtotal,
        shippingCost,
        total,
        status: "paid",
        createdAt: new Date().toISOString(),
        paymentMethod: `Tarjeta •••• ${formData.cardNumber.slice(-4)}`,
      });
      setOrderId(generatedId);
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2200);
  };

  // Pantalla de Confirmación de Pedido
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#faf8f5] py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xl text-center space-y-6 animate-fade-in">
          
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest">
              ¡Pago Aprobado con Éxito!
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light mt-1">
              Gracias por tu Orden
            </h1>
            <p className="text-sm text-stone-500 font-light mt-2">
              Número de referencia de pedido: <strong className="text-stone-900 font-semibold font-mono">#{orderId}</strong>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 text-left space-y-3 text-xs text-stone-600 font-light">
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="font-medium text-stone-800">Destinatario:</span>
              <span>{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="font-medium text-stone-800">Dirección de Entrega:</span>
              <span>{formData.address}, {formData.city}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="font-medium text-stone-800">Tiempo estimado de llegada:</span>
              <span className="text-emerald-800 font-semibold">2 a 4 días hábiles</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-stone-800">Confirmación enviada a:</span>
              <span>{formData.email}</span>
            </div>
          </div>

          <p className="text-xs text-stone-500">
            Hemos reservado tus fórmulas en nuestro laboratorio. Recibirás tu guía de rastreo térmico en tu correo.
          </p>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-md"
            >
              <span>Volver a la Tienda Principal</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-200/80 mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Bolsa</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Lock className="w-3.5 h-3.5 text-emerald-800" />
            <span>Pasarela de Pago Segura (Modo Prueba Stripe)</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto space-y-4">
            <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto" />
            <h2 className="font-serif text-xl text-stone-900">No hay productos por pagar</h2>
            <Link
              href="/catalog"
              className="inline-block px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs uppercase font-semibold"
            >
              Ir al Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Formulario de Checkout (7 Columnas) */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
              
              {/* 1. Información de Contacto */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-2">
                  <span>1. Contacto del Destinatario</span>
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Correo Electrónico para el seguimiento</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Teléfono de Notificación</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Dirección de Envío */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-800" />
                  <span>2. Dirección de Entrega</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Apellidos</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Dirección Completa</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Ciudad</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Código Postal</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-stone-700 mb-1">País</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Información de Pago Seguro */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-800" />
                    <span>3. Método de Pago</span>
                  </h2>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded-full">
                    Tarjeta de Prueba Habilitada
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Vencimiento</label>
                      <input
                        type="text"
                        required
                        value={formData.expDate}
                        onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        required
                        value={formData.cvc}
                        onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Procesando Pago Seguro...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Confirmar y Pagar ${total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Resumen Lateral (5 Columnas) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-6">
              <h3 className="font-serif text-xl font-medium text-stone-900">
                Tu Pedido ({items.length} Fórmulas)
              </h3>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 py-2 border-b border-stone-100">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-xs font-medium text-stone-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-stone-400">Cant: {item.quantity}</p>
                      <span className="text-xs font-semibold text-stone-900 font-sans">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 font-sans">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío Exprés</span>
                  <span>{shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                  <span className="font-serif">Total</span>
                  <span className="text-xl font-sans">${total.toFixed(2)}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
