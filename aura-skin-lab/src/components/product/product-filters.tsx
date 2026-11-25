import React from 'react';

export const ProductFilters = () => {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-stone-900 text-white">Todos</button>
      <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200">Limpiadores</button>
      <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200">Serums</button>
      <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200">Hidratantes</button>
      <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200">Protección Solar</button>
    </div>
  );
};
