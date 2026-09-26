import { axiosInstance } from '@/core/api/axiosInstance';

export interface UserProfile {
  email: string;
  roles: Array<{ authority: string }>;
}

export const authService = {
  loginWithGoogle: () => {
    // Redirige al usuario al backend para iniciar el flujo de OAuth2
    window.location.href = 'http://localhost:8081/api/auth/login/google';
  },

  logout: async () => {
    return axiosInstance.post('/auth/logout');
  },

  getProfile: async () => {
    const response = await axiosInstance.get<UserProfile>('/user/profile');
    return response.data;
  }
};
