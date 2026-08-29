import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { useCartStore } from '../store/cartStore';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6 text-gray-300">
          <ShoppingBag size={80} />
        </div>
        <h2 className="text-3xl font-bold text-brand-text mb-4">Tu carrito está vacío</h2>
        <p className="text-brand-subtext mb-8">Parece que aún no has agregado ningún producto. ¡Explora nuestro catálogo!</p>
        <Link to="/products">
          <Button variant="primary" className="px-8">
            Ir de Compras
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/products" className="text-brand-primary hover:text-brand-dark transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-brand-text">Carrito de Compras</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lista de Productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product;
            const mainImage = product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/100';

            return (
              <div key={product.id} className="bg-white border border-brand-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-brand-text truncate">{product.name}</h3>
                  <p className="text-sm text-brand-subtext mb-2">SKU: {product.sku}</p>
                  <p className="text-brand-primary font-bold">${product.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  
                  {/* Selector de cantidad */}
                  <div className="flex items-center border border-brand-border rounded-lg bg-brand-bg">
                    <button 
                      onClick={() => updateQuantity(product.id, item.quantity - 1)}
                      className="p-2 text-brand-subtext hover:text-brand-primary hover:bg-gray-100 rounded-l-lg transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-medium text-brand-text">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(product.id, item.quantity + 1)}
                      className="p-2 text-brand-subtext hover:text-brand-primary hover:bg-gray-100 rounded-r-lg transition-colors"
                      disabled={item.quantity >= product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Eliminar */}
                  <button 
                    onClick={() => removeItem(product.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 size={20} />
                  </button>
                  
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de Compra */}
        <div className="lg:col-span-1">
          <div className="bg-brand-bg border border-brand-border rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-brand-text mb-6">Resumen del Pedido</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-brand-subtext">
                <span>Productos ({getTotalItems()})</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-subtext">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="border-t border-brand-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-brand-text">Total</span>
                  <span className="text-2xl font-bold text-brand-primary">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full py-4 text-lg"
              onClick={handleCheckout}
            >
              Proceder al Pago
            </Button>

            <div className="mt-4 text-center">
              <Link to="/products" className="text-sm text-brand-primary hover:underline">
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
