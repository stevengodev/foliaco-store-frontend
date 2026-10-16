import React, { useState, useEffect } from 'react';
import { Package, MapPin, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button/Button';
import { orderService, type OrderResponse } from '@/services/orderService';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Pendiente</span>;
      case 'PAID':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">Pagado</span>;
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
        <p className="text-brand-subtext">Revisa el historial y estado de tus compras en tiempo real.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-brand-subtext">
          <p className="text-lg">Cargando tus pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-brand-border rounded-2xl shadow-sm">
          <ShoppingBag size={64} className="mx-auto text-brand-subtext opacity-40 mb-4" />
          <h2 className="text-2xl font-bold text-brand-text mb-2">No tienes pedidos aún</h2>
          <p className="text-brand-subtext mb-6">Cuando realices compras en la tienda, aparecerán listadas aquí.</p>
          <Link to="/products">
            <Button variant="primary" className="px-8">
              Explorar Catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const dateFormatted = order.createdAt 
              ? new Date(order.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Reciente';

            const addressText = order.shippingAddress 
              ? `${order.shippingAddress.address}, ${order.shippingAddress.city}`
              : 'Dirección registrada';

            return (
              <div key={order.orderId} className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Cabecera del Pedido */}
                <div className="bg-brand-bg px-6 py-4 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-xs text-brand-subtext uppercase font-bold tracking-wider mb-1">Fecha</p>
                      <p className="text-sm font-medium text-brand-text">{dateFormatted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-subtext uppercase font-bold tracking-wider mb-1">Total</p>
                      <p className="text-sm font-bold text-brand-primary">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-subtext uppercase font-bold tracking-wider mb-1">Destino</p>
                      <p className="text-sm font-medium text-brand-text truncate max-w-xs">{addressText}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <p className="text-xs text-brand-subtext uppercase font-bold tracking-wider">Orden #{order.orderId}</p>
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
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-brand-bg rounded-lg border border-brand-border flex items-center justify-center flex-shrink-0 text-brand-primary">
                                <Package size={24} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-brand-text text-sm md:text-base truncate">{item.productName || `Producto #${item.productId}`}</p>
                                <p className="text-sm text-brand-subtext">Cantidad: {item.quantity}</p>
                              </div>
                              <div className="font-bold text-brand-text">
                                ${(item.subtotal || item.unitPrice * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-brand-subtext">Detalles de artículos disponibles en comprobante.</p>
                        )}
                      </div>
                    </div>

                    {/* Resumen / Detalles */}
                    <div className="lg:w-1/3 space-y-6 lg:border-l lg:border-brand-border lg:pl-8">
                      <div>
                        <h3 className="font-bold text-brand-text mb-2 flex items-center gap-2">
                          <MapPin size={18} className="text-brand-subtext" />
                          Dirección de Envío
                        </h3>
                        <p className="text-sm text-brand-subtext">{addressText}</p>
                        {order.shippingAddress?.phone && (
                          <p className="text-xs text-brand-subtext mt-1">Tel: {order.shippingAddress.phone}</p>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-brand-text mb-2 flex items-center gap-2">
                          <CreditCard size={18} className="text-brand-subtext" />
                          Estado de Pago
                        </h3>
                        <p className="text-sm text-brand-subtext">
                          {order.status === 'PENDING' ? 'Pago Pendiente' : 'Confirmado y Autorizado'}
                        </p>
                      </div>
                      
                      <Link to={`/admin/orders`}>
                        <Button variant="secondary" className="w-full justify-center">
                          Ver Seguimiento
                          <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
