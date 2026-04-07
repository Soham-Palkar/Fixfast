import React from 'react';

const variants = {
  primary: 'bg-brand-100 text-brand-700',
  secondary: 'bg-surface-100 text-surface-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-700',
};

export default function Badge({ children, variant = 'primary', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
