import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import type { Product } from '../types/product';
import mockProductsData from '../data/mockProducts.json';
import { useCartStore } from '@/features/cart/store/cartStore';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const { catalogService } = await import('@/services/catalogService');
        const foundProduct = await catalogService.getProductById(Number(id));
        setProduct(foundProduct);
        
        // Establecer imagen inicial si existen
        if (foundProduct.images && foundProduct.images.length > 0) {
          const featuredImage = foundProduct.images.find(img => img.isFeatured);
          if (featuredImage) {
            setSelectedImage(featuredImage.url);
          } else {
            setSelectedImage(foundProduct.images[0].url);
          }
        }
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-brand-text mb-4">Producto no encontrado</h2>
        <Button onClick={() => navigate('/products')} variant="secondary">
          Volver al catálogo
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock !== undefined && product.stock === 0;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate('/products')}
        className="flex items-center text-brand-subtext hover:text-brand-primary transition-colors mb-6 font-medium text-sm"
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver al catálogo
      </button>

      {/* Grid Principal: Galería e Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-brand-border">
        
        {/* Lado Izquierdo: Galería de Imágenes */}
        <div className="flex flex-col gap-4">
          {/* Imagen Principal */}
          <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center relative border border-brand-border">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-brand-subtext">Sin Imagen</span>
            )}
            
            {/* Badge Stock */}
            {isOutOfStock && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded shadow-sm">
                Agotado
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {product.images && product.images.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img.url 
                      ? 'border-brand-accent shadow-md scale-105' 
                      : 'border-transparent hover:border-brand-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lado Derecho: Información del Producto */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-semibold text-brand-subtext tracking-wider uppercase">
              SKU: {product.sku} | Marca: {product.brand}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-brand-text mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-extrabold text-brand-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <p className="text-brand-subtext leading-relaxed mb-8 border-y border-brand-border py-6">
            {product.description}
          </p>

          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brand-text w-24">Disponibilidad:</span>
              {isOutOfStock ? (
                <span className="flex items-center text-red-500 font-medium">
                  <AlertCircle size={16} className="mr-1" />
                  Sin stock
                </span>
              ) : (
                <span className="flex items-center text-green-600 font-medium">
                  <Check size={16} className="mr-1" />
                  En stock {product.stock !== undefined ? `(${product.stock} unidades)` : ''}
                </span>
              )}
            </div>
          </div>

          {/* Botón Agregar */}
          <div className="mt-auto pt-4">
            <Button 
              className="w-full py-4 text-lg"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
              {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
            </Button>
          </div>
        </div>
      </div>

      {/* Sección Inferior: Tabs / Detalles */}
      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
        
        {/* Cabecera Tabs */}
        <div className="flex border-b border-brand-border px-6 pt-4">
          <button 
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'details' 
                ? 'border-brand-accent text-brand-accent' 
                : 'border-transparent text-brand-subtext hover:text-brand-text'
            }`}
            onClick={() => setActiveTab('details')}
          >
            DETALLES Y CARACTERÍSTICAS
          </button>
          <button 
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'shipping' 
                ? 'border-brand-accent text-brand-accent' 
                : 'border-transparent text-brand-subtext hover:text-brand-text'
            }`}
            onClick={() => setActiveTab('shipping')}
          >
            ENVÍO Y GARANTÍA
          </button>
        </div>

        {/* Contenido Tabs */}
        <div className="p-6 md:p-10">
          {activeTab === 'details' && (
            <div className="animate-in fade-in duration-300">
              {product.features && Object.keys(product.features).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full max-w-2xl text-left border-collapse">
                    <tbody>
                      {Object.entries(product.features).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-brand-bg/50' : 'bg-white'}>
                          <th className="py-3 px-4 font-semibold text-brand-text w-1/3 border-b border-brand-border">
                            {key}
                          </th>
                          <td className="py-3 px-4 text-brand-subtext border-b border-brand-border">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-brand-subtext italic">No hay características específicas detalladas para este producto.</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="animate-in fade-in duration-300 text-brand-subtext space-y-4 max-w-3xl">
              <h3 className="font-semibold text-brand-text text-lg">Información de Envío</h3>
              <p>
                Los envíos se procesan dentro de las primeras 24 horas hábiles posteriores a la confirmación de la compra. 
                El tiempo estimado de entrega depende de tu ubicación:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Capital Federal y Gran Buenos Aires: 1-2 días hábiles.</li>
                <li>Resto del país: 3-5 días hábiles.</li>
              </ul>
              
              <h3 className="font-semibold text-brand-text text-lg mt-6">Política de Devolución</h3>
              <p>
                Tienes 30 días continuos desde que recibiste el producto para solicitar un cambio o devolución sin costo adicional. 
                El artículo debe estar en su estado original, sin uso y con sus etiquetas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
