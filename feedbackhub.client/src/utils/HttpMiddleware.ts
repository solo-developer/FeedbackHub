import axios from 'axios';
import { CLIENT_ROLE } from './Constants';
import { jwtDecode } from 'jwt-decode';
import { getApplicationId } from './AddContextStore';

// Create an Axios instance for all API requests
const api = axios.create({
  baseURL: 'https://localhost:7230', // Your backend API URL here
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Request interceptor: Add the JWT token to the Authorization header
api.interceptors.request.use(
 async (config) => {
    const token = localStorage.getItem('access_token'); // Get the access token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token if exists

      try {
        const decoded : any = jwtDecode(token);

        // Check if role is 'application_client'
        if (decoded.role === CLIENT_ROLE) {
          const applicationId = await getApplicationId(); 
          if (applicationId) {
            config.headers['ApplicationId'] = applicationId.toString();
          }
        }
      } catch (err) {
        console.warn('Failed to decode token or fetch ApplicationId', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Reject if request fails
  }
);

// Response interceptor: Handle 401 Unauthorized errors (token expired or invalid)
api.interceptors.response.use(
  (response) => {
    return response; // Return the response if no error
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Attempt to refresh the token by calling the refresh-token endpoint
          const refreshResponse = await axios.post('/account/refresh-token', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

          // Store new access and refresh tokens
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', newRefreshToken);

          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axios(originalRequest); // Retry original request

        } catch (refreshError) {
          // If refresh fails, remove tokens and redirect to login page
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';  // Redirect to login page
        }
      } else {
        // If no refresh token, just redirect to login page
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden errors (Access Denied)
    if (error.response && error.response.status === 403) {
      console.error('Access Denied (403): User does not have permission to access this resource.');
      // Redirect to Access Denied page
      window.location.href = '/access-denied'; // Redirect to your access-denied page
    }

    return Promise.reject(error); // Reject the error if not a 401 or 403
  }
);

export default api;
