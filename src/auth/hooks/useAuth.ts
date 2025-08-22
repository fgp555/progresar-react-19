// src/modules/auth/hooks/useAuth.ts

import type { AppDispatch, RootState } from "@/config/reduxStore";
import type { IUserState } from "../interfaces/user.interface";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { validateImgPath } from "@/utils/validateImgPath";
import axiosInstance from "@/config/axiosInstance";
import {
  logout as logoutAction,
  setAccessToken as setAccessTokenAction,
  setUser as setUserAction,
  setError,
  setLoading,
  toggleRole,
} from "../features/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, userState, loading, error } = useSelector((state: RootState) => state.auth);
  const [hydrated, setHydrated] = useState(false); // NUEVO

  // Cargar desde localStorage una vez
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token) dispatch(setAccessTokenAction(token));
    if (user) dispatch(setUserAction(JSON.parse(user)));

    setHydrated(true);
  }, [dispatch]);

  const persistAccessToken = (token: string) => {
    localStorage.setItem("accessToken", token);
    dispatch(setAccessTokenAction(token));
  };

  const persistRefreshToken = (token: string) => {
    localStorage.setItem("refreshToken", token);
  };

  const persistUser = (user: IUserState) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(setUserAction(user));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    const lastURL = window.location.pathname + window.location.search + window.location.hash;
    localStorage.setItem("lastURL", lastURL);
    dispatch(logoutAction());
  };

  const onToggleRole = () => {
    dispatch(toggleRole());
  };

  const hasRole = (role: string): boolean => userState?.role === role;
  const hasPermission = (roles: string[]): boolean => (userState ? roles.includes(userState.role) : false);
  const hasAnyRole = (...roles: string[]): boolean => (userState ? roles.includes(userState.role) : false);

  const isAuthenticated = !!accessToken && !!userState;
  const userStatePhoto = validateImgPath(userState?.photo);
  const userRole = userState?.role;

  const isAdmin = userState?.role === "admin" || userState?.role === "superadmin";
  const isCollaborator = userState?.role === "collaborator";
  const isSuperAdmin = userState?.role === "superadmin";
  const userId = userState?._id;
  const userName = userState?.name;

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (
    email: string,
    password: string,
    path: string = "/api/auth/login" // ruta por defecto
  ) => {
    setIsLoading(true);
    try {
      const res: any = await axiosInstance.post(path, { email, password });
      persistAccessToken(res.data.accessToken);
      persistRefreshToken(res.data.refreshToken);
      persistUser(res.data.user);
      const params = new URLSearchParams(location.search);
      const redirectURL = params.get("redirectURL");
      if (redirectURL) navigate(redirectURL);

      return res.data;
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estado
    isAuthenticated,
    userStatePhoto,
    accessToken,
    userState,
    hydrated,
    loading,
    error,

    // Acciones Redux + persistencia
    handleLogin,
    logout,
    setAccessToken: persistAccessToken,
    setRefreshToken: persistRefreshToken,
    setUser: persistUser,
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setError: (error: string | null) => dispatch(setError(error)),

    // Utilidades
    hasRole,
    hasPermission,
    hasAnyRole,
    onToggleRole,

    // temporal
    isLoading,
    isAdmin,
    isCollaborator,
    isSuperAdmin,
    userId,
    userName,
    userRole,
  };
};
