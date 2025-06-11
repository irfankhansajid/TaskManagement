
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept'      : 'application/json'
    }
})

api.interceptors.request.use (
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            toast({
                title      : 'Session expired',
                description: 'You have been logged out due to inactivity. Please log in again.',
                variant    : 'destructive',
                duration   : 5000,

            });
            console.error('Unauthorized access - redirecting to login');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)



export default api;