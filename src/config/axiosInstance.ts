// src\config\axiosInstance.ts

import { baseUrl } from "./constants";
import { logout, setAccessToken } from "@/auth/features/authSlice";
import { refreshToken } from "@/auth/utils/refreshToken";
import axios from "axios";
import reduxStore from "@/config/reduxStore";

const axiosInstance = axios.create({
  baseURL: baseUrl, // "http://localhost:3000",
  // withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = reduxStore.getState().auth.accessToken;
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          reduxStore.dispatch(setAccessToken(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        const lastURL = window.location.pathname + window.location.search + window.location.hash;
        localStorage.setItem("lastURL", lastURL);
        reduxStore.dispatch(logout());
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
