import axios, { AxiosInstance, AxiosError } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const apiURL = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.hostname}:5000/api`
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

    this.client = axios.create({
      baseURL: apiURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const errorData = error.response?.data as any;
        const errorMessage = errorData?.error?.message || error.message;
        const errorCode = errorData?.error?.code || 'API_ERROR';
        console.error('API Error:', { code: errorCode, message: errorMessage });
        return Promise.reject(error);
      }
    );
  }

  async get(url: string, params?: any) {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post(url: string, data?: any) {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put(url: string, data?: any) {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async patch(url: string, data?: any) {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  async delete(url: string) {
    const response = await this.client.delete(url);
    return response.data;
  }
}

export const api = new ApiClient();
