import { axiosInstance } from '@/core/api/axiosInstance';

export interface ProductInventoryResponse {
  productId: number;
  productName: string;
  productSku: string;
  categoryName?: string;
  stockActual: number;
  stockReserved: number;
  stockAvailable: number;
  updatedAt?: string;
}

export interface InventoryResponse {
  productId: number;
  stockActual: number;
  stockReserved: number;
  stockAvailable: number;
}

export interface AddStockRequest {
  productId: number;
  quantity: number;
  reason?: string;
  reference?: string;
}

export interface ReduceStockRequest {
  productId: number;
  quantity: number;
  reason?: string;
  reference?: string;
}

export interface ReserveStockRequest {
  productId: number;
  quantity: number;
  reference: string;
}

export interface ReleaseStockRequest {
  productId: number;
  quantity: number;
  reference: string;
}

export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'RESERVATION' | 'RELEASE';

export interface StockMovementResponse {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  reference: string;
  date: string;
}

export const inventoryService = {
  getAllInventory: async (): Promise<ProductInventoryResponse[]> => {
    const response = await axiosInstance.get<ProductInventoryResponse[]>('/inventory');
    return response.data;
  },

  getInventoryByProduct: async (productId: number): Promise<InventoryResponse> => {
    const response = await axiosInstance.get<InventoryResponse>(`/inventory/${productId}`);
    return response.data;
  },

  addStock: async (data: AddStockRequest): Promise<void> => {
    await axiosInstance.post('/inventory/add', data);
  },

  reduceStock: async (data: ReduceStockRequest): Promise<void> => {
    await axiosInstance.post('/inventory/reduce', data);
  },

  getMovements: async (): Promise<StockMovementResponse[]> => {
    const response = await axiosInstance.get<StockMovementResponse[]>('/inventory/movements');
    return response.data;
  },

  getMovementsByProduct: async (productId: number): Promise<StockMovementResponse[]> => {
    const response = await axiosInstance.get<StockMovementResponse[]>(`/inventory/movements/${productId}`);
    return response.data;
  },

  reserveStock: async (data: ReserveStockRequest): Promise<void> => {
    await axiosInstance.post('/inventory/reserve', data);
  },

  releaseStock: async (data: ReleaseStockRequest): Promise<void> => {
    await axiosInstance.post('/inventory/release', data);
  },

  confirmStock: async (productId: number, quantity: number, reference: string): Promise<void> => {
    await axiosInstance.post('/inventory/confirm', null, {
      params: { productId, quantity, reference },
    });
  },
};
