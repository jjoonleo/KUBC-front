import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for session management
});

// Set up interceptors directly when creating the instance
// Request interceptor - automatically add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    const tokenType = localStorage.getItem("token_type");

    if (token && tokenType && config.headers) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }

    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      config.url,
      new Date().toTimeString()
    );
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "API Response:",
      response.status,
      response.config.url,
      new Date().toTimeString()
    );
    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Handle 401 errors (token expired)
    if (response?.status === 401 && config) {
      // Prevent infinite loops on auth endpoints
      if (config.url?.includes("/auth/")) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user_info");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // For other endpoints, clear tokens and redirect to login
      console.error("Authentication failed - redirecting to login");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("user_info");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle other errors
    console.error(
      "Response Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default apiClient;
