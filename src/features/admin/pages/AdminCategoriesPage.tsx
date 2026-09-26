import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { catalogService } from '@/services/catalogService';

export const AdminCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await catalogService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Categorías</h1>
          <p className="text-sm text-brand-subtext mt-1">Organiza el catálogo de productos.</p>
        </div>
        <Button 
          className="shrink-0 bg-brand-primary hover:bg-brand-dark"
          onClick={() => navigate('/admin/catalog/categories/new')}
        >
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-brand-subtext">
                  Cargando categorías...
                </td>
              </tr>
            ) : filteredCategories.map((category) => (
              <tr key={category.id} className="hover:bg-brand-bg">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  {category.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                  <span className="bg-brand-bg text-brand-text px-2 py-1 rounded-full text-xs font-semibold">
                    {category.productCount || 0} productos
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-brand-primary hover:text-brand-dark mr-3 transition-colors" 
                    title="Editar"
                    onClick={() => navigate(`/admin/catalog/categories/edit/${category.id}`)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900 transition-colors" 
                    title="Eliminar"
                    onClick={async () => {
                      if (window.confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
                        try {
                          await catalogService.deleteCategory(category.id);
                          setCategories(categories.filter(c => c.id !== category.id));
                        } catch (error) {
                          console.error('Error deleting category:', error);
                          alert('Error al eliminar la categoría');
                        }
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            
            {!isLoading && filteredCategories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
