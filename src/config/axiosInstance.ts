import { baseUrl } from "./constants";
import { logout, setAccessToken } from "@/auth/features/authSlice";
import { refreshToken } from "@/auth/utils/refreshToken";
import axios from "axios";
import reduxStore from "@/config/reduxStore";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 30000, // 30 segundos timeout
});

// Variable para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = reduxStore.getState().auth.accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // console.log("Response interceptor error:", {
    //   status: error.response?.status,
    //   url: originalRequest?.url,
    //   hasRetry: originalRequest?._retry,
    // });

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando el token, agregar la petición a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            }
            return Promise.reject(error);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // console.log("Attempting to refresh token...");
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          // console.log("Token refreshed successfully");

          // Actualizar el token en Redux
          reduxStore.dispatch(setAccessToken(newAccessToken));

          // Actualizar localStorage también si lo usas
          localStorage.setItem("accessToken", newAccessToken);

          // Procesar la cola de peticiones fallidas
          processQueue(null, newAccessToken);

          // Reintentar la petición original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (refreshError) {
        // console.error("Token refresh failed:", refreshError);

        // Procesar la cola con error
        processQueue(refreshError, null);

        // Limpiar storage y redirigir al login
        const lastURL = window.location.pathname + window.location.search + window.location.hash;
        localStorage.setItem("lastURL", lastURL);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        reduxStore.dispatch(logout());

        // Evitar redirección si ya estamos en login
        if (!window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
