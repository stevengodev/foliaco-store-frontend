import React, { useState } from 'react';
import { Search, Plus, Eye, Filter, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

// Mock Data
const mockPurchaseOrders = [
  { 
    id: 'PO-2026-001', 
    supplier: 'Distribuidora Tecnológica S.A.', 
    date: '2026-08-28', 
    total: 4500.00, 
    status: 'PENDING',
    itemsCount: 50
  },
  { 
    id: 'PO-2026-002', 
    supplier: 'Importadora Global', 
    date: '2026-08-25', 
    total: 12000.50, 
    status: 'RECEIVED',
    itemsCount: 200
  },
  { 
    id: 'PO-2026-003', 
    supplier: 'Electro Mayorista SRL', 
    date: '2026-08-20', 
    total: 850.00, 
    status: 'RECEIVED',
    itemsCount: 15
  },
];

export const AdminPurchaseOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Usamos estado local para poder simular la recepción
  const [orders, setOrders] = useState(mockPurchaseOrders);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReceive = (orderId: string) => {
    // Simulamos la llamada a POST /api/purchase-orders/{id}/items/receive
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'RECEIVED' } : order
    ));
    alert(`Orden ${orderId} recibida. El stock ha sido actualizado.`);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PENDING') {
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Pendiente</span>;
    }
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Recibido</span>;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Órdenes de Compra</h1>
          <p className="text-sm text-brand-subtext mt-1">Gestiona el abastecimiento solicitando stock a tus proveedores.</p>
        </div>
        <Button className="shrink-0 bg-brand-primary hover:bg-brand-dark">
          <Plus size={18} />
          Nueva Orden
        </Button>
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
            placeholder="Buscar por ID u proveedor..."
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
                ID Orden
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Proveedor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Unidades
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Costo Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Estado
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text font-medium">
                  {order.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {order.itemsCount} unid.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => handleReceive(order.id)}
                        className="text-green-600 hover:text-green-800 flex items-center gap-1 transition-colors bg-green-50 px-2 py-1 rounded"
                        title="Marcar como recibido e ingresar a inventario"
                      >
                        <CheckCircle2 size={16} />
                        <span>Recibir</span>
                      </button>
                    )}
                    <button className="text-brand-primary hover:text-brand-dark flex items-center gap-1 transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron órdenes de compra que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
