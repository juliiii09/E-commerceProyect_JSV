import React from 'react';
import { CartItem as CartItemType } from '@/types/cart';

export const CartItem: React.FC<{ item: CartItemType }> = ({ item }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-stone-100">
      <div>
        <h4 className="text-sm font-medium text-stone-800">{item.product.name}</h4>
        <p className="text-xs text-stone-500">${item.product.price.toFixed(2)} x {item.quantity}</p>
      </div>
      <span className="font-semibold text-sm">${(item.product.price * item.quantity).toFixed(2)}</span>
    </div>
  );
};
