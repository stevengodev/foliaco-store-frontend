import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useAuthStore } from '@/features/users/store/authStore';

export const Navbar: React.FC = () => {
  // Conectamos con el estado global de Zustand
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-white/80 backdrop-blur-md">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 -ml-2 text-brand-subtext hover:text-brand-primary focus:outline-none">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-primary">
              Foliaco Store
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-brand-subtext">
          <Link to="/" className="hover:text-brand-primary transition-colors">Inicio</Link>
          <Link to="/products" className="hover:text-brand-primary transition-colors">Catálogo</Link>
          <Link to="/categories" className="hover:text-brand-primary transition-colors">Categorías</Link>
        </nav>

        {/* Search, Cart & User */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-brand-subtext hover:text-brand-primary transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          
          <Link to="/cart" className="relative p-2 text-brand-subtext hover:text-brand-primary transition-colors">
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white">
                {cartItemsCount}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-brand-border mx-1 hidden sm:block"></div>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/profile/orders">
                <Button variant="secondary" className="flex">
                  <User size={18} />
                  Mi Perfil
                </Button>
              </Link>
              <Button variant="secondary" onClick={() => logout()} className="flex" title="Cerrar sesión">
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login">
                <Button variant="secondary">Ingresar</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
