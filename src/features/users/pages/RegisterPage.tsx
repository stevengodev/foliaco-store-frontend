import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    
    // Simular llamada a la API
    setTimeout(() => {
      setIsLoading(false);
      alert('Registro exitoso (Simulado)');
    }, 1000);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-brand-text text-center mb-6">Crear Cuenta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Nombre" 
            name="firstName"
            placeholder="Juan"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input 
            label="Apellido" 
            name="lastName"
            placeholder="Pérez"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <Input 
          label="Correo Electrónico" 
          name="email"
          type="email" 
          placeholder="tu@correo.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input 
          label="Contraseña" 
          name="password"
          type="password" 
          placeholder="Mínimo 8 caracteres"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input 
          label="Confirmar Contraseña" 
          name="confirmPassword"
          type="password" 
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={error}
          required
        />
        
        <Button 
          type="submit" 
          className="w-full mt-4" 
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-subtext">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="font-medium text-brand-primary hover:text-brand-dark">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
};
