import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const extractTokenFromPersist = () => {
  try {
    const persisted = localStorage.getItem("persist:root");
    if (!persisted) return null;
    const parsed = JSON.parse(persisted);
    if (!parsed.auth) return null;
    const auth = JSON.parse(parsed.auth);
    return auth?.token || null;
  } catch {
    return null;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = extractTokenFromPersist();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error?.response?.data?.message;
    const fallbackMessage = error?.message || "Request failed";
    return Promise.reject(new Error(serverMessage || fallbackMessage));
  }
);

export const postWithFallback = async (paths, data, config = {}) => {
  let lastError;
  for (const path of paths) {
    try {
      const response = await apiClient.post(path, data, config);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const getWithFallback = async (paths, config = {}) => {
  let lastError;
  for (const path of paths) {
    try {
      const response = await apiClient.get(path, config);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const putWithFallback = async (paths, data, config = {}) => {
  let lastError;
  for (const path of paths) {
    try {
      const response = await apiClient.put(path, data, config);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const deleteWithFallback = async (paths, config = {}) => {
  let lastError;
  for (const path of paths) {
    try {
      const response = await apiClient.delete(path, config);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export default apiClient;
