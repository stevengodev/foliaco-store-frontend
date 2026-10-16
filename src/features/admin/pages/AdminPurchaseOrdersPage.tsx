import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Building2, 
  Calendar, 
  Package, 
  X, 
  RefreshCw,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { useNavigate } from 'react-router-dom';
import { 
  purchaseOrderService, 
  type PurchaseOrderResponse, 
  type PurchaseOrderStatus 
} from '@/services/purchaseOrderService';

export const AdminPurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PurchaseOrderStatus>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderResponse | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await purchaseOrderService.getPurchaseOrders();
      setOrders(data);
    } catch (err: any) {
      console.error('Error fetching purchase orders:', err);
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Error al cargar las órdenes de compra.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReceive = async (order: PurchaseOrderResponse) => {
    if (!window.confirm(`¿Confirmas la recepción de la orden ${order.number}?\n\nEsta acción sumará automáticamente las cantidades al stock de inventario de cada producto.`)) {
      return;
    }

    try {
      setActionLoadingId(order.id);
      await purchaseOrderService.receivePurchaseOrder(order.id);
      
      // Actualizar orden en la lista localmente
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'RECEIVED' } : o));
      
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder(prev => prev ? { ...prev, status: 'RECEIVED' } : null);
      }

      setFeedbackMessage({
        type: 'success',
        text: `¡Orden ${order.number} recibida con éxito! El inventario ha sido actualizado.`
      });
      
      // Refrescar para asegurar sincronización completa de detalles
      fetchOrders();
    } catch (err: any) {
      console.error('Error receiving purchase order:', err);
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Error al recibir la orden de compra.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (order: PurchaseOrderResponse) => {
    if (!window.confirm(`¿Estás seguro de cancelar la orden ${order.number}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setActionLoadingId(order.id);
      await purchaseOrderService.cancelPurchaseOrder(order.id);
      
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'CANCELED' } : o));
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder(prev => prev ? { ...prev, status: 'CANCELED' } : null);
      }

      setFeedbackMessage({
        type: 'success',
        text: `La orden ${order.number} ha sido cancelada.`
      });
    } catch (err: any) {
      console.error('Error canceling purchase order:', err);
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Error al cancelar la orden de compra.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.number && order.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.supplierCompany && order.supplierCompany.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.supplierContact && order.supplierContact.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pendiente de Entrega
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Recibida en Inventario
          </span>
        );
      case 'CANCELED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={13} className="text-rose-600" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text flex items-center gap-2">
            <Receipt className="text-brand-primary" size={26} />
            Órdenes de Compra
          </h1>
          <p className="text-sm text-brand-subtext mt-1">
            Abastece tu inventario solicitando mercancía a proveedores registrados y gestiona las recepciones.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="p-2.5 border border-brand-border rounded-lg text-brand-subtext hover:text-brand-text hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Recargar órdenes"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <Button 
            className="shrink-0 bg-brand-primary hover:bg-brand-dark flex-1 md:flex-none"
            onClick={() => navigate('/admin/suppliers/orders/new')}
          >
            <Plus size={18} />
            Nueva Orden de Compra
          </Button>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedbackMessage && (
        <div 
          className={`mb-6 p-4 rounded-xl text-sm flex items-center justify-between border transition-all ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{feedbackMessage.text}</span>
          </div>
          <button 
            onClick={() => setFeedbackMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-t-xl border border-brand-border border-b-0 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-brand-subtext" />
          </div>
          <input 
            type="text"
            className="pl-10 w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text"
            placeholder="Buscar por número de orden o proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filtros rápidos por estado */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'SENT', 'RECEIVED', 'CANCELED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === st 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-gray-100 text-brand-subtext hover:bg-gray-200'
              }`}
            >
              {st === 'ALL' && `Todas (${orders.length})`}
              {st === 'SENT' && `Pendientes (${orders.filter(o => o.status === 'SENT').length})`}
              {st === 'RECEIVED' && `Recibidas (${orders.filter(o => o.status === 'RECEIVED').length})`}
              {st === 'CANCELED' && `Canceladas (${orders.filter(o => o.status === 'CANCELED').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-brand-subtext gap-3">
            <Loader2 className="animate-spin text-brand-primary" size={36} />
            <p className="text-sm font-medium">Cargando órdenes de compra registradas...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-brand-border">
            <thead className="bg-brand-bg/60">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Nº Orden
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Proveedor
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Fecha Emisión
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Unidades
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-brand-text">{order.number}</div>
                    <div className="text-xs text-brand-subtext">ID Interno #{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brand-text">{order.supplierCompany}</div>
                    <div className="text-xs text-brand-subtext">{order.supplierContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-subtext">
                    {order.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-brand-text">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs">
                      {order.totalItemsCount || (order.items ? order.items.reduce((s, i) => s + i.quantityOrdered, 0) : 0)} unid.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-brand-primary">
                    ${Number(order.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* Botón Recibir en inventario */}
                      {order.status === 'SENT' && (
                        <button 
                          onClick={() => handleReceive(order)}
                          disabled={actionLoadingId === order.id}
                          className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                          title="Recibir orden e ingresar productos al inventario"
                        >
                          {actionLoadingId === order.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          <span>Recibir Stock</span>
                        </button>
                      )}

                      {/* Botón Ver Detalle */}
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-brand-subtext hover:text-brand-text p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ver detalle de la orden"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Botón Cancelar */}
                      {order.status === 'SENT' && (
                        <button 
                          onClick={() => handleCancel(order)}
                          disabled={actionLoadingId === order.id}
                          className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Cancelar orden"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {!isLoading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-brand-subtext">
                    <Package className="mx-auto text-gray-300 mb-2" size={40} />
                    <p className="font-medium text-brand-text">No se encontraron órdenes de compra</p>
                    <p className="text-xs text-brand-subtext mt-1">
                      {searchTerm || statusFilter !== 'ALL' 
                        ? 'Prueba modificando tus filtros o término de búsqueda.' 
                        : 'Comienza creando tu primera orden de abastecimiento con tus proveedores.'}
                    </p>
                    {(!searchTerm && statusFilter === 'ALL') && (
                      <Button 
                        className="mt-4 bg-brand-primary hover:bg-brand-dark mx-auto"
                        onClick={() => navigate('/admin/suppliers/orders/new')}
                      >
                        <Plus size={16} />
                        Crear Orden de Compra
                      </Button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Detalle de Orden */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-brand-border w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-bg/40">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-brand-text">
                    Orden {selectedOrder.number}
                  </h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-brand-subtext mt-0.5">
                  Emitida el {selectedOrder.issueDate} • ID #{selectedOrder.id}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-brand-subtext hover:text-brand-text hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Información Proveedor */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-brand-subtext uppercase tracking-wider block mb-1">
                    Proveedor
                  </span>
                  <div className="font-bold text-brand-text flex items-center gap-1.5">
                    <Building2 size={16} className="text-brand-primary" />
                    {selectedOrder.supplierCompany}
                  </div>
                  <div className="text-xs text-brand-subtext mt-1">
                    Contacto: {selectedOrder.supplierContact}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-brand-subtext uppercase tracking-wider block mb-1">
                    Contacto y Comunicación
                  </span>
                  <div className="text-sm text-brand-text">
                    {selectedOrder.supplierEmail || 'Sin correo registrado'}
                  </div>
                  <div className="text-xs text-brand-subtext mt-1">
                    Tel: {selectedOrder.supplierPhone || 'No registrado'}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="md:col-span-2 pt-2 border-t border-gray-200 text-xs">
                    <span className="font-semibold text-brand-text">Notas adicionales: </span>
                    <span className="text-brand-subtext">{selectedOrder.notes}</span>
                  </div>
                )}
              </div>

              {/* Detalle de Productos */}
              <div>
                <h4 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                  <Package size={16} className="text-brand-primary" />
                  Productos Pedidos
                </h4>
                <div className="border border-brand-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm divide-y divide-brand-border">
                    <thead className="bg-brand-bg/50 text-xs font-semibold text-brand-subtext uppercase">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Producto</th>
                        <th className="px-4 py-2.5 text-center">Pedidas</th>
                        <th className="px-4 py-2.5 text-center">Recibidas</th>
                        <th className="px-4 py-2.5 text-right">Costo Unit.</th>
                        <th className="px-4 py-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3">
                              <div className="font-semibold text-brand-text">{item.productName}</div>
                              <div className="text-xs text-brand-subtext">SKU: {item.productSku || 'N/A'}</div>
                            </td>
                            <td className="px-4 py-3 text-center font-medium">
                              {item.quantityOrdered}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                item.quantityReceived >= item.quantityOrdered 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {item.quantityReceived || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-brand-subtext">
                              ${Number(item.unitCost).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-brand-text">
                              ${Number(item.subtotal).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-brand-subtext">
                            No hay productos detallados registrados en esta orden.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-end pt-2">
                <div className="bg-brand-bg/40 border border-brand-border rounded-xl p-4 w-full md:w-64 text-right">
                  <div className="text-xs text-brand-subtext">Costo Total de la Compra</div>
                  <div className="text-2xl font-bold text-brand-primary mt-1">
                    ${Number(selectedOrder.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-brand-border bg-gray-50 flex items-center justify-between">
              <div>
                {selectedOrder.status === 'SENT' && (
                  <button
                    onClick={() => handleCancel(selectedOrder)}
                    disabled={actionLoadingId === selectedOrder.id}
                    className="text-xs font-medium text-rose-600 hover:text-rose-800 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar Orden
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-sm font-medium text-brand-text border border-brand-border rounded-lg hover:bg-white transition-colors"
                >
                  Cerrar
                </button>

                {selectedOrder.status === 'SENT' && (
                  <button
                    onClick={() => handleReceive(selectedOrder)}
                    disabled={actionLoadingId === selectedOrder.id}
                    className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                  >
                    {actionLoadingId === selectedOrder.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    <span>Recibir Stock en Inventario</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
