import React from 'react';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Card } from '@/components/common/Card/Card';
import { Loader } from '@/components/common/Loader/Loader';
import { ShoppingCart, Search, CreditCard, CheckCircle2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Foliaco Store - UI Kit (Simple)</h1>
          <p className="text-gray-500">Componentes base fáciles de usar</p>
        </header>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Botones</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Principal</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="danger">Peligro</Button>
            <Button disabled>Deshabilitado</Button>
            <Button className="w-full sm:w-auto">Personalizado con Tailwind</Button>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nombre completo" placeholder="Ej. Juan Pérez" />
            <Input 
              label="Correo electrónico" 
              type="email" 
              placeholder="correo@ejemplo.com"
            />
            <Input 
              label="Contraseña" 
              type="password" 
              value="123" 
              error="La contraseña es muy corta" 
            />
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Cards (Tarjetas)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Producto Mockup */}
            <Card 
              title="Producto Ejemplo" 
              subtitle="Categoría: Electrónica"
              footer={
                <Button className="w-full">
                  Agregar al Carrito
                </Button>
              }
            >
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                <span className="text-gray-400">Imagen 16:9</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">$299.99</p>
              <p className="text-sm text-gray-500 mt-1">Stock: 15 unidades</p>
            </Card>

            {/* Orden de Compra Mockup */}
            <Card 
              title="Resumen de Orden" 
              subtitle="Pedido #1042"
              footer={
                <Button className="w-full" variant="primary">
                  Pagar Ahora
                </Button>
              }
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">$299.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">$15.00</span>
                </div>
                <div className="pt-2 mt-2 border-t flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-blue-600">$314.99</span>
                </div>
              </div>
            </Card>

            {/* Estado simple */}
            <Card title="Estado del Pedido">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={32} />
                <div>
                  <p className="font-bold text-gray-800">Entregado</p>
                  <p className="text-sm text-gray-500">Tu pedido ha llegado</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Loaders */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Loaders</h2>
          <div className="flex gap-8 items-center p-4 bg-white rounded-xl border border-gray-200">
            <Loader size="sm" color="primary" />
            <Loader size="md" color="primary" />
            <Loader size="lg" color="primary" />
          </div>
        </section>

      </div>
    </div>
  );
}
