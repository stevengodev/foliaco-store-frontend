import React, { useState } from 'react';
import { Search, Plus, Building2, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

const mockSuppliers = [
  { id: 'PROV-001', name: 'Distribuidora Tecnológica S.A.', contact: 'Martín Silva', email: 'ventas@distritec.com', phone: '+54 11 4444-5555', address: 'Av. Corrientes 1234, CABA', status: 'Activo' },
  { id: 'PROV-002', name: 'Importadora Global', contact: 'Sofía Rey', email: 'contacto@imglobal.com', phone: '+54 11 3333-2222', address: 'Ruta 8 Km 15, Pilar', status: 'Activo' },
  { id: 'PROV-003', name: 'Electro Mayorista SRL', contact: 'Diego Viale', email: 'ventas@electromay.com', phone: '+54 351 111-2222', address: 'Colón 450, Córdoba', status: 'Inactivo' },
];

export const AdminSuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = mockSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Gestión de Proveedores</h1>
          <p className="text-sm text-brand-subtext mt-1">Administra la información de los proveedores y distribuidores.</p>
        </div>
        <Button className="shrink-0 bg-brand-primary hover:bg-brand-dark">
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
            placeholder="Buscar por empresa o contacto..."
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
                Contacto Principal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Ubicación
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
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-brand-bg transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-brand-subtext">
                      <Building2 size={24} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-brand-text">{supplier.name}</div>
                      <div className="text-xs text-brand-subtext">ID: {supplier.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-brand-text">{supplier.contact}</div>
                  <div className="text-sm text-brand-subtext">{supplier.email}</div>
                  <div className="text-sm text-brand-subtext">{supplier.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-brand-subtext">
                    <MapPin size={16} className="mr-1 text-brand-subtext" />
                    <span className="truncate w-48">{supplier.address}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    supplier.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {supplier.status}
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
            
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
