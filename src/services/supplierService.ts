import { axiosInstance } from '@/core/api/axiosInstance';

export interface CreateSupplierRequest {
  names: string;
  lastNames: string;
  company: string;
  taxId: string;
  phone: string;
  email: string;
}

export interface SupplierResponse {
  id: number;
  names?: string;
  lastNames?: string;
  company: string;
  taxId?: string;
  phone?: string;
  email: string;
  active: boolean;
}

export const supplierService = {
  getSuppliers: async (): Promise<SupplierResponse[]> => {
    const response = await axiosInstance.get<SupplierResponse[]>('/suppliers');
    return response.data;
  },

  getSupplierById: async (id: number): Promise<SupplierResponse> => {
    const response = await axiosInstance.get<SupplierResponse>(`/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (data: CreateSupplierRequest): Promise<SupplierResponse> => {
    const response = await axiosInstance.post<SupplierResponse>('/suppliers', data);
    return response.data;
  },

  updateSupplier: async (id: number, data: CreateSupplierRequest): Promise<SupplierResponse> => {
    const response = await axiosInstance.put<SupplierResponse>(`/suppliers/${id}`, data);
    return response.data;
  },

  deleteSupplier: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/suppliers/${id}`);
  },
};
