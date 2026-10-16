import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Mail, 
  Users, 
  ShieldCheck, 
  UserCheck, 
  ShoppingBag, 
  RefreshCw, 
  Loader2, 
  X, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  UserX,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { userService, type UserResponse, type UserRole, type CreateUserRequest } from '@/services/userService';

export const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'CUSTOMER'>('ALL');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Nuevo Usuario
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    fullName: '',
    email: '',
    role: 'CUSTOMER',
    enabled: true,
  });

  // Notificaciones de feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cargar usuarios desde la API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      const msg = err.response?.data?.message || err.message || 'Error al conectar con la API de usuarios.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Crear usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.fullName) {
      setFeedback({ type: 'error', message: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    try {
      setIsSaving(true);
      await userService.createUser(newUser);
      setFeedback({ type: 'success', message: `Usuario ${newUser.fullName} creado exitosamente.` });
      setShowCreateModal(false);
      setNewUser({ fullName: '', email: '', role: 'CUSTOMER', enabled: true });
      fetchUsers();
    } catch (err: any) {
      console.error('Error creating user:', err);
      const msg = err.response?.data?.message || err.message || 'Error al crear el usuario.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Cambiar rol de usuario
  const handleToggleRole = async (user: UserResponse) => {
    const nextRole: UserRole = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    const confirmMsg = user.role === 'ADMIN'
      ? `¿Deseas quitar privilegios de Administrador a ${user.fullName || user.email}?`
      : `¿Deseas promover a ${user.fullName || user.email} a Administrador?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await userService.assignRole(user.id, nextRole);
      setFeedback({ 
        type: 'success', 
        message: `Rol de ${user.fullName || user.email} actualizado a ${nextRole}.` 
      });
      fetchUsers();
    } catch (err: any) {
      console.error('Error changing role:', err);
      const msg = err.response?.data?.message || err.message || 'Error al actualizar el rol.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  // Alternar estado activo / inactivo
  const handleToggleStatus = async (user: UserResponse) => {
    const action = user.enabled ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Estás seguro de que deseas ${action} la cuenta de ${user.fullName || user.email}?`)) {
      return;
    }

    try {
      await userService.toggleStatus(user.id);
      setFeedback({ 
        type: 'success', 
        message: `Cuenta de ${user.fullName || user.email} ${user.enabled ? 'desactivada' : 'activada'} con éxito.` 
      });
      fetchUsers();
    } catch (err: any) {
      console.error('Error toggling status:', err);
      const msg = err.response?.data?.message || err.message || 'Error al cambiar estado.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  // Filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Métricas
  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const customerCount = users.filter(u => u.role === 'CUSTOMER').length;
  const activeCount = users.filter(u => u.enabled).length;

  return (
    <div className="w-full space-y-6">
      {/* Banner de Feedback */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-fade-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
            ) : (
              <AlertTriangle className="text-rose-600 shrink-0" size={20} />
            )}
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Usuarios y Clientes</h1>
          <p className="text-sm text-brand-subtext mt-1">Administra los usuarios registrados y el personal de la tienda.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={fetchUsers} 
            disabled={isLoading}
            className="flex items-center gap-2 border-brand-border hover:bg-brand-bg text-brand-text"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Actualizar
          </Button>
          <Button 
            className="shrink-0 bg-brand-primary hover:bg-brand-dark flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Total Usuarios</p>
            <p className="text-2xl font-bold text-brand-text mt-0.5">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Administradores</p>
            <p className="text-2xl font-bold text-brand-text mt-0.5">{adminCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Clientes</p>
            <p className="text-2xl font-bold text-brand-text mt-0.5">{customerCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Cuentas Activas</p>
            <p className="text-2xl font-bold text-brand-text mt-0.5">{activeCount}</p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-t-2xl border border-brand-border border-b-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="w-full md:max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-brand-subtext" />
          </div>
          <input 
            type="text"
            className="pl-10 w-full border border-brand-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-brand-text"
            placeholder="Buscar por nombre o correo electrónico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros de Rol */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              roleFilter === 'ALL'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'bg-brand-bg text-brand-subtext hover:text-brand-text border border-brand-border'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick={() => setRoleFilter('CUSTOMER')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              roleFilter === 'CUSTOMER'
                ? 'bg-brand-primary text-white shadow-xs'
                : 'bg-brand-bg text-brand-subtext hover:text-brand-text border border-brand-border'
            }`}
          >
            Clientes ({customerCount})
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              roleFilter === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-brand-bg text-brand-subtext hover:text-brand-text border border-brand-border'
            }`}
          >
            Admins ({adminCount})
          </button>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white border border-brand-border rounded-b-2xl overflow-hidden overflow-x-auto shadow-xs">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                Contacto
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                Pedidos
              </th>
              <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-brand-subtext">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 size={30} className="animate-spin text-brand-primary" />
                    <p className="text-sm">Cargando usuarios desde el servidor...</p>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-brand-subtext">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users size={36} className="text-gray-300" />
                    <p className="text-base font-medium text-brand-text">No se encontraron usuarios</p>
                    <p className="text-xs text-brand-subtext">Prueba ajustando los filtros de búsqueda</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const displayName = user.fullName || user.email.split('@')[0];
                const initial = displayName.charAt(0).toUpperCase();

                return (
                  <tr key={user.id} className="hover:bg-brand-bg/50 transition-colors">
                    {/* Usuario */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-base border shadow-xs ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                            : 'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                          {initial}
                        </div>
                        <div className="ml-3.5">
                          <div className="text-sm font-semibold text-brand-text flex items-center gap-2">
                            {displayName}
                            <span className="text-xs px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-500 font-mono">
                              #{user.id}
                            </span>
                          </div>
                          <div className="text-xs text-brand-subtext">
                            Registrado en el sistema
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-brand-text flex items-center gap-2">
                        <Mail size={14} className="text-brand-subtext shrink-0" />
                        <span className="font-mono text-xs">{user.email}</span>
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-4 font-semibold rounded-full border ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {user.role === 'ADMIN' ? <ShieldCheck size={13} /> : <UserCheck size={13} />}
                        {user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>

                    {/* Pedidos */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        (user.ordersCount || 0) > 0 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {user.ordersCount || 0}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full border ${
                        user.enabled 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {user.enabled ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón Cambiar Rol */}
                        <button
                          onClick={() => handleToggleRole(user)}
                          title={user.role === 'ADMIN' ? 'Degradar a Cliente' : 'Promover a Administrador'}
                          className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                            user.role === 'ADMIN'
                              ? 'border-gray-200 text-gray-600 hover:bg-gray-100'
                              : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                          }`}
                        >
                          {user.role === 'ADMIN' ? (
                            <>
                              <ShieldAlert size={14} />
                              <span className="hidden sm:inline">Hacer Cliente</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={14} />
                              <span className="hidden sm:inline">Hacer Admin</span>
                            </>
                          )}
                        </button>

                        {/* Botón Alternar Estado */}
                        <button
                          onClick={() => handleToggleStatus(user)}
                          title={user.enabled ? 'Desactivar cuenta' : 'Activar cuenta'}
                          className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                            user.enabled
                              ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {user.enabled ? (
                            <>
                              <UserX size={14} />
                              <span className="hidden sm:inline">Desactivar</span>
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} />
                              <span className="hidden sm:inline">Activar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-brand-border overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-bg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-text">Nuevo Usuario</h3>
                  <p className="text-xs text-brand-subtext">Registra un nuevo cliente o personal administrativo</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-brand-subtext hover:text-brand-text p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Nombre Completo *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Andrés Foliaco"
                  className="w-full border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Correo Electrónico *
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="Ej. andres@example.com"
                  className="w-full border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                    Rol en la Tienda
                  </label>
                  <select
                    className="w-full border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text bg-white"
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  >
                    <option value="CUSTOMER">Cliente</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                    Estado Inicial
                  </label>
                  <select
                    className="w-full border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text bg-white"
                    value={newUser.enabled ? 'true' : 'false'}
                    onChange={(e) => setNewUser(prev => ({ ...prev, enabled: e.target.value === 'true' }))}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSaving}
                  className="border-brand-border hover:bg-brand-bg text-brand-text"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-brand-primary hover:bg-brand-dark flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Crear Usuario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
