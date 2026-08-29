import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import mockProducts from '@/features/catalog/data/mockProducts.json';

export const AdminInventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtramos por búsqueda simple
  const filteredInventory = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Control de Inventario</h1>
          <p className="text-sm text-brand-subtext mt-1">Supervisa y ajusta los niveles de stock de tus productos.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <History size={18} />
          Ver Movimientos
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-t-xl border border-brand-border border-b-0 flex items-center justify-between">
        <div className="w-full max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-brand-subtext" />
          </div>
          <input 
            type="text"
            className="pl-10 w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-brand-text"
            placeholder="Buscar por producto o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Stock Actual
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Ajuste Rápido
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-brand-bg transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-brand-text">{item.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {item.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-lg font-bold text-brand-text">{item.stock}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {item.stock > 15 ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Óptimo</span>
                  ) : item.stock > 0 ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Bajo Stock</span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Agotado</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button className="flex items-center gap-1 text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded transition-colors" title="Ingresar Stock">
                      <ArrowUpRight size={16} />
                      <span className="text-xs">Entrada</span>
                    </button>
                    <button className="flex items-center gap-1 text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded transition-colors" title="Retirar Stock">
                      <ArrowDownRight size={16} />
                      <span className="text-xs">Salida</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron productos en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
