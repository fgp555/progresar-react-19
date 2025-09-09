// src/hooks/useGetTotalesPrestamosActivos.ts
import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";

interface TotalesPrestamosResponse {
  success: boolean;
  totalPrestamosActivos: number;
  totalInteresesActivos: number;
  totalPagadoIntereses: number;
}

export const useGetTotalesPrestamosActivos = () => {
  const [data, setData] = useState<TotalesPrestamosResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTotales = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get<TotalesPrestamosResponse>("/api/progresar/prestamos/totales/activos");
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al obtener totales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotales();
  }, []);

  return { data, loading, error, refetch: fetchTotales };
};
