import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, Truck, CheckCircle2, FileText, X } from 'lucide-react';
import { orderService, receiptService, type OrderResponse } from '@/services';
import { Button } from '@/components/common/Button/Button';

export const AdminOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal para generar remito
  const [receiptModalOrder, setReceiptModalOrder] = useState<OrderResponse | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleShip = async (orderId: number) => {
    try {
      const updated = await orderService.markAsShipped(orderId);
      setOrders(prev => prev.map(o => o.orderId === orderId ? updated : o));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al marcar como enviado.');
    }
  };

  const handleDeliver = async (orderId: number) => {
    try {
      const updated = await orderService.markAsDelivered(orderId);
      setOrders(prev => prev.map(o => o.orderId === orderId ? updated : o));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al marcar como entregado.');
    }
  };

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptModalOrder || !trackingInput) return;

    try {
      setIsSubmittingReceipt(true);
      await receiptService.createReceipt(receiptModalOrder.orderId, trackingInput);
      alert(`Remito generado con éxito para el pedido #${receiptModalOrder.orderId}`);
      setReceiptModalOrder(null);
      setTrackingInput('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al generar remito.');
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Pendiente</span>;
      case 'PAID':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">Pagado</span>;
      case 'PROCESSING':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">En Preparación</span>;
      case 'SHIPPED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Enviado</span>;
      case 'DELIVERED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Entregado</span>;
      case 'CANCELLED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelado</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      String(order.orderId).includes(searchTerm) || 
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrintOrder = (order: OrderResponse) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Reporte de Pedido #${order.orderId}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #FF6B00; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .section-title { font-weight: bold; font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
            th { background-color: #f9fafb; font-weight: 600; }
            .total { text-align: right; font-size: 18px; font-weight: bold; color: #FF6B00; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Foliaco Store</div>
            <div style="text-align: right;">
              <h2 style="margin:0;">Pedido #${order.orderId}</h2>
              <p style="margin:5px 0 0 0; color:#666;">Fecha: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p style="margin:5px 0 0 0; color:#666;">Estado: ${order.status}</p>
            </div>
          </div>
          
          <div class="details">
            <div>
              <div class="section-title">Datos del Cliente</div>
              <p style="margin: 4px 0;"><strong>Nombre:</strong> ${order.customerName || 'Cliente'}</p>
              <p style="margin: 4px 0;"><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
              <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${order.customerPhone || 'N/A'}</p>
            </div>
            <div>
              <div class="section-title">Dirección de Entrega</div>
              <p style="margin: 4px 0;"><strong>Dirección:</strong> ${order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}` : 'No especificada'}</p>
              <p style="margin: 4px 0;"><strong>País:</strong> ${order.shippingAddress?.country || 'Colombia'}</p>
            </div>
          </div>

          <div class="section-title">Productos</div>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items || []).map(item => `
                <tr>
                  <td>${item.productName || `Item #${item.productId}`}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.unitPrice || 0).toFixed(2)}</td>
                  <td>$${((item.subtotal || item.unitPrice * item.quantity) || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            Total a Pagar: $${(order.total || 0).toFixed(2)}
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Gestión de Pedidos</h1>
          <p className="text-sm text-brand-subtext mt-1">Supervisa, despacha y genera remitos de entrega para las compras.</p>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-t-xl border border-brand-border border-b-0 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-brand-subtext" />
          </div>
          <input 
            type="text"
            className="pl-10 w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-brand-text"
            placeholder="Buscar por ID de pedido o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-brand-subtext" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-text"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="PAID">Pagados</option>
            <option value="SHIPPED">Enviados</option>
            <option value="DELIVERED">Entregados</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                ID Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-subtext">
                  Cargando pedidos...
                </td>
              </tr>
            ) : filteredOrders.map((order) => {
              const dateStr = order.createdAt 
                ? new Date(order.createdAt).toLocaleDateString()
                : 'Hoy';

              return (
                <tr key={order.orderId} className="hover:bg-brand-bg transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-text">
                    #{order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                    {dateStr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text">
                    <div>{order.customerName || 'Cliente'}</div>
                    {order.customerEmail && (
                      <div className="text-xs text-brand-subtext">{order.customerEmail}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-primary">
                    ${(order.total || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === 'PAID' && (
                        <button
                          onClick={() => handleShip(order.orderId)}
                          className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                          title="Marcar como enviado"
                        >
                          <Truck size={14} />
                          Despachar
                        </button>
                      )}

                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => handleDeliver(order.orderId)}
                          className="flex items-center gap-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                          title="Marcar como entregado"
                        >
                          <CheckCircle2 size={14} />
                          Entregar
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setReceiptModalOrder(order);
                          setTrackingInput(`TRK-${order.orderId}-${Date.now().toString().slice(-4)}`);
                        }}
                        className="flex items-center gap-1 text-xs bg-brand-bg text-brand-primary hover:bg-brand-border px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                        title="Generar remito para despacho"
                      >
                        <FileText size={14} />
                        Remito
                      </button>

                      <button 
                        onClick={() => handlePrintOrder(order)}
                        className="text-brand-subtext hover:text-brand-primary p-1.5 rounded-lg transition-colors"
                        title="Imprimir reporte"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {!isLoading && filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Generar Remito */}
      {receiptModalOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-brand-border w-full max-w-md p-6 relative">
            <button 
              onClick={() => setReceiptModalOrder(null)}
              className="absolute top-4 right-4 text-brand-subtext hover:text-brand-text"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-brand-text mb-2">Generar Remito de Despacho</h3>
            <p className="text-sm text-brand-subtext mb-4">
              Asigna un número de guía o seguimiento para el pedido #{receiptModalOrder.orderId}.
            </p>

            <form onSubmit={handleCreateReceipt} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  Número de Guía / Tracking <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Ej: TRK-987654321"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setReceiptModalOrder(null)}
                  className="px-4 py-2 text-sm text-brand-subtext border border-brand-border rounded-lg hover:bg-brand-bg transition-colors"
                >
                  Cancelar
                </button>
                <Button type="submit" disabled={isSubmittingReceipt}>
                  {isSubmittingReceipt ? 'Generando...' : 'Crear Remito'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
