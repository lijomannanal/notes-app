import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
  baseURL, // Replace with your API base URL
});

// Request interceptor to add JWT token to Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token") as string);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and refresh tokens (optional)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = JSON.parse(
          localStorage.getItem("refreshToken") as string
        );
        const response = await apiClient.post("/auth/refresh-token", {
          refreshToken,
        });
        const { token } = response.data;
        localStorage.setItem("token", JSON.stringify(token));
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (error) {
        console.log(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
