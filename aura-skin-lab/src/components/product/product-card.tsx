import React from 'react';
import { Product } from '@/types/product';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="group rounded-2xl border border-stone-200/80 bg-white p-4 transition-all hover:shadow-md">
      <div className="aspect-square bg-stone-100 rounded-xl mb-3 flex items-center justify-center text-stone-400 text-xs">
        [Imagen: {product.name}]
      </div>
      <h3 className="font-serif font-semibold text-stone-800 text-sm group-hover:text-emerald-700">
        {product.name}
      </h3>
      <p className="text-xs text-stone-500 mt-1 line-clamp-2">{product.tagline}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="font-medium text-stone-900">${product.price.toFixed(2)}</span>
        <button className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-full hover:bg-stone-800">
          Añadir
        </button>
      </div>
    </div>
  );
};
