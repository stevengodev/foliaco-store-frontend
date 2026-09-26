import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';

export const AdminCategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de guardado
    console.log('Guardando categoría:', formData);
    alert(`Categoría ${isEditing ? 'actualizada' : 'creada'} con éxito (Simulado).`);
    navigate('/admin/catalog/categories');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-brand-subtext hover:text-brand-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </h1>
          <p className="text-sm text-brand-subtext mt-1">
            {isEditing ? 'Modifica los detalles de la categoría.' : 'Completa los datos para añadir una nueva categoría.'}
          </p>
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Nombre de la Categoría" 
            placeholder="Ej. Smartphones"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required 
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-brand-text">
              Descripción
            </label>
            <textarea
              className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-brand-text min-h-[100px]"
              placeholder="Descripción de la categoría..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input 
              type="checkbox" 
              id="active" 
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="active" className="text-sm font-medium text-brand-text">
              Categoría Activa (Visible en la tienda)
            </label>
          </div>

          <div className="border-t border-brand-border pt-6 flex items-center justify-end gap-4 mt-8">
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="flex items-center gap-2">
              <Save size={18} />
              Guardar Categoría
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
