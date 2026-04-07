import React from 'react';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-soft hover:shadow-lg',
  secondary: 'bg-surface-100 text-surface-900 hover:bg-surface-200',
  outline: 'border-2 border-surface-200 text-surface-700 hover:bg-surface-50 hover:text-surface-900',
  ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  white: 'bg-white text-brand-950 hover:bg-brand-50 shadow-xl',
  'brand-outline': 'border-2 border-brand-400/30 text-white hover:bg-brand-800/50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading, 
  disabled, 
  ...props 
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
