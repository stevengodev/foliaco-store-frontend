import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, History, X, Save } from 'lucide-react';
import mockProducts from '@/features/catalog/data/mockProducts.json';

export const AdminInventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(mockProducts);
  
  // Modal state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [movementType, setMovementType] = useState<'ENTRADA' | 'SALIDA' | null>(null);
  const [quantity, setQuantity] = useState<number | ''>(1);

  // Filtramos por búsqueda simple
  const filteredInventory = inventory.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (item: any, type: 'ENTRADA' | 'SALIDA') => {
    setSelectedItem(item);
    setMovementType(type);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setMovementType(null);
    setQuantity(1);
  };

  const handleSaveMovement = () => {
    if (!selectedItem || !movementType || quantity === '' || quantity <= 0) return;

    setInventory(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        const adjustment = movementType === 'ENTRADA' ? Number(quantity) : -Number(quantity);
        const newStock = Math.max(0, item.stock + adjustment);
        return { ...item, stock: newStock };
      }
      return item;
    }));
    
    closeModal();
  };

  return (
    <div className="w-full relative">
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
                    <button 
                      onClick={() => openModal(item, 'ENTRADA')}
                      className="flex items-center gap-1 text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded transition-colors" 
                      title="Ingresar Stock"
                    >
                      <ArrowUpRight size={16} />
                      <span className="text-xs">Entrada</span>
                    </button>
                    <button 
                      onClick={() => openModal(item, 'SALIDA')}
                      className="flex items-center gap-1 text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded transition-colors" 
                      title="Retirar Stock"
                    >
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

      {/* Modal */}
      {selectedItem && movementType && (
        <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-6 relative flex flex-col transform transition-all duration-300">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-brand-subtext hover:text-brand-text transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-brand-text mb-4">
              Registrar {movementType === 'ENTRADA' ? 'Entrada' : 'Salida'}
            </h2>
            
            <div className="mb-4">
              <span className="block text-sm text-brand-subtext mb-1">Producto</span>
              <span className="font-medium text-brand-text block">{selectedItem.name}</span>
              <span className="text-xs text-brand-subtext">SKU: {selectedItem.sku}</span>
            </div>

            <div className="flex justify-between items-center mb-6 bg-brand-bg p-3 rounded-lg border border-brand-border">
              <span className="text-sm font-medium text-brand-subtext">Stock Actual:</span>
              <span className="text-lg font-bold text-brand-text">{selectedItem.stock} uds</span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-text mb-2">
                Cantidad a {movementType === 'ENTRADA' ? 'Ingresar' : 'Retirar'}
              </label>
              <input 
                type="number"
                min="1"
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-auto">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-brand-text border border-brand-border rounded-lg hover:bg-brand-bg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveMovement}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                  movementType === 'ENTRADA' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Save size={18} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
