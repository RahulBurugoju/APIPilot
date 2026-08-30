import axios from "axios";

// Helper to normalize the API baseURL to always include the /api/v1 prefix
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return "http://localhost:9000/api/v1";
  }

  const cleanUrl = envUrl.trim().replace(/\/+$/, "");
  if (cleanUrl.endsWith("/api/v1")) {
    return cleanUrl;
  }
  return `${cleanUrl}/api/v1`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token;
};
export const clearAccessToken = () => {
  accessToken = null;
};

// Handles token refresh by ensuring only one refresh request runs at a
// time and shares the new access token with concurrent requests.
const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh-token")
      .then((response) => {
        const newToken = response.data?.data?.accessToken;
        accessToken = newToken;
        return newToken;
      })
      .catch((error) => {
        clearAccessToken();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }
    // Loop Prevention on /auth/refresh-token & /auth/login
    if (
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest?.url?.includes("/auth/login")
    ) {
      clearAccessToken();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
