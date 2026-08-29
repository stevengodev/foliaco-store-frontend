import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular llamada a la API
    setTimeout(() => {
      setIsLoading(false);
      alert('Login exitoso (Simulado)');
    }, 1000);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-brand-text text-center mb-6">Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Correo Electrónico" 
          type="email" 
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input 
          label="Contraseña" 
          type="password" 
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-brand-subtext">
            <input type="checkbox" className="rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
            Recordarme
          </label>
          <a href="#" className="font-medium text-brand-primary hover:text-brand-dark">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-2" 
          disabled={isLoading || !email || !password}
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-subtext">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="font-medium text-brand-primary hover:text-brand-dark">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};
