import React, { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';

// Mock de Remitos
const mockReceipts = [
  { id: 'REM-2026-001', orderId: 'ORD-2026-001', date: '2026-08-29', trackingNumber: 'TRK-987654321', status: 'GENERATED' },
  { id: 'REM-2026-002', orderId: 'ORD-2026-003', date: '2026-08-28', trackingNumber: 'TRK-123456789', status: 'DELIVERED' },
];

export const AdminReceiptsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GENERATED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Generado</span>;
      case 'IN_TRANSIT':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">En Tránsito</span>;
      case 'DELIVERED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Entregado</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const filteredReceipts = mockReceipts.filter(receipt => 
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    receipt.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Gestión de Remitos</h1>
          <p className="text-sm text-brand-subtext mt-1">Controla los comprobantes de despacho y envío de mercancía.</p>
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
            placeholder="Buscar por ID de remito u orden..."
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
                ID Remito
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                ID Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Seguimiento
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
            {filteredReceipts.map((receipt) => (
              <tr key={receipt.id} className="hover:bg-brand-bg transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-text">
                  {receipt.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">
                  {receipt.orderId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {receipt.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text">
                  {receipt.trackingNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(receipt.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-brand-primary hover:text-brand-dark flex items-center justify-end w-full gap-1 transition-colors">
                    <Eye size={18} />
                    <span>Ver</span>
                  </button>
                </td>
              </tr>
            ))}
            
            {filteredReceipts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron remitos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
