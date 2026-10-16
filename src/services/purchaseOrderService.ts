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

export interface PurchaseOrderItemResponse {
  productId: number;
  productName: string;
  productSku: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  subtotal: number;
  receivedAt?: string;
}

export type PurchaseOrderStatus = 'SENT' | 'RECEIVED' | 'CANCELED';

export interface PurchaseOrderResponse {
  id: number;
  number: string;
  issueDate: string;
  status: PurchaseOrderStatus;
  total: number;
  notes?: string;
  supplierId: number;
  supplierCompany: string;
  supplierContact: string;
  supplierEmail?: string;
  supplierPhone?: string;
  totalItemsCount: number;
  items: PurchaseOrderItemResponse[];
}

export const purchaseOrderService = {
  getPurchaseOrders: async (): Promise<PurchaseOrderResponse[]> => {
    const response = await axiosInstance.get<PurchaseOrderResponse[]>('/purchase-orders');
    return response.data;
  },

  getPurchaseOrderById: async (id: number): Promise<PurchaseOrderResponse> => {
    const response = await axiosInstance.get<PurchaseOrderResponse>(`/purchase-orders/${id}`);
    return response.data;
  },

  createPurchaseOrder: async (data: CreatePurchaseOrderRequest): Promise<number> => {
    const response = await axiosInstance.post<number>('/purchase-orders', data);
    return response.data;
  },

  receivePurchaseOrder: async (purchaseOrderId: number): Promise<void> => {
    await axiosInstance.post(`/purchase-orders/${purchaseOrderId}/items/receive`);
  },

  cancelPurchaseOrder: async (purchaseOrderId: number): Promise<void> => {
    await axiosInstance.post(`/purchase-orders/${purchaseOrderId}/cancel`);
  },
};
