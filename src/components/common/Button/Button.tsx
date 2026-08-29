import React from 'react';

// Props simplificados
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props
}: ButtonProps) {
  
  // Clases base que siempre tiene el botón
  let buttonClass = "px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ";
  
  // Agregamos colores dependiendo de la variante
  if (variant === 'primary') {
    buttonClass += "bg-brand-accent text-white hover:bg-brand-accent-hover ";
  } else if (variant === 'secondary') {
    buttonClass += "border border-brand-border bg-white text-brand-primary hover:bg-brand-bg ";
  } else if (variant === 'danger') {
    buttonClass += "bg-red-600 text-white hover:bg-red-700 ";
  }

  // Si está deshabilitado
  if (props.disabled) {
    buttonClass += "opacity-50 cursor-not-allowed ";
  }

  // Juntamos las clases con las que el usuario envíe por className
  buttonClass += className;

  return (
    <button 
      className={buttonClass}
      disabled={props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
