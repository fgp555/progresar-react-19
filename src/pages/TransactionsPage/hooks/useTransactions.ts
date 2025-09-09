// hooks/useTransactions.ts
import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";
import type { Transaction, Pagination } from "../types/transaction.types";

export const useTransactions = (accountId: string | undefined, currentPage: number) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!accountId) {
      setError("ID de cuenta no proporcionado");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response: any = await axiosInstance.get(
          `/api/progresar/transacciones/account/${accountId}?page=${currentPage}&limit=10`
        );

        if (response.data.success) {
          setTransactions(response.data.data);
          setPagination(response.data.pagination);
          setUser(response.data.user);
        }

        setError("");
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || "Error al cargar las transacciones";
        setError(errorMessage);
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, currentPage]);

  const refreshTransactions = async () => {
    if (!accountId) return;

    try {
      const response: any = await axiosInstance.get(
        `/api/progresar/transacciones/account/${accountId}?page=1&limit=10`
      );

      if (response.data.success) {
        setTransactions(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Error refreshing transactions:", err);
    }
  };

  return {
    transactions,
    pagination,
    user,
    loading,
    error,
    refreshTransactions,
    setError,
  };
};
