import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supplierService } from '@/services/supplierService';

export const AdminSupplierFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    names: '',
    lastNames: '',
    taxId: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const loadSupplier = async () => {
      if (isEditing && id) {
        try {
          setIsLoading(true);
          setErrorMessage(null);
          const supplier = await supplierService.getSupplierById(Number(id));
          setFormData({
            company: supplier.company || '',
            names: supplier.names || '',
            lastNames: supplier.lastNames || '',
            taxId: supplier.taxId || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
          });
        } catch (err: any) {
          console.error('Error loading supplier:', err);
          try {
            const list = await supplierService.getSuppliers();
            const found = list.find(s => s.id === Number(id));
            if (found) {
              setFormData({
                company: found.company || '',
                names: found.names || '',
                lastNames: found.lastNames || '',
                taxId: found.taxId || '',
                email: found.email || '',
                phone: found.phone || '',
              });
              return;
            }
          } catch (listErr) {
            console.error('Fallback getSuppliers also failed:', listErr);
          }
          setErrorMessage(err.response?.data?.message || 'Error al cargar los datos del proveedor.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadSupplier();
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.names || !formData.email) return;

    try {
      setIsSaving(true);
      setErrorMessage(null);
      const payload = {
        company: formData.company,
        names: formData.names,
        lastNames: formData.lastNames || 'N/A',
        taxId: formData.taxId || 'N/A',
        email: formData.email,
        phone: formData.phone || 'N/A',
      };

      if (isEditing && id) {
        await supplierService.updateSupplier(Number(id), payload);
      } else {
        await supplierService.createSupplier(payload);
      }

      navigate('/admin/suppliers');
    } catch (err: any) {
      console.error('Error saving supplier:', err);
      setErrorMessage(err.response?.data?.message || 'Error al guardar el proveedor');
    } finally {
      setIsSaving(false);
    }
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
            {isEditing ? `Modificando los datos del proveedor #${id}` : 'Completa el formulario para registrar un nuevo proveedor oficial.'}
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-sm border border-brand-border p-6 md:p-8">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-brand-subtext gap-3">
            <Loader2 className="animate-spin text-brand-primary" size={36} />
            <p className="text-sm font-medium">Cargando información del proveedor...</p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Razón Social / Nombre de la Empresa <span className="text-red-500">*</span>
                </label>
              <input 
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: Distribuidora Tecnológica S.A."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                Nombre del Contacto <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="names"
                value={formData.names}
                onChange={handleInputChange}
                required
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: Martín"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                Apellidos del Contacto
              </label>
              <input 
                type="text"
                name="lastNames"
                value={formData.lastNames}
                onChange={handleInputChange}
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                NIT / Identificación Fiscal
              </label>
              <input 
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: 900.123.456-7"
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
                placeholder="Ej: +57 310 444 5555"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text mb-2">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: ventas@distritec.com"
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
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-dark transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Guardando...' : isEditing ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
