import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-surface-700">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 outline-none  
          ${error 
            ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-surface-200 bg-surface-50 text-surface-900 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
          }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
