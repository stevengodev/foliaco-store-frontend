import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowLeft, 
  RefreshCw, 
  Loader2, 
  History,
  Boxes
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  inventoryService, 
  type StockMovementResponse, 
  type StockMovementType 
} from '@/services/inventoryService';

export const AdminMovementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | StockMovementType>('ALL');
  const [movements, setMovements] = useState<StockMovementResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      setIsLoading(true);
      const data = await inventoryService.getMovements();
      setMovements(data);
    } catch (err) {
      console.error('Error fetching inventory movements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = 
      (movement.productName && movement.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (movement.productSku && movement.productSku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (movement.reference && movement.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (movement.reason && movement.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      String(movement.id).includes(searchTerm);

    const matchesType = typeFilter === 'ALL' || movement.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/inventory')}
            className="p-2 text-brand-subtext hover:text-brand-text hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver a Inventario"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-brand-text flex items-center gap-2">
              <History className="text-brand-primary" size={24} />
              Movimientos de Inventario
            </h1>
            <p className="text-sm text-brand-subtext mt-0.5">
              Trazabilidad completa de auditoría para entradas, salidas, compras y reservas de stock.
            </p>
          </div>
        </div>

        <button 
          onClick={fetchMovements}
          disabled={isLoading}
          className="flex items-center gap-2 border border-brand-border bg-white px-3.5 py-2 rounded-lg text-sm font-medium text-brand-subtext hover:text-brand-text hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Actualizar
        </button>
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
            placeholder="Buscar por producto, SKU, motivo o referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filtros rápidos por tipo */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'IN', 'OUT', 'RESERVATION', 'RELEASE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                typeFilter === t 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-gray-100 text-brand-subtext hover:bg-gray-200'
              }`}
            >
              {t === 'ALL' && `Todos (${movements.length})`}
              {t === 'IN' && `Entradas (${movements.filter(m => m.type === 'IN').length})`}
              {t === 'OUT' && `Salidas (${movements.filter(m => m.type === 'OUT').length})`}
              {t === 'RESERVATION' && `Reservas (${movements.filter(m => m.type === 'RESERVATION').length})`}
              {t === 'RELEASE' && `Liberados (${movements.filter(m => m.type === 'RELEASE').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-brand-border rounded-b-xl overflow-hidden overflow-x-auto shadow-xs">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-brand-subtext gap-3">
            <Loader2 className="animate-spin text-brand-primary" size={36} />
            <p className="text-sm font-medium">Cargando trazabilidad de movimientos...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-brand-border">
            <thead className="bg-brand-bg/60">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Cantidad
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Motivo
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-brand-subtext uppercase tracking-wider">
                  Referencia
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-border">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-brand-subtext">
                    {movement.date ? new Date(movement.date).toLocaleString('es-CO') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-brand-text">{movement.productName}</div>
                    <div className="text-xs text-brand-subtext font-mono">SKU: {movement.productSku || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {movement.type === 'IN' && (
                      <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ArrowDownRight size={13} />
                        ENTRADA
                      </span>
                    )}
                    {movement.type === 'OUT' && (
                      <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <ArrowUpRight size={13} />
                        SALIDA
                      </span>
                    )}
                    {movement.type === 'RESERVATION' && (
                      <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        RESERVA
                      </span>
                    )}
                    {movement.type === 'RELEASE' && (
                      <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        LIBERADO
                      </span>
                    )}
                    {movement.type === 'ADJUSTMENT' && (
                      <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        AJUSTE
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                    movement.type === 'IN' || movement.type === 'RELEASE' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {movement.type === 'IN' || movement.type === 'RELEASE' ? '+' : '-'}{movement.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-text">
                    {movement.reason || 'Sin motivo'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-brand-subtext">
                    {movement.reference}
                  </td>
                </tr>
              ))}
              
              {!isLoading && filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-brand-subtext">
                    <Boxes className="mx-auto text-gray-300 mb-2" size={36} />
                    <p className="font-medium text-brand-text">No se encontraron movimientos registrados</p>
                    <p className="text-xs text-brand-subtext mt-1">
                      {searchTerm || typeFilter !== 'ALL' 
                        ? 'Modifica los filtros de búsqueda para ver más movimientos.' 
                        : 'Los movimientos aparecerán aquí conforme recibas órdenes de compra o realices ajustes manuales.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
