import axios from 'axios';
import axiosRetry from 'axios-retry';
import {isTokenValid} from "./utils.js";

const BASE_URL = import.meta.env.MODE === 'production' ? "/api/" : "http://127.0.0.1:8000/api/"

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  maxRedirects: 5
});


apiClient.interceptors.request.use(
  async (config) => {

    if (config.url?.includes("/auth/login")) {
      return config;
    }

    const token = localStorage.getItem("access_token");
    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      const error = new axios.Cancel("Access token expired");
      error.code = "TOKEN_EXPIRED";
      console.warn("Невалидный токен. Запрос отменён.");
      return Promise.reject(error);
    }


    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (axios.isCancel(error)) {
      // Запрос отменён вручную, не обрабатываем
      return Promise.reject(error);
    }
    else if (error.response.status === 401) {
      error.code = "TOKEN_EXPIRED";
      localStorage.removeItem("access_token");
      console.warn('Пользователь не авторизован');
    }
    return Promise.reject(error);
  }
);


// axios-retry
axiosRetry(apiClient, {
  retries: 3,
  retryCondition: (error) => {
    return (
      error.response?.status === 503 ||
      error.code === 'ECONNABORTED' ||
      axiosRetry.isNetworkError(error)
    );
  },
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
});

export default apiClient;
