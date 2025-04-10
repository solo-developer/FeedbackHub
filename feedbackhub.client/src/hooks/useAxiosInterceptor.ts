import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7230',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper functions for token management
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

const setRefreshToken = (token: string) => {
  localStorage.setItem('refreshToken', token);
};

// Interceptor for request
export const useAxiosInterceptors = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const is401 = error.response?.status === 401;
        const is403 = error.response?.status === 403;
        const tokenExpired = error.response?.headers['token-expired'] === 'true';

        // Token expired and needs refreshing
        if (is401 && tokenExpired && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axios.post('https://localhost:7230/auth/refresh-token', {
              refreshToken: getRefreshToken(),
            });

            const { accessToken, refreshToken } = refreshResponse.data;
            setAuthToken(accessToken);
            setRefreshToken(refreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            navigate('/login'); // Redirect to login if refresh fails
            return Promise.reject(refreshError);
          }
        }

        // If the token is invalid, go to login
        if (is401) {
          navigate('/login');
        }

        // If user is not authorized, go to access-denied page
        if (is403) {
          navigate('/access-denied');
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors when the component is unmounted
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return api;
};

export default useAxiosInterceptors;