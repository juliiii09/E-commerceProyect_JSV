import React from 'react';

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, className = '', ...props }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 ${className}`} {...props}>
      {children}
    </span>
  );
};
