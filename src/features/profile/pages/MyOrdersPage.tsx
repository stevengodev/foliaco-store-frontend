import React from 'react';
import { Package, MapPin, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

// Mock de Pedidos del Usuario
const mockUserOrders = [
  {
    id: 'ORD-2026-003',
    date: '2026-08-28',
    total: 320.00,
    status: 'SHIPPED',
    itemCount: 2,
    shippingAddress: 'Av. Siempreviva 742, Springfield, EE.UU.',
    items: [
      { name: 'Smartphone XYZ Pro', quantity: 1, price: 299.00 },
      { name: 'Funda Protectora', quantity: 1, price: 21.00 }
    ]
  },
  {
    id: 'ORD-2026-001',
    date: '2026-08-20',
    total: 149.00,
    status: 'DELIVERED',
    itemCount: 1,
    shippingAddress: 'Av. Siempreviva 742, Springfield, EE.UU.',
    items: [
      { name: 'Reloj Inteligente Fit Pro', quantity: 1, price: 149.00 }
    ]
  }
];

export const MyOrdersPage: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Pendiente</span>;
      case 'PROCESSING':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">En Preparación</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Enviado</span>;
      case 'DELIVERED':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Entregado</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-text mb-2">Mis Pedidos</h1>
        <p className="text-brand-subtext">Revisa el historial y estado de tus compras.</p>
      </div>

      <div className="space-y-6">
        {mockUserOrders.map(order => (
          <div key={order.id} className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Cabecera del Pedido */}
            <div className="bg-brand-bg px-6 py-4 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <div>
                  <p className="text-xs text-brand-subtext uppercase font-bold tracking-wider mb-1">Pedido Realizado</p>
                  <p className="text-sm font-medium text-brand-text">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-subtext uppercase font-bold tracking-wider mb-1">Total</p>
                  <p className="text-sm font-medium text-brand-text">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-subtext uppercase font-bold tracking-wider mb-1">Enviar a</p>
                  <p className="text-sm font-medium text-brand-primary cursor-pointer hover:underline">
                    Ver dirección
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                <p className="text-xs text-brand-subtext uppercase font-bold tracking-wider">N° de Pedido: {order.id}</p>
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* Contenido del Pedido */}
            <div className="px-6 py-6">
              <div className="flex flex-col lg:flex-row gap-8 justify-between">
                
                {/* Lista de Items */}
                <div className="flex-1">
                  <h3 className="font-bold text-brand-text mb-4 text-lg">Artículos</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <Package className="text-gray-400" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-brand-text text-sm md:text-base">{item.name}</p>
                          <p className="text-sm text-brand-subtext">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="font-bold text-brand-text">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen / Detalles */}
                <div className="lg:w-1/3 space-y-6 lg:border-l lg:border-brand-border lg:pl-8">
                  <div>
                    <h3 className="font-bold text-brand-text mb-3 flex items-center gap-2">
                      <MapPin size={18} className="text-brand-subtext" />
                      Dirección de Envío
                    </h3>
                    <p className="text-sm text-brand-subtext">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-text mb-3 flex items-center gap-2">
                      <CreditCard size={18} className="text-brand-subtext" />
                      Pago
                    </h3>
                    <p className="text-sm text-brand-subtext">Pagado con Tarjeta</p>
                  </div>
                  
                  <Button className="w-full justify-center bg-white text-brand-text border border-brand-border hover:bg-brand-bg hover:text-brand-primary transition-colors">
                    Ver Factura
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
