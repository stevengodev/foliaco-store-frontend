import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import mockProducts from '../data/mockProducts.json';
import type { Product } from '../types/product';
import { Input } from '@/components/common/Input/Input';
import { Search } from 'lucide-react';
import { useCartStore } from '@/features/cart/store/cartStore';

export const CatalogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const addItem = useCartStore((state) => state.addItem);
  
  // Tipamos el JSON como un array de Product
  const products: Product[] = mockProducts as unknown as Product[];

  // Filtramos por búsqueda simple
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header del Catálogo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-text">Catálogo de Productos</h1>
          <p className="mt-2 text-brand-subtext">Encuentra todo lo que necesitas al mejor precio.</p>
        </div>
        
        <div className="w-full md:w-72">
          <Input 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-brand-border">
          <Search className="mx-auto h-12 w-12 text-brand-subtext mb-4" />
          <h3 className="text-lg font-medium text-brand-text">No se encontraron productos</h3>
          <p className="text-brand-subtext mt-2">Intenta buscar con otras palabras o limpia el filtro.</p>
        </div>
      )}

    </div>
  );
};
