import { axiosInstance } from '@/core/api/axiosInstance';
import type { Product } from '../types/product';

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export const catalogService = {
  getProducts: async () => {
    const response = await axiosInstance.get<Product[]>('/catalog/products');
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await axiosInstance.get<Product>(`/catalog/products/${id}`);
    return response.data;
  },

  updateProduct: async (id: number, productData: any) => {
    const response = await axiosInstance.put<Product>(`/catalog/products/${id}`, productData);
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get<any[]>('/catalog/categories');
    return response.data;
  },

  getCategoryById: async (id: number) => {
    // Para simplificar, buscamos en todas las categorías, o si hay un endpoint específico, usarlo.
    // El CategoryController actual no tiene GET /{id}, así que iteramos de la lista:
    const categories = await catalogService.getCategories();
    return categories.find(c => c.id === id);
  },

  updateCategory: async (id: number, categoryData: any) => {
    const response = await axiosInstance.put<any>(`/catalog/categories/${id}`, categoryData);
    return response.data;
  },

  createCategory: async (categoryData: any) => {
    const response = await axiosInstance.post<any>('/catalog/categories', categoryData);
    return response.data;
  },

  getPresignedUrls: async (filenames: string[]) => {
    const response = await axiosInstance.post<{ fileKey: string; url: string }[]>('/images/presigned', filenames);
    return response.data;
  },

  searchProducts: async (params: {
    name?: string;
    sku?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }) => {
    const response = await axiosInstance.get<PageResponse<Product>>('/catalog/products/search', { params });
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await axiosInstance.post<Product>('/catalog/products', productData);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    await axiosInstance.delete(`/catalog/products/${id}`);
  },

  deleteCategory: async (id: number) => {
    await axiosInstance.delete(`/catalog/categories/${id}`);
  }
};
