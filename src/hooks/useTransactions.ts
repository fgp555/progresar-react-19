// src\hooks\useTransactions.ts

import { useState, useCallback } from "react";
import { apiService } from "../services/api";
import type { Transaction, DepositDto, WithdrawDto, TransferDto } from "../types";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalRecords: 0,
  });

  const fetchAccountTransactions = useCallback(async (accountId: string, page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAccountTransactions(accountId, page, limit);
      if (response.success && response.data) {
        setTransactions(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  const deposit = useCallback(
    async (accountId: string, depositData: DepositDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.deposit(accountId, depositData);
        if (response.success) {
          // Refresh transactions after successful deposit
          await fetchAccountTransactions(accountId, 1, 10);
          return response.data;
        }
        throw new Error(response.message || "Failed to make deposit");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error making deposit";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchAccountTransactions]
  );

  const withdraw = useCallback(
    async (accountId: string, withdrawData: WithdrawDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.withdraw(accountId, withdrawData);
        if (response.success) {
          // Refresh transactions after successful withdrawal
          await fetchAccountTransactions(accountId, 1, 10);
          return response.data;
        }
        throw new Error(response.message || "Failed to make withdrawal");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error making withdrawal";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchAccountTransactions]
  );

  const transfer = useCallback(async (transferData: TransferDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.transfer(transferData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || "Failed to make transfer");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error making transfer";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchAccountTransactions,
    deposit,
    withdraw,
    transfer,
  };
};
