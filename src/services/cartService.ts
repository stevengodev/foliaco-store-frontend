import { axiosInstance } from '@/core/api/axiosInstance';

export interface CartItemResponse {
  productId: number;
  quantity: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItemResponse[];
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const response = await axiosInstance.get<CartResponse>('/cart');
    return response.data;
  },

  addItem: async (productId: number, quantity: number = 1): Promise<CartResponse> => {
    const response = await axiosInstance.post<CartResponse>('/cart/items', {
      productId,
      quantity,
    });
    return response.data;
  },

  updateItem: async (productId: number, quantity: number): Promise<CartResponse> => {
    const response = await axiosInstance.put<CartResponse>(`/cart/items/${productId}`, {
      quantity,
    });
    return response.data;
  },

  removeItem: async (productId: number): Promise<void> => {
    await axiosInstance.delete(`/cart/items/${productId}`);
  },
};
