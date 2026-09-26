import React from 'react';
import type { Product } from '../types/product';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

import { Link } from 'react-router-dom';

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const mainImage = product.images && product.images.length > 0 
    ? product.images.find(img => img.isFeatured)?.url || product.images[0].url
    : 'https://via.placeholder.com/300?text=Sin+Imagen';

  const isOutOfStock = product.stock !== undefined && product.stock === 0;

  return (
    <Link to={`/products/${product.id}`} className="block h-full hover:shadow-md transition-shadow rounded-xl">
      <Card 
        title={product.name}
        subtitle={`SKU: ${product.sku}`}
        footer={
          <Button 
            className="w-full" 
            disabled={isOutOfStock}
            onClick={(e) => {
              e.preventDefault(); // Evitar navegación al hacer clic en el botón
              onAddToCart && onAddToCart(product);
            }}
          >
            <ShoppingCart size={18} />
            {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
          </Button>
        }
      >
        <div className="flex flex-col h-full">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                Agotado
              </div>
            )}
          </div>
          
          <p className="text-sm text-brand-subtext flex-grow mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-brand-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
