import { useState, useCallback } from "react";
import { apiService } from "../services/api";
import type { Account, CreateAccountDto } from "../types";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAccounts();
      if (response.success && response.data) {
        setAccounts(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserAccounts = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getUserAccounts(userId);
      if (response.success && response.data) {
        setAccounts(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching user accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccountById = useCallback(async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAccountById(accountId);
      if (response.success && response.data) {
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching account");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = useCallback(async (userId: string, accountData: CreateAccountDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createAccount(userId, accountData);
      if (response.success && response.data) {
        setAccounts((prev) => [...prev, response.data!]);
        return response.data;
      }
      throw new Error(response.message || "Failed to create account");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error creating account";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAllAccounts,
    fetchUserAccounts,
    fetchAccountById,
    createAccount,
  };
};
