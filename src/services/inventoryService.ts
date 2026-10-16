import { axiosInstance } from '@/core/api/axiosInstance';

export interface InventoryResponse {
  productId: number;
  stockActual: number;
  stockReserved: number;
  stockAvailable: number;
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

export const inventoryService = {
  getInventoryByProduct: async (productId: number): Promise<InventoryResponse> => {
    const response = await axiosInstance.get<InventoryResponse>(`/inventory/${productId}`);
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
