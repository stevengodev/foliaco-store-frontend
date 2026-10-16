import { axiosInstance } from '@/core/api/axiosInstance';

export interface CreatePurchaseOrderItemRequest {
  productId: number;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  notes?: string;
  items: CreatePurchaseOrderItemRequest[];
}

export const purchaseOrderService = {
  createPurchaseOrder: async (data: CreatePurchaseOrderRequest): Promise<number> => {
    const response = await axiosInstance.post<number>('/purchase-orders', data);
    return response.data;
  },

  receivePurchaseOrder: async (purchaseOrderId: number): Promise<void> => {
    await axiosInstance.post(`/purchase-orders/${purchaseOrderId}/items/receive`);
  },
};
