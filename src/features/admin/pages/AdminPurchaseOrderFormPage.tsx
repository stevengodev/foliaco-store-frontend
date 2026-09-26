import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';

// Simulamos la carga de una orden para edición
const mockPurchaseOrder = {
  supplier: 'Distribuidora Tecnológica S.A.',
  date: '2026-08-28',
  notes: 'Entrega prioritaria',
  items: [
    { id: 1, product: 'Laptop Pro', quantity: 10, unitPrice: 1200 },
    { id: 2, product: 'Mouse Inalámbrico', quantity: 50, unitPrice: 25 },
  ]
};

export const AdminPurchaseOrderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [items, setItems] = useState<{ id: number, product: string, quantity: number, unitPrice: number }[]>([]);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        supplier: mockPurchaseOrder.supplier,
        date: mockPurchaseOrder.date,
        notes: mockPurchaseOrder.notes
      });
      setItems(mockPurchaseOrder.items);
    } else {
      // Orden nueva inicia con 1 item vacío
      setItems([{ id: Date.now(), product: '', quantity: 1, unitPrice: 0 }]);
    }
  }, [isEditing, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: number, field: string, value: string | number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const totalOrder = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier || items.length === 0) return;
    
    const newOrder = {
      ...formData,
      items,
      total: totalOrder
    };
    
    console.log('Guardando orden de compra:', newOrder);
    navigate('/admin/suppliers/orders');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/admin/suppliers/orders')}
          className="p-2 text-brand-subtext hover:text-brand-text hover:bg-gray-100 rounded-full transition-colors"
          title="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            {isEditing ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
          </h1>
          <p className="text-sm text-brand-subtext mt-1">
            {isEditing ? `Modificando la orden ${id}` : 'Solicita stock a tus proveedores.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Datos Generales */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-border p-6 mb-6">
          <h2 className="text-lg font-bold text-brand-text mb-4 border-b border-brand-border pb-2">Datos de la Orden</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                Proveedor <span className="text-red-500">*</span>
              </label>
              <select 
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                required
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              >
                <option value="">Selecciona un proveedor</option>
                <option value="Distribuidora Tecnológica S.A.">Distribuidora Tecnológica S.A.</option>
                <option value="Importadora Global">Importadora Global</option>
                <option value="Electro Mayorista SRL">Electro Mayorista SRL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                Fecha Estimada / Solicitud <span className="text-red-500">*</span>
              </label>
              <input 
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text mb-2">Notas Adicionales</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Instrucciones especiales para el proveedor..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Detalle de Productos */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-border p-6 mb-6">
          <div className="flex justify-between items-center mb-4 border-b border-brand-border pb-2">
            <h2 className="text-lg font-bold text-brand-text">Detalle de Productos</h2>
            <button 
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-sm text-brand-primary hover:text-brand-dark font-medium transition-colors"
            >
              <Plus size={16} />
              Agregar Producto
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                  <th className="pb-3 pr-4 w-2/5">Producto</th>
                  <th className="pb-3 pr-4 w-1/5">Cantidad</th>
                  <th className="pb-3 pr-4 w-1/5">Costo Unitario ($)</th>
                  <th className="pb-3 pr-4 w-1/5 text-right">Subtotal</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-4">
                      <input 
                        type="text"
                        value={item.product}
                        onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                        required
                        placeholder="Nombre o código del producto"
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                      />
                    </td>
                    <td className="py-3 pr-4 text-right font-medium text-brand-text">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className={`p-1.5 rounded transition-colors ${items.length === 1 ? 'text-gray-300' : 'text-red-500 hover:bg-red-50'}`}
                        title="Eliminar fila"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t border-brand-border">
            <div className="text-right">
              <span className="text-sm font-medium text-brand-subtext mr-4">Total de la Orden:</span>
              <span className="text-2xl font-bold text-brand-primary">${totalOrder.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex justify-end gap-3 mt-8">
          <button 
            type="button"
            onClick={() => navigate('/admin/suppliers/orders')}
            className="px-6 py-2.5 text-brand-text font-medium border border-brand-border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-dark transition-colors shadow-sm"
          >
            <Save size={18} />
            {isEditing ? 'Actualizar Orden' : 'Emitir Orden'}
          </button>
        </div>
      </form>
    </div>
  );
};
