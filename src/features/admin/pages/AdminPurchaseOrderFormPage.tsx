import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { supplierService, type SupplierResponse } from '@/services/supplierService';
import { catalogService } from '@/services/catalogService';
import { purchaseOrderService } from '@/services/purchaseOrderService';
import type { Product } from '@/features/catalog/types/product';

interface FormItem {
  id: number;
  productId: number;
  quantity: number;
  unitCost: number;
}

export const AdminPurchaseOrderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedSupplierId, setSelectedSupplierId] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FormItem[]>([
    { id: Date.now(), productId: 0, quantity: 1, unitCost: 0 }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [suppliersData, productsData] = await Promise.all([
          supplierService.getSuppliers(),
          catalogService.getProducts()
        ]);
        setSuppliers(suppliersData);
        setProducts(productsData);

        if (productsData.length > 0) {
          setItems([
            { id: Date.now(), productId: productsData[0].id, quantity: 10, unitCost: productsData[0].price * 0.7 }
          ]);
        }
      } catch (err) {
        console.error('Error loading suppliers or products:', err);
      }
    };

    loadData();
  }, []);

  const handleProductChange = (itemId: number, productId: number) => {
    const selectedProd = products.find(p => p.id === productId);
    const suggestedCost = selectedProd ? selectedProd.price * 0.7 : 0;

    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, productId, unitCost: suggestedCost }
        : item
    ));
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const handleCostChange = (itemId: number, unitCost: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, unitCost: Math.max(0, unitCost) } : item
    ));
  };

  const addItem = () => {
    const defaultProduct = products[0];
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        productId: defaultProduct ? defaultProduct.id : 0,
        quantity: 1,
        unitCost: defaultProduct ? defaultProduct.price * 0.7 : 0
      }
    ]);
  };

  const removeItem = (itemId: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const totalOrder = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      setErrorMessage('Por favor selecciona un proveedor.');
      return;
    }

    if (items.some(item => !item.productId || item.quantity <= 0)) {
      setErrorMessage('Por favor asegúrate de que todos los productos y cantidades sean válidos.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      await purchaseOrderService.createPurchaseOrder({
        supplierId: Number(selectedSupplierId),
        notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitCost
        }))
      });

      alert('¡Orden de compra emitida correctamente!');
      navigate('/admin/suppliers/orders');
    } catch (err: any) {
      console.error('Error creating purchase order:', err);
      const detail = err.response?.data?.detail || err.response?.data?.message || err.message || 'Error al emitir la orden de compra.';
      setErrorMessage(detail);
    } finally {
      setIsSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-brand-text">Nueva Orden de Compra</h1>
          <p className="text-sm text-brand-subtext mt-1">
            Solicita abastecimiento de inventario a tus proveedores registrados.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Datos Generales */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-border p-6 mb-6">
          <h2 className="text-lg font-bold text-brand-text mb-4 border-b border-brand-border pb-2">
            Datos de la Orden
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                Proveedor Registrado <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value === '' ? '' : Number(e.target.value))}
                required
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              >
                <option value="">Selecciona un proveedor</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.company} ({s.email || 'Sin correo'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                Fecha de Emisión
              </label>
              <input 
                type="text"
                disabled
                value={new Date().toLocaleDateString('es-CO')}
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-subtext bg-brand-bg/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text mb-2">Notas Adicionales</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Instrucciones para la entrega de stock o condiciones especiales..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Detalle de Productos */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-border p-6 mb-6">
          <div className="flex justify-between items-center mb-4 border-b border-brand-border pb-2">
            <h2 className="text-lg font-bold text-brand-text">Detalle de Productos a Abastecer</h2>
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
                  <th className="pb-3 pr-4 w-2/5">Producto del Catálogo</th>
                  <th className="pb-3 pr-4 w-1/5">Cantidad</th>
                  <th className="pb-3 pr-4 w-1/5">Costo Unitario ($)</th>
                  <th className="pb-3 pr-4 w-1/5 text-right">Subtotal</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-4">
                      <select 
                        value={item.productId}
                        onChange={(e) => handleProductChange(item.id, Number(e.target.value))}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-primary bg-white text-brand-text"
                      >
                        <option value={0}>Selecciona producto...</option>
                        {products.map(prod => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} (SKU: {prod.sku})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <input 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitCost}
                        onChange={(e) => handleCostChange(item.id, parseFloat(e.target.value) || 0)}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </td>
                    <td className="py-3 pr-4 text-right font-medium text-brand-text">
                      ${(item.quantity * item.unitCost).toFixed(2)}
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
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-dark transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Emitiendo Orden...' : 'Emitir Orden de Compra'}
          </button>
        </div>
      </form>
    </div>
  );
};
