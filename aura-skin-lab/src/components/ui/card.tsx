import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};
