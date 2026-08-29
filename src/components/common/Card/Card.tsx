import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ title, subtitle, children, footer }: CardProps) {
  return (
    <div className="border border-brand-border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
      
      {/* Encabezado: Solo se muestra si pasamos un title o subtitle */}
      {(title || subtitle) && (
        <div className="p-5 border-b border-brand-border">
          {title && <h3 className="text-lg font-bold text-brand-text">{title}</h3>}
          {subtitle && <p className="text-sm text-brand-subtext">{subtitle}</p>}
        </div>
      )}

      {/* Contenido Principal */}
      <div className="p-5 flex-1">
        {children}
      </div>

      {/* Pie de tarjeta: Solo se muestra si pasamos un footer */}
      {footer && (
        <div className="p-5 bg-brand-bg border-t border-brand-border mt-auto">
          {footer}
        </div>
      )}
      
    </div>
  );
}
