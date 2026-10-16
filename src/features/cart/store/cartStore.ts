import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/features/catalog/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      setIsCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen }),
      
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const maxStock = product.stock ?? 99;
          const existingItem = state.items.find((item) => item.product.id === product.id);
          
          if (existingItem) {
            // Si ya existe, sumamos la cantidad (respetando el stock máximo)
            const newQuantity = Math.min(existingItem.quantity + quantity, maxStock);
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: newQuantity } : item
              ),
            };
          }
          
          // Si es nuevo, lo agregamos (asegurando que no pida más del stock inicial)
          return { items: [...state.items, { product, quantity: Math.min(quantity, maxStock) }] };
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              const maxStock = item.product.stock ?? 99;
              // Validamos que no exceda el stock ni sea menor a 1
              const safeQuantity = Math.max(1, Math.min(quantity, maxStock));
              return { ...item, quantity: safeQuantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0);
      },
    }),
    {
      name: 'foliaco-cart-storage', // Guarda el carrito en localStorage
      partialize: (state) => ({ items: state.items }), // Solo persiste los items, no el estado del drawer
    }
  )
);
