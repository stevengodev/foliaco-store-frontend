import axios from 'axios';

// Base URL del backend (ahora pasa por el proxy de Vite)
const BASE_URL = '/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Importante para enviar las cookies (access_token y refresh_token)
});

// Interceptor para manejar errores 401 y refrescar el token automáticamente si es necesario
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (No autorizado) y no hemos reintentado ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Intentar refrescar el token llamando al endpoint de refresh
        await axios.get(`${BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });
        
        // Si el refresh es exitoso, reintentar la solicitud original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si el refresh falla, redirigir al login o limpiar estado
        console.error('Session expired', refreshError);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
