import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock de Movimientos de Inventario
const mockMovements = [
  { id: 'MOV-001', date: '2026-08-29 10:30', product: 'Smartphone XYZ Pro', type: 'IN', quantity: 50, reference: 'Compra a Proveedor #123' },
  { id: 'MOV-002', date: '2026-08-29 14:15', product: 'Laptop UltraBook 14"', type: 'OUT', quantity: 2, reference: 'Venta - Pedido ORD-2026-001' },
  { id: 'MOV-003', date: '2026-08-28 09:00', product: 'Reloj Inteligente Fit Pro', type: 'IN', quantity: 30, reference: 'Compra a Proveedor #124' },
  { id: 'MOV-004', date: '2026-08-28 16:45', product: 'Auriculares Inalámbricos Noise Cancelling', type: 'OUT', quantity: 5, reference: 'Ajuste de inventario (Dañados)' },
];

export const AdminMovementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovements = mockMovements.filter(movement => 
    movement.product.toLowerCase().includes(searchTerm.toLowerCase()) || 
    movement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Movimientos de Inventario</h1>
          <p className="text-sm text-brand-subtext mt-1">Historial de entradas y salidas de stock.</p>
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
            placeholder="Buscar por ID, producto o referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button className="flex items-center gap-2 text-brand-subtext border border-brand-border rounded-lg px-4 py-2 hover:bg-brand-bg transition-colors w-full sm:w-auto justify-center">
          <Filter size={18} />
          Filtrar por Tipo
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                ID Mov.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Cantidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Referencia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border">
            {filteredMovements.map((movement) => (
              <tr key={movement.id} className="hover:bg-brand-bg transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text">
                  {movement.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {movement.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text">
                  {movement.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {movement.type === 'IN' ? (
                    <span className="px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <ArrowDownRight size={12} />
                      ENTRADA
                    </span>
                  ) : (
                    <span className="px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      <ArrowUpRight size={12} />
                      SALIDA
                    </span>
                  )}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                  movement.type === 'IN' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {movement.reference}
                </td>
              </tr>
            ))}
            
            {filteredMovements.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron movimientos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
