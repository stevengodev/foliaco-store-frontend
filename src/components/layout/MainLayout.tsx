import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar/Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Navbar />
      
      {/* Contenido dinámico de las páginas públicas/tienda */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer simple integrado */}
      <footer className="border-t border-brand-dark bg-brand-dark py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <span className="text-xl font-bold text-white">
                Foliaco Store
              </span>
              <p className="mt-4 text-sm text-gray-400">
                Tu tienda de confianza para encontrar los mejores productos al mejor precio.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Catálogo</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products" className="hover:text-brand-accent">Nuevos Ingresos</Link></li>
                <li><Link to="/products" className="hover:text-brand-accent">Más Vendidos</Link></li>
                <li><Link to="/categories" className="hover:text-brand-accent">Categorías</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-brand-accent">Preguntas Frecuentes</Link></li>
                <li><Link to="/" className="hover:text-brand-accent">Envíos y Devoluciones</Link></li>
                <li><Link to="/" className="hover:text-brand-accent">Contáctanos</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 flex justify-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Foliaco Store. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
