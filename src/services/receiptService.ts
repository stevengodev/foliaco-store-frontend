import { axiosInstance } from '@/core/api/axiosInstance';
import type { OrderItemResponse, ShippingAddressResponse } from './orderService';

export interface ReceiptResponse {
  receiptId: number;
  orderId: number;
  trackingNumber: string;
  status: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddressResponse | null;
  items?: OrderItemResponse[] | null;
}

export const receiptService = {
  getAllReceipts: async (): Promise<ReceiptResponse[]> => {
    const response = await axiosInstance.get<ReceiptResponse[]>('/receipts');
    return response.data;
  },

  getReceiptById: async (id: number): Promise<ReceiptResponse> => {
    const response = await axiosInstance.get<ReceiptResponse>(`/receipts/${id}`);
    return response.data;
  },

  createReceipt: async (orderId: number, trackingNumber: string): Promise<ReceiptResponse> => {
    const response = await axiosInstance.post<ReceiptResponse>('/receipts', null, {
      params: { orderId, trackingNumber },
    });
    return response.data;
  },
};
