import { axiosInstance } from '@/core/api/axiosInstance';

export interface CreateShippingAddressRequest {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface ShippingAddressResponse {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  orderId: number;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;
  total: number;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddressResponse;
  items: OrderItemResponse[];
}

export interface CreateOrderResponse {
  orderId: number;
  status: string;
  total: number;
}

export const orderService = {
  createAddress: async (data: CreateShippingAddressRequest): Promise<ShippingAddressResponse> => {
    const response = await axiosInstance.post<ShippingAddressResponse>('/orders/addresses', data);
    return response.data;
  },

  createOrder: async (addressId: number): Promise<CreateOrderResponse> => {
    const response = await axiosInstance.post<CreateOrderResponse>('/orders', null, {
      params: { addressId },
    });
    return response.data;
  },

  getMyOrders: async (): Promise<OrderResponse[]> => {
    const response = await axiosInstance.get<OrderResponse[]>('/orders');
    return response.data;
  },

  getOrderById: async (orderId: number): Promise<OrderResponse> => {
    const response = await axiosInstance.get<OrderResponse>(`/orders/${orderId}`);
    return response.data;
  },

  markAsShipped: async (orderId: number): Promise<OrderResponse> => {
    const response = await axiosInstance.put<OrderResponse>(`/orders/${orderId}/ship`);
    return response.data;
  },

  markAsDelivered: async (orderId: number): Promise<OrderResponse> => {
    const response = await axiosInstance.put<OrderResponse>(`/orders/${orderId}/deliver`);
    return response.data;
  },
};
