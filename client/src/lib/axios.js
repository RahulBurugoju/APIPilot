import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token;
};
export const clearAccessToken = () => {
  accessToken = null;
};

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
export default api;
