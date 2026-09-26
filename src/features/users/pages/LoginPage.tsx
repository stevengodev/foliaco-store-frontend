import React from 'react';
import { Button } from '@/components/common/Button/Button';
import { authService } from '@/services/authService';

export const LoginPage: React.FC = () => {

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-brand-text text-center mb-6">Iniciar Sesión</h2>
      
      <p className="text-brand-subtext text-center mb-8">
        Accede a tu cuenta de Foliaco Store para gestionar tus pedidos.
      </p>

      <Button 
        onClick={handleGoogleLogin} 
        variant="primary"
        className="w-full max-w-sm flex items-center justify-center gap-2 py-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
        </svg>
        Continuar con Google
      </Button>

    </div>
  );
};
