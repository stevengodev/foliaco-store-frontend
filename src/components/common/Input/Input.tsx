import React from 'react';

// Props simplificados
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ 
  label, 
  error,
  className = '',
  ...props
}: InputProps) {
  
  // Clases base para el campo de texto
  let inputClass = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text bg-white ";
  
  // Si hay error, ponemos el borde rojo
  if (error) {
    inputClass += "border-red-500 ";
  } else {
    inputClass += "border-brand-border ";
  }

  // Agregamos clases extra
  inputClass += className;

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Si pasamos un label, lo mostramos */}
      {label && (
        <label className="text-sm font-medium text-brand-text">
          {label}
        </label>
      )}
      
      {/* Campo de texto real */}
      <input
        className={inputClass}
        {...props}
      />
      
      {/* Si hay error, mostramos el mensaje */}
      {error && (
        <span className="text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
