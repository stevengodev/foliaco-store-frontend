import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';

export const AdminProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Estado del producto principal
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    brand: '',
    categoryId: '',
    price: '',
    active: true
  });

  // Estado para las características dinámicas (HashMap)
  const [features, setFeatures] = useState<{ key: string, value: string }[]>([]);

  // Estado para las imágenes
  const [images, setImages] = useState<{ file: File | null, preview: string, featured: boolean, fileKey?: string }[]>([]);

  // Cargar datos si estamos editando
  React.useEffect(() => {
    const loadProduct = async () => {
      if (isEditing && id) {
        try {
          const { catalogService } = await import('@/services/catalogService');
          const p = await catalogService.getProductById(Number(id));
          
          setFormData({
            sku: p.sku || '',
            name: p.name || '',
            description: p.description || '',
            brand: p.brand || '',
            categoryId: p.category ? String(p.category.id) : '',
            price: String(p.price || ''),
            active: p.active !== undefined ? p.active : true
          });

          if (p.features) {
            const fArray = Object.entries(p.features).map(([k, v]) => ({ key: k, value: v as string }));
            setFeatures(fArray);
          }

          if (p.images && p.images.length > 0) {
            const imgArray = p.images.map(img => ({
              file: null, // No tenemos el File original, pero sí la URL
              preview: img.url,
              featured: img.featured,
              fileKey: img.fileKey
            }));
            setImages(imgArray);
          }
        } catch (error) {
          console.error("Error loading product", error);
        }
      }
    };
    loadProduct();
  }, [id, isEditing]);

  // --- Handlers para Características ---
  const handleAddFeature = () => setFeatures([...features, { key: '', value: '' }]);
  const handleRemoveFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));
  const handleFeatureChange = (index: number, field: 'key' | 'value', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  // --- Handlers para Imágenes ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        featured: images.length === 0 // El primero por defecto será el featured
      }));
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    // Liberar memoria del preview
    if (newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages.splice(index, 1);
    
    // Si se eliminó el featured y quedan imágenes, marcar el primero como featured
    if (images[index].featured && newImages.length > 0) {
      newImages[0].featured = true;
    }
    
    setImages(newImages);
  };

  const handleSetFeaturedImage = (index: number) => {
    const newImages = images.map((img, i) => ({ ...img, featured: i === index }));
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { catalogService } = await import('@/services/catalogService');
      const axios = (await import('axios')).default;
      
      // 1. Identificar imágenes nuevas
      const newImages = images.filter(img => img.file !== null);
      let uploadedFilesMap = new Map<File, string>();

      // 2. Si hay nuevas, pedir presigned URLs y subirlas
      if (newImages.length > 0) {
        const filenames = newImages.map(img => img.file!.name);
        const presignedUrls = await catalogService.getPresignedUrls(filenames);
        
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i].file!;
          const presigned = presignedUrls[i];
          
          let contentType = 'application/octet-stream';
          const lowerName = file.name.toLowerCase();
          if (lowerName.endsWith('.png')) contentType = 'image/png';
          else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) contentType = 'image/jpeg';
          else if (lowerName.endsWith('.webp')) contentType = 'image/webp';
          else if (lowerName.endsWith('.gif')) contentType = 'image/gif';
          
          await axios.put(presigned.url, file, {
            headers: {
              'Content-Type': contentType
            }
          });
          
          uploadedFilesMap.set(file, presigned.fileKey);
        }
      }

      // Transformar features array a HashMap obj
      const featuresMap = features.reduce((acc, curr) => {
        if (curr.key.trim() && curr.value.trim()) {
          acc[curr.key] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        features: featuresMap,
        images: images.map((img, idx) => ({
          fileKey: img.file ? uploadedFilesMap.get(img.file) : img.fileKey,
          order: idx,
          featured: img.featured
        }))
      };

      if (isEditing && id) {
        await catalogService.updateProduct(Number(id), payload);
        alert(`Producto actualizado con éxito.`);
      } else {
        await catalogService.createProduct(payload);
        alert(`Producto creado con éxito.`);
      }
      navigate('/admin/catalog/products');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('Ocurrió un error al guardar el producto.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-brand-subtext hover:text-brand-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-sm text-brand-subtext mt-1">
            {isEditing ? 'Modifica los datos del producto.' : 'Completa todos los datos para agregar un producto al catálogo.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Sección: Información Básica */}
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-text mb-4 border-b border-brand-border pb-2">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Nombre del Producto" 
              placeholder="Ej. iPhone 15 Pro"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
            <Input 
              label="SKU (Código único)" 
              placeholder="Ej. IP15P-256-BLK"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required 
            />
            <Input 
              label="Marca" 
              placeholder="Ej. Apple"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required 
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-brand-text">Categoría (ID Mock)</label>
              <select 
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-brand-text bg-white h-[38px]"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Selecciona una categoría...</option>
                <option value="1">Electrónica</option>
                <option value="2">Audio</option>
                <option value="3">Wearables</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-brand-text block mb-2">Descripción</label>
              <textarea
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-brand-text min-h-[100px]"
                placeholder="Descripción detallada del producto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <Input 
              label="Precio Base ($)" 
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej. 999.99"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required 
            />
            <div className="flex items-center gap-3 mt-8">
              <input 
                type="checkbox" 
                id="active" 
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="active" className="text-sm font-medium text-brand-text">
                Producto Activo (Visible)
              </label>
            </div>
          </div>
        </div>

        {/* Sección: Características Dinámicas */}
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-brand-border pb-2 mb-4">
            <h2 className="text-lg font-bold text-brand-text">Características (Ficha Técnica)</h2>
            <Button type="button" variant="secondary" onClick={handleAddFeature} className="py-1 px-3 text-xs flex items-center gap-1">
              <Plus size={14} /> Añadir
            </Button>
          </div>
          
          {features.length === 0 ? (
            <p className="text-sm text-brand-subtext text-center py-4">No hay características. Haz clic en Añadir para agregar especificaciones (ej. Memoria: 8GB).</p>
          ) : (
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input 
                    type="text"
                    className="flex-1 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Clave (Ej. Pantalla)"
                    value={feature.key}
                    onChange={(e) => handleFeatureChange(idx, 'key', e.target.value)}
                    required
                  />
                  <input 
                    type="text"
                    className="flex-1 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Valor (Ej. OLED 6.1 pulgadas)"
                    value={feature.value}
                    onChange={(e) => handleFeatureChange(idx, 'value', e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección: Imágenes */}
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-brand-border pb-2 mb-4">
            <h2 className="text-lg font-bold text-brand-text">Imágenes del Producto</h2>
            
            {/* Input de archivo oculto */}
            <input 
              type="file" 
              id="image-upload" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => document.getElementById('image-upload')?.click()} 
              className="py-1 px-3 text-xs flex items-center gap-1"
            >
              <Plus size={14} /> Subir Imágenes
            </Button>
          </div>
          
          {images.length === 0 ? (
            <div className="border-2 border-dashed border-brand-border rounded-lg p-10 text-center flex flex-col items-center justify-center bg-gray-50">
              <ImageIcon size={48} className="text-gray-300 mb-3" />
              <p className="text-brand-text font-medium mb-1">Arrastra tus imágenes aquí o haz clic para subir</p>
              <p className="text-sm text-brand-subtext mb-4">Solo formatos JPG, PNG o WebP permitidos.</p>
              <Button type="button" variant="secondary" onClick={() => document.getElementById('image-upload')?.click()}>
                Seleccionar Archivos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border border-brand-border rounded-lg bg-gray-50">
                  
                  <img src={img.preview} alt={`Preview ${idx}`} className="w-20 h-20 object-cover rounded border border-gray-200" />
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-text mb-1 truncate">
                      {img.file?.name}
                    </p>
                    <p className="text-xs text-brand-subtext mb-3">
                      {img.file ? (img.file.size / 1024 / 1024).toFixed(2) : 0} MB
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-brand-text cursor-pointer">
                        <input 
                          type="radio"
                          name="featuredImage"
                          checked={img.featured}
                          onChange={() => handleSetFeaturedImage(idx)}
                          className="text-brand-primary focus:ring-brand-primary h-4 w-4"
                        />
                        Imagen Principal
                      </label>
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-4 mt-8">
          <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" className="flex items-center gap-2 px-8">
            <Save size={18} />
            Guardar Producto
          </Button>
        </div>

      </form>
    </div>
  );
};
