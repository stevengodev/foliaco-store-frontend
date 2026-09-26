import React, { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';

// Mock de Pedidos
const mockOrders = [
  { 
    id: 'ORD-2026-001', date: '2026-08-29', customer: 'Juan Pérez', email: 'juan@ejemplo.com', phone: '+54 11 1234-5678',
    total: 149.00, status: 'PENDING',
    items: [
      { name: 'Producto A', quantity: 2, price: 50.00 },
      { name: 'Producto B', quantity: 1, price: 49.00 }
    ]
  },
  { 
    id: 'ORD-2026-002', date: '2026-08-29', customer: 'María Gómez', email: 'maria@ejemplo.com', phone: '+54 11 8765-4321',
    total: 89.50, status: 'PROCESSING',
    items: [
      { name: 'Producto C', quantity: 1, price: 89.50 }
    ]
  },
  { 
    id: 'ORD-2026-003', date: '2026-08-28', customer: 'Carlos López', email: 'carlos@ejemplo.com', phone: '+54 11 5555-5555',
    total: 320.00, status: 'SHIPPED',
    items: [
      { name: 'Producto D', quantity: 4, price: 80.00 }
    ]
  },
  { 
    id: 'ORD-2026-004', date: '2026-08-27', customer: 'Ana Torres', email: 'ana@ejemplo.com', phone: '+54 11 9999-9999',
    total: 45.00, status: 'DELIVERED',
    items: [
      { name: 'Producto E', quantity: 3, price: 15.00 }
    ]
  },
  { 
    id: 'ORD-2026-005', date: '2026-08-27', customer: 'Luis Martínez', email: 'luis@ejemplo.com', phone: '+54 11 1111-1111',
    total: 110.00, status: 'CANCELLED',
    items: [
      { name: 'Producto F', quantity: 1, price: 110.00 }
    ]
  },
];

export const AdminOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Pendiente</span>;
      case 'PROCESSING':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-bg text-brand-primary">En Preparación</span>;
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

  const filteredOrders = mockOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrintOrder = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Reporte de Pedido ${order.id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #FF6B00; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .section-title { font-weight: bold; font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
            th { background-color: #f9fafb; font-weight: 600; }
            .total { text-align: right; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Foliaco Store</div>
            <div style="text-align: right;">
              <h2 style="margin:0;">Pedido ${order.id}</h2>
              <p style="margin:5px 0 0 0; color:#666;">Fecha: ${order.date}</p>
              <p style="margin:5px 0 0 0; color:#666;">Estado: ${order.status}</p>
            </div>
          </div>
          
          <div class="details">
            <div>
              <div class="section-title">Datos del Cliente</div>
              <p style="margin: 4px 0;"><strong>Nombre:</strong> ${order.customer}</p>
              <p style="margin: 4px 0;"><strong>Email:</strong> ${order.email}</p>
              <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${order.phone}</p>
            </div>
            <div>
              <div class="section-title">Información Adicional</div>
              <p style="margin: 4px 0;"><strong>Método de pago:</strong> Tarjeta de Crédito</p>
              <p style="margin: 4px 0;"><strong>Dirección de envío:</strong> Av. Siempre Viva 123</p>
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
              ${order.items.map((item: any) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            Total a Pagar: $${order.total.toFixed(2)}
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
          <p className="text-sm text-brand-subtext mt-1">Monitorea y actualiza el estado de las órdenes de compra.</p>
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
        
        <button className="flex items-center gap-2 text-brand-subtext border border-brand-border rounded-lg px-4 py-2 hover:bg-brand-bg transition-colors w-full sm:w-auto justify-center">
          <Filter size={18} />
          Filtrar por Estado
        </button>
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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-brand-bg transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-text">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handlePrintOrder(order)}
                    className="text-brand-primary hover:text-brand-dark flex items-center justify-end w-full gap-1 transition-colors"
                  >
                    <Eye size={18} />
                    <span>Reporte</span>
                  </button>
                </td>
              </tr>
            ))}
            
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron pedidos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
