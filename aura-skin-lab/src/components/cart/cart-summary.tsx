import React from 'react';

export const CartSummary: React.FC<{ subtotal: number; onCheckout?: () => void }> = ({ subtotal, onCheckout }) => {
  return (
    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80">
      <h3 className="font-serif font-bold text-base mb-4">Resumen del Pedido</h3>
      <div className="flex justify-between text-sm mb-2 text-stone-600">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mb-4 text-stone-600">
        <span>Envío</span>
        <span className="text-emerald-700 font-medium">Gratis</span>
      </div>
      <div className="border-t pt-4 flex justify-between font-bold text-base text-stone-900">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <button
        onClick={onCheckout}
        className="w-full mt-6 bg-stone-900 text-white py-3 rounded-full text-sm font-medium hover:bg-stone-800 transition-all"
      >
        Proceder al Pago
      </button>
    </div>
  );
};
