import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, MoreVertical } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

const mockUsers = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '+54 11 1234-5678', role: 'Cliente', status: 'Activo', orders: 12 },
  { id: 2, name: 'María Gómez', email: 'maria@example.com', phone: '+54 11 9876-5432', role: 'Admin', status: 'Activo', orders: 0 },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', phone: '+54 351 456-7890', role: 'Cliente', status: 'Inactivo', orders: 1 },
  { id: 4, name: 'Ana Torres', email: 'ana@example.com', phone: '+54 223 789-0123', role: 'Cliente', status: 'Activo', orders: 4 },
];

export const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Usuarios y Clientes</h1>
          <p className="text-sm text-brand-subtext mt-1">Administra los usuarios registrados y el personal de la tienda.</p>
        </div>
        <Button className="shrink-0 bg-brand-primary hover:bg-brand-dark">
          <Plus size={18} />
          Nuevo Usuario
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
            placeholder="Buscar por nombre o correo electrónico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Contacto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Pedidos
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-brand-bg transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-brand-bg rounded-full flex items-center justify-center text-brand-primary font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-brand-text">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brand-text flex items-center gap-1"><Mail size={14} className="text-brand-subtext"/> {user.email}</div>
                  <div className="text-sm text-brand-subtext flex items-center gap-1 mt-1"><Phone size={14} className="text-brand-subtext"/> {user.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-brand-subtext">
                  {user.orders > 0 ? user.orders : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-brand-subtext hover:text-brand-primary transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
            
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
