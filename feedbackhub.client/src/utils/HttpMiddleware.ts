import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


const api = axios.create({
  baseURL: 'https://localhost:7230',  
  headers: {
    'Content-Type': 'application/json',  
  },
});

// Function to get the Authorization Bearer token from localStorage or another source
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');  // Change this to your token storage logic
};

// Request interceptor to add the Authorization header
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Add the Bearer token to the header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic GET request function
export const get = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await api.get(url, config);
    return response;
  } catch (error) {
    throw error;  // Propagate the error
  }
};

// Generic POST request function
export const post = async (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await api.post(url, data, config);
    return response;
  } catch (error) {
    throw error;  // Propagate the error
  }
};

// Generic PUT request function
export const put = async (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await api.put(url, data, config);
    return response;
  } catch (error) {
    throw error;  // Propagate the error
  }
};

// Generic DELETE request function
export const del = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await api.delete(url, config);
    return response;
  } catch (error) {
    throw error;  // Propagate the error
  }
};
