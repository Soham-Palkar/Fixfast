import React from 'react';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div 
      className={`bg-white rounded-xl border border-surface-200 shadow-sm ${hover ? 'transition-all duration-300 hover:shadow-soft hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-5 border-b border-surface-100 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-surface-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 bg-surface-50 border-t border-surface-100 rounded-b-xl flex items-center ${className}`}>
      {children}
    </div>
  );
}
