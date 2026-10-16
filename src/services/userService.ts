import { axiosInstance } from '@/core/api/axiosInstance';

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'GUESS';

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  enabled: boolean;
  role: UserRole;
  ordersCount?: number;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  role?: UserRole;
  enabled?: boolean;
}

export const userService = {
  getAllUsers: async (): Promise<UserResponse[]> => {
    const response = await axiosInstance.get<UserResponse[]>('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<UserResponse> => {
    const response = await axiosInstance.post<UserResponse>('/users', data);
    return response.data;
  },

  assignRole: async (id: number, role: UserRole): Promise<UserResponse> => {
    const response = await axiosInstance.put<UserResponse>(`/users/${id}/role`, null, {
      params: { role }
    });
    return response.data;
  },

  toggleStatus: async (id: number): Promise<UserResponse> => {
    const response = await axiosInstance.patch<UserResponse>(`/users/${id}/status`);
    return response.data;
  }
};
