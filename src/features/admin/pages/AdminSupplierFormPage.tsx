import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

// Para propósitos del frontend, asumiremos que existe una API para traer un proveedor
// Aquí simularemos con datos estáticos para la edición si es necesario.
const mockSupplier = {
  name: 'Distribuidora Tecnológica S.A.',
  contact: 'Martín Silva',
  email: 'ventas@distritec.com',
  phone: '+54 11 4444-5555',
  address: 'Av. Corrientes 1234, CABA'
};

export const AdminSupplierFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // Si estamos editando y tenemos un ID, cargamos los datos (simulación)
    if (isEditing) {
      setFormData(mockSupplier);
    }
  }, [isEditing, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;
    
    // Aquí iría la lógica para enviar a la API (POST o PUT)
    console.log('Guardando proveedor:', formData);
    
    // Volver a la lista
    navigate('/admin/suppliers');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/admin/suppliers')}
          className="p-2 text-brand-subtext hover:text-brand-text hover:bg-gray-100 rounded-full transition-colors"
          title="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h1>
          <p className="text-sm text-brand-subtext mt-1">
            {isEditing ? `Modificando los datos del proveedor ${id}` : 'Completa el formulario para registrar un nuevo proveedor en el sistema.'}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-sm border border-brand-border p-6 md:p-8">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text mb-2">
                Nombre de la Empresa <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: Distribuidora Tecnológica S.A."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                Contacto Principal <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: Martín Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">Teléfono</label>
              <input 
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: +54 11 4444-5555"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text mb-2">Correo Electrónico</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: ventas@empresa.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text mb-2">Ubicación / Dirección</label>
              <input 
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: Av. Corrientes 1234, CABA"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-brand-border">
            <button 
              type="button"
              onClick={() => navigate('/admin/suppliers')}
              className="px-6 py-2.5 text-brand-text font-medium border border-brand-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-dark transition-colors shadow-sm"
            >
              <Save size={18} />
              {isEditing ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
