import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  LogOut,
  Truck,
  ChevronDown,
  ChevronRight,
  Boxes,
  FileText
} from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

// Definimos la estructura del menú, soportando submenús
interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  subItems?: { name: string; path: string }[];
}

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  // Estado para los menús desplegables abiertos
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'Catálogo': false,
    'Pedidos': false,
    'Inventario': false,
    'Proveedores': false,
  });

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { 
      name: 'Catálogo', 
      icon: <Package size={20} />,
      subItems: [
        { name: 'Productos', path: '/admin/catalog/products' },
        { name: 'Categorías', path: '/admin/catalog/categories' }
      ]
    },
    { name: 'Clientes', path: '/admin/users', icon: <Users size={20} /> },
    { 
      name: 'Pedidos', 
      icon: <ShoppingCart size={20} />,
      subItems: [
        { name: 'Órdenes', path: '/admin/orders' },
        { name: 'Remitos', path: '/admin/orders/receipts' }
      ]
    },
    { 
      name: 'Inventario', 
      icon: <Boxes size={20} />,
      subItems: [
        { name: 'Stock Actual', path: '/admin/inventory/stock' },
        { name: 'Movimientos', path: '/admin/inventory/movements' }
      ]
    },
    { 
      name: 'Proveedores', 
      icon: <Truck size={20} />,
      subItems: [
        { name: 'Directorio', path: '/admin/suppliers' },
        { name: 'Órdenes de Compra', path: '/admin/suppliers/orders' }
      ]
    },
    { name: 'Estadísticas', path: '/admin/stats', icon: <FileText size={20} /> },
  ];

  const renderMenuItem = (item: MenuItem) => {
    // Si NO tiene submenús, es un link normal
    if (!item.subItems) {
      const isActive = location.pathname.startsWith(item.path!);
      return (
        <Link
          key={item.name}
          to={item.path!}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors mb-1 ${
            isActive 
              ? 'bg-brand-bg text-brand-primary' 
              : 'text-brand-subtext hover:bg-brand-bg hover:text-brand-text'
          }`}
        >
          <span className={isActive ? 'text-brand-primary' : 'text-gray-400'}>
            {item.icon}
          </span>
          {item.name}
        </Link>
      );
    }

    // Si tiene submenús, renderizamos un acordeón
    const isOpen = openMenus[item.name];
    const isAnyChildActive = item.subItems.some(sub => location.pathname.startsWith(sub.path));

    return (
      <div key={item.name} className="mb-1">
        <button
          onClick={() => toggleMenu(item.name)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isAnyChildActive && !isOpen
              ? 'bg-brand-bg text-brand-primary'
              : 'text-brand-subtext hover:bg-brand-bg hover:text-brand-text'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={isAnyChildActive && !isOpen ? 'text-brand-primary' : 'text-gray-400'}>
              {item.icon}
            </span>
            {item.name}
          </div>
          <span className="text-gray-400">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </button>

        {isOpen && (
          <div className="pl-11 pr-4 py-2 space-y-1">
            {item.subItems.map(subItem => {
              const isSubActive = location.pathname === subItem.path;
              return (
                <Link
                  key={subItem.name}
                  to={subItem.path}
                  className={`block py-2 px-3 rounded-md text-sm transition-colors ${
                    isSubActive
                      ? 'text-brand-primary font-bold bg-white shadow-sm border border-brand-border'
                      : 'text-brand-subtext hover:text-brand-text hover:bg-white'
                  }`}
                >
                  {subItem.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      
      {/* Sidebar - Light Mode (con toques verdes como en el branding de la imagen) */}
      <aside className="w-64 bg-white border-r border-brand-border flex flex-col hidden md:flex shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-brand-border mb-4">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="bg-brand-bg text-brand-primary p-1.5 rounded-lg border border-brand-border">
              <Package size={24} />
            </div>
            <span className="text-xl font-bold text-brand-text">
              Foliaco Admin
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {menuItems.map(renderMenuItem)}
        </nav>

        <div className="p-4 border-t border-brand-border">
          <Button className="w-full justify-start text-red-600 bg-red-50 hover:text-red-700 hover:bg-red-100 border-none shadow-none">
            <LogOut size={20} />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-brand-bg">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-brand-border flex items-center justify-end px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-brand-subtext">Admin User</span>
            <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
