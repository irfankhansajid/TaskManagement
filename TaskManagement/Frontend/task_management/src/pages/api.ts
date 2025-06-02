import type { AuthResponse } from '@/types/Type';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const api: AxiosInstance =  axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use ((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } return config;

},
 (error) => {
    if (error instanceof Error) {
     return Promise.reject(error)
    } else {
        return Promise.reject(new Error(String(error)));
    }
}
);

api.interceptors.response.use (
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        if (error instanceof Error) {
            return Promise.reject(error);
        } else {
            return Promise.reject(new Error(String(error)));
        }
    }
);


  // Authentication API

  export const authApi = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
            username,
            password
        }) ;
        return response.data;
    },
    register: async (userData: {
        username: string;
        password: string;
        email: string;
        name: string;
    }): Promise<void> => {
        await api.post('/auth/register', userData);
    },
    forgetPassword: async (email: string): Promise<void> => {
        await api.post('/auth/forget-password', {email})
    },
    resetPassowrd: async (
        email      : string,
        resetToken : string,
        newPassword: string
    ): Promise<void> => {
        await api.post('/auth/reset-password', {
            email,
            resetToken,
            newPassword
        });
    }


  };

export default api;