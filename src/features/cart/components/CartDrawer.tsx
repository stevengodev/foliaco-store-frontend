import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Button } from '@/components/common/Button/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brand-primary" size={24} />
            <h2 className="text-lg font-bold text-brand-text">Tu Carrito</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-brand-subtext hover:bg-brand-bg rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-brand-subtext space-y-4">
              <ShoppingBag size={64} className="opacity-20" />
              <p>Tu carrito está vacío.</p>
              <Button onClick={onClose} variant="secondary" className="mt-4">
                Seguir comprando
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const product = item.product || {} as any;
              return (
                <div key={product.id || Math.random()} className="flex gap-4 p-3 border border-brand-border rounded-xl bg-white shadow-sm z-[60]">
                  {/* Image */}
                  <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border border-brand-border bg-brand-bg">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/80?text=Sin+Imagen'}
                      alt={product.name || 'Producto Desconocido'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-brand-text line-clamp-2">
                          {product.name || 'Producto no disponible'}
                        </h3>
                        <button 
                          onClick={() => removeItem(product.id)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-brand-primary mt-1">
                        ${(product.price || 0).toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-bg text-brand-text hover:bg-brand-border transition-colors"
                        onClick={() => updateQuantity(product.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button 
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-bg text-brand-text hover:bg-brand-border transition-colors"
                        onClick={() => updateQuantity(product.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-brand-border bg-brand-bg/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-subtext font-medium">Subtotal</span>
              <span className="text-xl font-bold text-brand-text">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                className="w-full bg-brand-primary hover:bg-brand-dark"
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
              >
                Ir a Pagar
              </Button>
              <button 
                onClick={clearCart}
                className="text-sm font-medium text-brand-subtext hover:text-brand-text underline transition-colors mt-2"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
