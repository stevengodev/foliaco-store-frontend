import React from 'react';
import { Package, Users, ShoppingCart, DollarSign, Clock, Box, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/common/Card/Card';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 w-full">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-text">Dashboard</h1>
        <p className="mt-2 text-brand-subtext">Bienvenido al sistema de gestión de Foliaco Store</p>
      </div>

      {/* Tarjetas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Productos */}
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-subtext mb-1">Productos</p>
            <h3 className="text-3xl font-bold text-brand-text">24</h3>
            <p className="text-xs text-gray-400 mt-2">Total de productos</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Package size={24} />
          </div>
        </div>

        {/* Clientes */}
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-subtext mb-1">Clientes</p>
            <h3 className="text-3xl font-bold text-brand-text">142</h3>
            <p className="text-xs text-gray-400 mt-2">Total de clientes</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-green-600">
            <Users size={24} />
          </div>
        </div>

        {/* Pedidos Hoy */}
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-subtext mb-1">Pedidos Hoy</p>
            <h3 className="text-3xl font-bold text-brand-text">8</h3>
            <p className="text-xs text-gray-400 mt-2">Pedidos registrados hoy</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
            <ShoppingCart size={24} />
          </div>
        </div>

        {/* Ventas Hoy */}
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-subtext mb-1">Ventas Hoy</p>
            <h3 className="text-3xl font-bold text-brand-text">$ 450.00</h3>
            <p className="text-xs text-gray-400 mt-2">Total vendido hoy</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Estado de Pedidos */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-brand-text mb-4">Estado de Pedidos</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-white border-l-4 border-brand-accent p-4 rounded-r-xl shadow-sm border-y border-r border-brand-border">
            <div className="flex justify-between items-start mb-2">
              <Clock className="text-brand-accent" size={20} />
              <span className="text-2xl font-bold text-brand-text">3</span>
            </div>
            <p className="text-sm font-medium text-orange-600">Pendientes</p>
          </div>

          <div className="bg-white border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm border-y border-r border-brand-border">
            <div className="flex justify-between items-start mb-2">
              <Box className="text-blue-500" size={20} />
              <span className="text-2xl font-bold text-brand-text">2</span>
            </div>
            <p className="text-sm font-medium text-blue-600">En Preparación</p>
          </div>

          <div className="bg-white border-l-4 border-purple-500 p-4 rounded-r-xl shadow-sm border-y border-r border-brand-border">
            <div className="flex justify-between items-start mb-2">
              <Truck className="text-purple-500" size={20} />
              <span className="text-2xl font-bold text-brand-text">1</span>
            </div>
            <p className="text-sm font-medium text-purple-600">Enviados</p>
          </div>

          <div className="bg-white border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm border-y border-r border-brand-border">
            <div className="flex justify-between items-start mb-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-2xl font-bold text-brand-text">12</span>
            </div>
            <p className="text-sm font-medium text-green-600">Entregados</p>
          </div>

          <div className="bg-white border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm border-y border-r border-brand-border">
            <div className="flex justify-between items-start mb-2">
              <XCircle className="text-red-500" size={20} />
              <span className="text-2xl font-bold text-brand-text">0</span>
            </div>
            <p className="text-sm font-medium text-red-600">Cancelados</p>
          </div>

        </div>
      </div>

    </div>
  );
};
