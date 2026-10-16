import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, Plus, X, FileText } from 'lucide-react';
import { receiptService, type ReceiptResponse } from '@/services/receiptService';
import { Button } from '@/components/common/Button/Button';

export const AdminReceiptsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [receipts, setReceipts] = useState<ReceiptResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal para nuevo remito
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');
  const [newTracking, setNewTracking] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReceipts = async () => {
    try {
      setIsLoading(true);
      const data = await receiptService.getAllReceipts();
      setReceipts(data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderId || !newTracking) return;

    try {
      setIsSubmitting(true);
      const created = await receiptService.createReceipt(Number(newOrderId), newTracking);
      setReceipts(prev => [created, ...prev]);
      setIsModalOpen(false);
      setNewOrderId('');
      setNewTracking('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al crear remito. Asegúrate de que el ID del pedido existe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GENERATED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Generado</span>;
      case 'IN_TRANSIT':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">En Tránsito</span>;
      case 'DELIVERED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Entregado</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const filteredReceipts = receipts.filter(receipt => 
    String(receipt.receiptId).includes(searchTerm) || 
    String(receipt.orderId).includes(searchTerm) ||
    receipt.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (receipt.customerName && receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePrintReceipt = (receipt: ReceiptResponse) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Remito de Despacho #${receipt.receiptId}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #FF6B00; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .section-title { font-weight: bold; font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
            th { background-color: #f9fafb; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Foliaco Store</div>
            <div style="text-align: right;">
              <h2 style="margin:0;">Remito #${receipt.receiptId}</h2>
              <p style="margin:5px 0 0 0; color:#666;">Fecha: ${receipt.createdAt ? new Date(receipt.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p style="margin:5px 0 0 0; color:#666;">Estado: ${receipt.status}</p>
            </div>
          </div>
          
          <div class="details">
            <div>
              <div class="section-title">Destinatario</div>
              <p style="margin: 4px 0;"><strong>Cliente:</strong> ${receipt.customerName || 'Cliente'}</p>
              <p style="margin: 4px 0;"><strong>Dirección:</strong> ${receipt.shippingAddress ? `${receipt.shippingAddress.address}, ${receipt.shippingAddress.city}` : 'Dirección registrada'}</p>
              <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${receipt.customerPhone || 'N/A'}</p>
            </div>
            <div>
              <div class="section-title">Información de Envío</div>
              <p style="margin: 4px 0;"><strong>Pedido Asociado:</strong> #${receipt.orderId}</p>
              <p style="margin: 4px 0;"><strong>Número de Guía:</strong> ${receipt.trackingNumber}</p>
            </div>
          </div>

          <div class="section-title">Detalle de Mercancía</div>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              ${(receipt.items || []).map(item => `
                <tr>
                  <td>${item.productName || `Item #${item.productId}`}</td>
                  <td>${item.quantity}</td>
                </tr>
              `).join('')}
              ${(!receipt.items || receipt.items.length === 0) ? `
                <tr>
                  <td colspan="2" style="text-align:center; color:#999;">Ver detalle en la orden #${receipt.orderId}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>

          <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div style="border-top: 1px solid #333; padding-top: 10px; text-align: center;">
              <strong>Firma de Despacho (Bodega)</strong>
            </div>
            <div style="border-top: 1px solid #333; padding-top: 10px; text-align: center;">
              <strong>Firma de Recepción (Cliente / Transportista)</strong>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Gestión de Remitos</h1>
          <p className="text-sm text-brand-subtext mt-1">Controla los comprobantes oficiales de despacho y entrega de mercancía.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 bg-brand-primary hover:bg-brand-dark"
        >
          <Plus size={18} />
          Nuevo Remito
        </Button>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-t-xl border border-brand-border border-b-0 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-brand-subtext" />
          </div>
          <input 
            type="text"
            className="pl-10 w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-brand-text"
            placeholder="Buscar por ID de remito, orden o tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={fetchReceipts}
          className="flex items-center gap-2 text-brand-subtext border border-brand-border rounded-lg px-4 py-2 hover:bg-brand-bg transition-colors w-full sm:w-auto justify-center text-sm"
        >
          <Filter size={16} />
          Actualizar Lista
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                ID Remito
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                ID Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Seguimiento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-brand-subtext uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-subtext">
                  Cargando remitos...
                </td>
              </tr>
            ) : filteredReceipts.map((receipt) => {
              const dateStr = receipt.createdAt 
                ? new Date(receipt.createdAt).toLocaleDateString()
                : 'Hoy';

              return (
                <tr key={receipt.receiptId} className="hover:bg-brand-bg transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-text">
                    #{receipt.receiptId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">
                    Pedido #{receipt.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                    {dateStr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text font-mono">
                    {receipt.trackingNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(receipt.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handlePrintReceipt(receipt)}
                      className="text-brand-primary hover:text-brand-dark inline-flex items-center gap-1 transition-colors"
                      title="Imprimir Remito"
                    >
                      <Eye size={18} />
                      <span>Comprobante</span>
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {!isLoading && filteredReceipts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-subtext">
                  No se encontraron remitos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Nuevo Remito */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-brand-border w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-brand-subtext hover:text-brand-text"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-brand-primary" size={24} />
              <h3 className="text-lg font-bold text-brand-text">Crear Nuevo Remito</h3>
            </div>
            <p className="text-sm text-brand-subtext mb-4">
              Ingresa el ID del pedido y el código de seguimiento correspondiente para generar el despacho.
            </p>

            <form onSubmit={handleCreateReceipt} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  ID del Pedido <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number"
                  required
                  min="1"
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                  className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Ej: 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  Número de Guía / Tracking <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                  className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Ej: TRK-123456789"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-brand-subtext border border-brand-border rounded-lg hover:bg-brand-bg transition-colors"
                >
                  Cancelar
                </button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Generar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
