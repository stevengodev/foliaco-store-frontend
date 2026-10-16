import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  X, 
  Save, 
  RefreshCw, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Boxes, 
  TrendingDown, 
  ShoppingCart,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  inventoryService, 
  type ProductInventoryResponse, 
  type StockMovementResponse 
} from '@/services/inventoryService';

export const AdminInventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPTIMO' | 'BAJO' | 'AGOTADO'>('ALL');
  const [inventory, setInventory] = useState<ProductInventoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal de Ajuste (Entrada / Salida)
  const [selectedItem, setSelectedItem] = useState<ProductInventoryResponse | null>(null);
  const [movementType, setMovementType] = useState<'ENTRADA' | 'SALIDA' | null>(null);
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal de Historial de Producto Individual
  const [historyItem, setHistoryItem] = useState<ProductInventoryResponse | null>(null);
  const [productMovements, setProductMovements] = useState<StockMovementResponse[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Notificación de Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const data = await inventoryService.getAllInventory();
      setInventory(data);
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Error al conectar con la API de inventario.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Métricas calculadas
  const totalProducts = inventory.length;
  const totalAvailableStock = inventory.reduce((acc, curr) => acc + (curr.stockAvailable || 0), 0);
  const lowStockCount = inventory.filter(item => item.stockAvailable > 0 && item.stockAvailable <= 15).length;
  const outOfStockCount = inventory.filter(item => item.stockAvailable <= 0).length;

  // Filtrado
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'OPTIMO') matchesStatus = item.stockAvailable > 15;
    else if (statusFilter === 'BAJO') matchesStatus = item.stockAvailable > 0 && item.stockAvailable <= 15;
    else if (statusFilter === 'AGOTADO') matchesStatus = item.stockAvailable <= 0;

    return matchesSearch && matchesStatus;
  });

  const openModal = (item: ProductInventoryResponse, type: 'ENTRADA' | 'SALIDA') => {
    setSelectedItem(item);
    setMovementType(type);
    setQuantity(1);
    setReason(type === 'ENTRADA' ? 'Reposición manual' : 'Ajuste manual');
    setReference(type === 'ENTRADA' ? `ENTRADA-${Date.now().toString().slice(-6)}` : `SALIDA-${Date.now().toString().slice(-6)}`);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setMovementType(null);
    setQuantity(1);
    setReason('');
    setReference('');
  };

  const handleSaveMovement = async () => {
    if (!selectedItem || !movementType || quantity === '' || quantity <= 0) return;

    try {
      setIsSaving(true);
      setFeedback(null);

      if (movementType === 'ENTRADA') {
        await inventoryService.addStock({
          productId: selectedItem.productId,
          quantity: Number(quantity),
          reason: reason.trim() || 'Entrada manual de inventario',
          reference: reference.trim() || 'MANUAL-IN'
        });

        setFeedback({
          type: 'success',
          message: `Se agregaron ${quantity} unidades al producto "${selectedItem.productName}".`
        });
      } else {
        await inventoryService.reduceStock({
          productId: selectedItem.productId,
          quantity: Number(quantity),
          reason: reason.trim() || 'Salida manual de inventario',
          reference: reference.trim() || 'MANUAL-OUT'
        });

        setFeedback({
          type: 'success',
          message: `Se descontaron ${quantity} unidades del producto "${selectedItem.productName}".`
        });
      }

      closeModal();
      await fetchInventory();
    } catch (err: any) {
      console.error('Error saving stock adjustment:', err);
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Error al actualizar el stock en el backend.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewProductHistory = async (item: ProductInventoryResponse) => {
    setHistoryItem(item);
    setLoadingHistory(true);
    try {
      const movements = await inventoryService.getMovementsByProduct(item.productId);
      setProductMovements(movements);
    } catch (err) {
      console.error('Error loading product movements:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text flex items-center gap-2">
            <Boxes className="text-brand-primary" size={26} />
            Control de Inventario
          </h1>
          <p className="text-sm text-brand-subtext mt-1">
            Supervisa y ajusta los niveles de stock de tus productos en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={fetchInventory}
            disabled={isLoading}
            className="p-2 border border-brand-border rounded-lg text-brand-subtext hover:text-brand-text hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Sincronizar inventario"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => navigate('/admin/inventory/movements')}
            className="flex items-center gap-2 bg-white border border-brand-border text-brand-text px-4 py-2 rounded-lg hover:bg-brand-bg transition-colors shadow-sm font-medium text-sm"
          >
            <History size={16} />
            Ver Todos los Movimientos
          </button>
          <button 
            onClick={() => navigate('/admin/suppliers/orders/new')}
            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors shadow-sm font-medium text-sm"
          >
            <ShoppingCart size={16} />
            Solicitar Abastecimiento
          </button>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedback && (
        <div 
          className={`mb-6 p-4 rounded-xl text-sm flex items-center justify-between border transition-all ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tarjetas KPI de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Productos Totales</span>
            <span className="p-2 bg-blue-50 text-brand-primary rounded-lg">
              <Package size={18} />
            </span>
          </div>
          <div className="text-2xl font-bold text-brand-text mt-2">{totalProducts}</div>
          <div className="text-xs text-brand-subtext mt-1">Registrados en catálogo</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Stock Disponible</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Boxes size={18} />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{totalAvailableStock} uds</div>
          <div className="text-xs text-brand-subtext mt-1">Listas para la venta al cliente</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Bajo Stock</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <TrendingDown size={18} />
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{lowStockCount}</div>
          <div className="text-xs text-brand-subtext mt-1">Menos de 15 unidades</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Agotados</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle size={18} />
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{outOfStockCount}</div>
          <div className="text-xs text-brand-subtext mt-1">Requieren abastecimiento urgente</div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-t-xl border border-brand-border border-b-0 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-brand-subtext" />
          </div>
          <input 
            type="text"
            className="pl-10 w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text"
            placeholder="Buscar por producto, SKU o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros rápidos por estado */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'OPTIMO', 'BAJO', 'AGOTADO'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === st 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-gray-100 text-brand-subtext hover:bg-gray-200'
              }`}
            >
              {st === 'ALL' && `Todos (${inventory.length})`}
              {st === 'OPTIMO' && `Óptimo (>15)`}
              {st === 'BAJO' && `Bajo Stock (${lowStockCount})`}
              {st === 'AGOTADO' && `Agotados (${outOfStockCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto shadow-xs">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-brand-subtext gap-3">
            <Loader2 className="animate-spin text-brand-primary" size={36} />
            <p className="text-sm font-medium">Consultando niveles de inventario en tiempo real...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-brand-border">
            <thead className="bg-brand-bg/60">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Stock Físico
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Reservado
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Disponible
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Ajuste Rápido
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-border">
              {filteredInventory.map((item) => {
                const stockVal = item.stockAvailable ?? 0;
                return (
                  <tr key={item.productId} className="hover:bg-brand-bg/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-brand-text">{item.productName}</div>
                      <div className="text-xs text-brand-subtext">{item.categoryName || 'General'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-brand-subtext">
                      {item.productSku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-brand-text">
                      {item.stockActual}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.stockReserved > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200" title="Unidades reservadas para compras en proceso">
                          {item.stockReserved}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-base font-bold text-brand-text">{stockVal}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {stockVal > 15 ? (
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Óptimo
                        </span>
                      ) : stockVal > 0 ? (
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Bajo Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          Agotado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-1.5">
                        <button 
                          onClick={() => openModal(item, 'ENTRADA')}
                          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-semibold" 
                          title="Ingresar Stock"
                        >
                          <ArrowDownRight size={14} />
                          <span>Entrada</span>
                        </button>
                        <button 
                          onClick={() => openModal(item, 'SALIDA')}
                          disabled={stockVal <= 0}
                          className="flex items-center gap-1 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed" 
                          title={stockVal <= 0 ? 'Sin stock disponible para retirar' : 'Retirar Stock'}
                        >
                          <ArrowUpRight size={14} />
                          <span>Salida</span>
                        </button>
                        <button 
                          onClick={() => handleViewProductHistory(item)}
                          className="p-1.5 text-brand-subtext hover:text-brand-text hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ver historial de movimientos de este producto"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {!isLoading && filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-brand-subtext">
                    <Boxes className="mx-auto text-gray-300 mb-2" size={36} />
                    <p className="font-medium text-brand-text">No se encontraron productos en el inventario</p>
                    <p className="text-xs text-brand-subtext mt-1">
                      {searchTerm || statusFilter !== 'ALL' 
                        ? 'Modifica los filtros de búsqueda para ver más resultados.' 
                        : 'Asegúrate de tener productos registrados en el catálogo.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Ajuste de Stock (Entrada / Salida) */}
      {selectedItem && movementType && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-brand-border w-full max-w-md p-6 relative flex flex-col">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-brand-subtext hover:text-brand-text p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-lg font-bold text-brand-text mb-1 flex items-center gap-2">
              {movementType === 'ENTRADA' ? (
                <>
                  <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                    <ArrowDownRight size={18} />
                  </span>
                  Registrar Entrada de Stock
                </>
              ) : (
                <>
                  <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                    <ArrowUpRight size={18} />
                  </span>
                  Registrar Salida de Stock
                </>
              )}
            </h2>
            <p className="text-xs text-brand-subtext mb-5">
              {movementType === 'ENTRADA' 
                ? 'Incrementa las unidades disponibles en bodega para este producto.' 
                : 'Descuenta unidades por merma, retiro manual o ajuste de auditoría.'}
            </p>
            
            <div className="bg-gray-50 rounded-xl p-3.5 mb-5 border border-gray-100">
              <span className="text-xs font-semibold text-brand-subtext uppercase tracking-wider block mb-0.5">Producto</span>
              <span className="font-bold text-brand-text block text-sm">{selectedItem.productName}</span>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 text-xs">
                <span className="text-brand-subtext font-mono">SKU: {selectedItem.productSku}</span>
                <span className="font-bold text-brand-primary">Stock Actual: {selectedItem.stockAvailable} uds</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">
                  Cantidad a {movementType === 'ENTRADA' ? 'Ingresar' : 'Retirar'} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number"
                  min="1"
                  max={movementType === 'SALIDA' ? selectedItem.stockAvailable : undefined}
                  className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-semibold"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))}
                  required
                />
                {movementType === 'SALIDA' && quantity !== '' && Number(quantity) > selectedItem.stockAvailable && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    No puedes retirar más del stock disponible ({selectedItem.stockAvailable} uds).
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">Motivo del Ajuste</label>
                <input 
                  type="text"
                  placeholder={movementType === 'ENTRADA' ? 'Ej: Reposición física de bodega' : 'Ej: Producto con empaque roto / Merma'}
                  className="w-full border border-brand-border rounded-lg px-3.5 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">Referencia o Folio</label>
                <input 
                  type="text"
                  placeholder="Ej: AJUSTE-OCTUBRE-01"
                  className="w-full border border-brand-border rounded-lg px-3.5 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
              <button 
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-brand-text border border-brand-border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSaveMovement}
                disabled={
                  isSaving || 
                  quantity === '' || 
                  Number(quantity) <= 0 || 
                  (movementType === 'SALIDA' && Number(quantity) > selectedItem.stockAvailable)
                }
                className={`flex items-center gap-2 px-5 py-2 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm disabled:opacity-50 ${
                  movementType === 'ENTRADA' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{isSaving ? 'Guardando...' : 'Confirmar Ajuste'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial de Movimientos de un Producto */}
      {historyItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-brand-border w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-bg/40">
              <div>
                <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
                  <History size={18} className="text-brand-primary" />
                  Movimientos de {historyItem.productName}
                </h3>
                <p className="text-xs text-brand-subtext mt-0.5">
                  SKU: {historyItem.productSku} • Stock Actual: {historyItem.stockAvailable} uds
                </p>
              </div>
              <button 
                onClick={() => setHistoryItem(null)}
                className="p-1.5 text-brand-subtext hover:text-brand-text hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {loadingHistory ? (
                <div className="py-12 flex flex-col items-center justify-center text-brand-subtext gap-2">
                  <Loader2 className="animate-spin text-brand-primary" size={28} />
                  <span className="text-xs font-medium">Cargando trazabilidad...</span>
                </div>
              ) : productMovements.length > 0 ? (
                <div className="border border-brand-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm divide-y divide-brand-border">
                    <thead className="bg-brand-bg/50 text-xs font-semibold text-brand-subtext uppercase">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Fecha</th>
                        <th className="px-4 py-2.5 text-center">Tipo</th>
                        <th className="px-4 py-2.5 text-right">Cantidad</th>
                        <th className="px-4 py-2.5 text-left">Motivo / Referencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {productMovements.map((mov) => (
                        <tr key={mov.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-xs text-brand-subtext whitespace-nowrap">
                            {new Date(mov.date).toLocaleString('es-CO')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {mov.type === 'IN' && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                ENTRADA
                              </span>
                            )}
                            {mov.type === 'OUT' && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">
                                SALIDA
                              </span>
                            )}
                            {mov.type === 'RESERVATION' && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                RESERVA
                              </span>
                            )}
                            {mov.type === 'RELEASE' && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                LIBERADO
                              </span>
                            )}
                            {mov.type === 'ADJUSTMENT' && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                AJUSTE
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-brand-text">
                            {mov.type === 'IN' || mov.type === 'RELEASE' ? `+${mov.quantity}` : `-${mov.quantity}`}
                          </td>
                          <td className="px-4 py-3 text-xs text-brand-subtext">
                            <div className="font-medium text-brand-text">{mov.reason || 'Sin motivo especificado'}</div>
                            <div className="text-[11px] text-gray-400 font-mono">{mov.reference}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-brand-subtext text-sm">
                  No se registran movimientos para este producto aún.
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-brand-border bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryItem(null)}
                className="px-4 py-2 text-sm font-medium text-brand-text border border-brand-border rounded-lg hover:bg-white transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
