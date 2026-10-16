import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, MapPin, Smartphone, Landmark, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { useCartStore } from '../store/cartStore';
import { orderService, paymentService, cartService, type PaymentMethod } from '@/services';

export const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  // Datos de envío
  const [addressData, setAddressData] = useState({
    address: '',
    city: '',
    state: '',
    country: 'Colombia',
    postalCode: '',
    phone: '',
  });

  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');

  // Datos de tarjeta
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    const total = getTotalPrice();

    try {
      // 1. Crear dirección de envío en backend
      const addressResponse = await orderService.createAddress({
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        postalCode: addressData.postalCode,
        phone: addressData.phone,
      });

      // 2. Sincronizar items en el carrito del backend
      try {
        for (const item of items) {
          if (item.product?.id) {
            await cartService.addItem(item.product.id, item.quantity);
          }
        }
      } catch (cartErr) {
        console.warn('Nota: Sincronización de carrito backend:', cartErr);
      }

      // 3. Crear pedido en backend
      const orderResponse = await orderService.createOrder(addressResponse.id);
      const orderId = orderResponse.orderId;

      // 4. Procesar el pago con el método seleccionado
      await paymentService.processPayment({
        orderId,
        paymentMethod,
        amount: total,
      });

      setCreatedOrderId(orderId);
      clearCart();
    } catch (err: any) {
      console.error('Error during checkout:', err);
      // Fallback: Si el backend responde error de sesión (401) u otro, informar amigablemente
      const msg = err.response?.data?.message || err.message || 'Error al procesar el pedido';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (createdOrderId) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6 text-green-500">
          <CheckCircle size={80} />
        </div>
        <h2 className="text-3xl font-bold text-brand-text mb-2">¡Pago Exitoso!</h2>
        <p className="text-lg font-semibold text-brand-primary mb-2">
          Pedido #{createdOrderId}
        </p>
        <p className="text-brand-subtext mb-8">
          Tu pedido ha sido procesado correctamente y el pago ha sido confirmado. Recibirás un correo con el comprobante y seguimiento.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile/orders">
            <Button variant="secondary" className="px-8 w-full sm:w-auto">
              Ver Mis Pedidos
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="primary" className="px-8 w-full sm:w-auto">
              Seguir Comprando
            </Button>
          </Link>
        </div>
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

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle size={20} className="shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

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
                placeholder="Ej. Calle 100 #15-20" 
                name="address"
                value={addressData.address}
                onChange={handleAddressChange}
                required 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Ciudad" 
                  placeholder="Ej. Bogotá" 
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  required 
                />
                <Input 
                  label="Departamento / Estado" 
                  placeholder="Ej. Cundinamarca" 
                  name="state"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="País" 
                  placeholder="Ej. Colombia" 
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  required 
                />
                <Input 
                  label="Código Postal" 
                  placeholder="Ej. 110111" 
                  name="postalCode"
                  value={addressData.postalCode}
                  onChange={handleAddressChange}
                  required 
                />
              </div>

              <Input 
                label="Teléfono de Contacto" 
                placeholder="Ej. +57 300 123 4567" 
                name="phone"
                value={addressData.phone}
                onChange={handleAddressChange}
                required 
              />
            </div>
          </div>

          {/* Sección de Selección de Método de Pago */}
          <div>
            <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2 border-b border-brand-border pb-4">
              <CreditCard className="text-brand-subtext" />
              Método de Pago
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'CREDIT_CARD' 
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold shadow-sm'
                    : 'border-brand-border text-brand-subtext hover:bg-brand-bg'
                }`}
              >
                <CreditCard size={24} className="mb-1" />
                <span className="text-xs">Tarjeta de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NEQUI')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'NEQUI' 
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold shadow-sm'
                    : 'border-brand-border text-brand-subtext hover:bg-brand-bg'
                }`}
              >
                <Smartphone size={24} className="mb-1" />
                <span className="text-xs">Nequi</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('DAVIPLATA')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'DAVIPLATA' 
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold shadow-sm'
                    : 'border-brand-border text-brand-subtext hover:bg-brand-bg'
                }`}
              >
                <Smartphone size={24} className="mb-1" />
                <span className="text-xs">Daviplata</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('PSE')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'PSE' 
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold shadow-sm'
                    : 'border-brand-border text-brand-subtext hover:bg-brand-bg'
                }`}
              >
                <Landmark size={24} className="mb-1" />
                <span className="text-xs">PSE</span>
              </button>
            </div>

            {paymentMethod === 'CREDIT_CARD' && (
              <div className="space-y-4 bg-brand-bg/40 p-4 rounded-xl border border-brand-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Nombre en la Tarjeta" 
                    placeholder="Ej. Juan Pérez" 
                    name="cardName"
                    value={cardData.cardName}
                    onChange={handleCardChange}
                    required 
                  />
                  <Input 
                    label="Número de Tarjeta" 
                    placeholder="0000 0000 0000 0000" 
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-1 md:col-span-1">
                    <Input 
                      label="Mes" 
                      placeholder="MM" 
                      name="expMonth"
                      value={cardData.expMonth}
                      onChange={handleCardChange}
                      required 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <Input 
                      label="Año" 
                      placeholder="AA" 
                      name="expYear"
                      value={cardData.expYear}
                      onChange={handleCardChange}
                      required 
                    />
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <Input 
                      label="CVC" 
                      placeholder="123" 
                      type="password"
                      name="cvc"
                      value={cardData.cvc}
                      onChange={handleCardChange}
                      required 
                    />
                  </div>
                </div>
              </div>
            )}

            {(paymentMethod === 'NEQUI' || paymentMethod === 'DAVIPLATA') && (
              <div className="bg-brand-bg/40 p-4 rounded-xl border border-brand-border text-sm text-brand-subtext space-y-2">
                <p className="font-semibold text-brand-text">
                  Pago directo con {paymentMethod === 'NEQUI' ? 'Nequi' : 'Daviplata'}:
                </p>
                <p>Al hacer clic en pagar, se enviará una notificación a tu aplicación móvil con el número registrado en tus datos de envío.</p>
              </div>
            )}

            {paymentMethod === 'PSE' && (
              <div className="bg-brand-bg/40 p-4 rounded-xl border border-brand-border text-sm text-brand-subtext space-y-2">
                <p className="font-semibold text-brand-text">Pago con PSE (Transferencia Bancaria):</p>
                <p>Serás redirigido a la pasarela bancaria oficial para autorizar el débito en línea.</p>
              </div>
            )}
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
