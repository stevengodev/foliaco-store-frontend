import { axiosInstance } from '@/core/api/axiosInstance';

export type PaymentMethod = 'CREDIT_CARD' | 'NEQUI' | 'DAVIPLATA' | 'PSE';

export interface ProcessPaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
  amount?: number;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  method: string;
  externalReference: string;
  status: string;
  amount: number;
  createdAt: string;
}

export const paymentService = {
  processPayment: async (data: ProcessPaymentRequest): Promise<PaymentResponse> => {
    const response = await axiosInstance.post<PaymentResponse>('/payments', data);
    return response.data;
  },
};
