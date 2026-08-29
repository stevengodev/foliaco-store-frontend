import React from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

// Mock simple de categorías ya que no tenemos JSON para esto aún
const mockCategories = [
  { id: 1, name: 'Electrónica', description: 'Dispositivos y gadgets.', productCount: 45 },
  { id: 2, name: 'Audio', description: 'Auriculares y parlantes.', productCount: 12 },
  { id: 3, name: 'Wearables', description: 'Relojes y bandas inteligentes.', productCount: 8 }
];

export const AdminCategoriesPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Categorías</h1>
          <p className="text-sm text-brand-subtext mt-1">Organiza el catálogo de productos.</p>
        </div>
        <Button className="shrink-0 bg-brand-primary hover:bg-brand-dark">
          <Plus size={18} />
          Nueva Categoría
        </Button>
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
            placeholder="Buscar categoría..."
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Productos Totales
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border">
            {mockCategories.map((category) => (
              <tr key={category.id} className="hover:bg-brand-bg">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {category.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  <span className="bg-brand-bg text-brand-text px-2 py-1 rounded-full text-xs font-semibold">
                    {category.productCount} productos
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-brand-primary hover:text-brand-dark mr-3 transition-colors" title="Editar">
                    <Edit2 size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-900 transition-colors" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
