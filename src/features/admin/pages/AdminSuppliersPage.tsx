import React, { useState, useEffect } from 'react';
import { Search, Plus, Building2, Mail, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { useNavigate } from 'react-router-dom';
import { supplierService, type SupplierResponse } from '@/services/supplierService';

export const AdminSuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Gestión de Proveedores</h1>
          <p className="text-sm text-brand-subtext mt-1">Administra la información de los proveedores y distribuidores.</p>
        </div>
        <Button 
          className="shrink-0 bg-brand-primary hover:bg-brand-dark"
          onClick={() => navigate('/admin/suppliers/new')}
        >
          <Plus size={18} />
          Nuevo Proveedor
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
            placeholder="Buscar por empresa o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Proveedores */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Empresa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Correo Electrónico
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Estado
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
                  Cargando proveedores...
                </td>
              </tr>
            ) : filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-brand-bg transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-brand-subtext">
                      <Building2 size={24} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-brand-text">{supplier.company}</div>
                      <div className="text-xs text-brand-subtext">ID: #{supplier.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-brand-text gap-1.5">
                    <Mail size={16} className="text-brand-subtext" />
                    {supplier.email || 'No registrado'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    supplier.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {supplier.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => navigate(`/admin/suppliers/edit/${supplier.id}`)}
                    className="text-brand-primary hover:text-brand-dark mr-3 transition-colors" 
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={async () => {
                      if (window.confirm(`¿Estás seguro de eliminar el proveedor "${supplier.company}"?`)) {
                        try {
                          await supplierService.deleteSupplier(supplier.id);
                          setSuppliers(suppliers.filter(s => s.id !== supplier.id));
                        } catch (error) {
                          console.error('Error deleting supplier:', error);
                          alert('Error al eliminar el proveedor');
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors" 
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            
            {!isLoading && filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron proveedores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
