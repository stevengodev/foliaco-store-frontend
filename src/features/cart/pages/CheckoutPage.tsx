import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { useCartStore } from '../store/cartStore';

export const CheckoutPage: React.FC = () => {
  const { getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simular llamada a API de pago
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6 text-green-500">
          <CheckCircle size={80} />
        </div>
        <h2 className="text-3xl font-bold text-brand-text mb-4">¡Pago Exitoso!</h2>
        <p className="text-brand-subtext mb-8">
          Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación en breve.
        </p>
        <Link to="/products">
          <Button variant="primary" className="px-8">
            Volver a la Tienda
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-8">
        <button onClick={() => navigate(-1)} className="text-brand-primary hover:text-brand-dark transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-brand-text">Finalizar Compra</h1>
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handlePayment} className="space-y-6">
          {/* Sección de Dirección de Envío */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2 border-b border-brand-border pb-4">
              <MapPin className="text-brand-subtext" />
              Dirección de Envío
            </h2>
            
            <div className="space-y-4">
              <Input 
                label="Dirección (Calle y número)" 
                placeholder="Ej. Av. Siempreviva 742" 
                required 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Ciudad" 
                  placeholder="Ej. Springfield" 
                  required 
                />
                <Input 
                  label="Estado/Provincia" 
                  placeholder="Ej. Estado Libre" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="País" 
                  placeholder="Ej. Estados Unidos" 
                  required 
                />
                <Input 
                  label="Código Postal" 
                  placeholder="Ej. 12345" 
                  required 
                />
              </div>

              <Input 
                label="Teléfono de Contacto" 
                placeholder="Ej. +1 555-1234" 
                required 
              />
            </div>
          </div>

          {/* Sección de Pago */}
          <div>
            <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2 border-b border-brand-border pb-4">
              <CreditCard className="text-brand-subtext" />
              Detalles de Pago Simulados
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Nombre en la Tarjeta" 
                  placeholder="Ej. Juan Pérez" 
                  required 
                />
                <Input 
                  label="Número de Tarjeta" 
                  placeholder="0000 0000 0000 0000" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-1">
                  <Input 
                    label="Mes" 
                    placeholder="MM" 
                    required 
                  />
                </div>
                <div className="col-span-1 md:col-span-1">
                  <Input 
                    label="Año" 
                    placeholder="AA" 
                    required 
                  />
                </div>
                <div className="col-span-2 md:col-span-2">
                  <Input 
                    label="CVC" 
                    placeholder="123" 
                    type="password"
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-border pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-brand-text">Total a Pagar:</span>
              <span className="text-2xl font-bold text-brand-primary">${getTotalPrice().toFixed(2)}</span>
            </div>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-full py-4 text-lg bg-brand-accent hover:bg-brand-accent-hover text-white"
              disabled={isProcessing || getTotalPrice() === 0}
            >
              {isProcessing ? 'Procesando Pago...' : `Pagar $${getTotalPrice().toFixed(2)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
