// src\hooks\useLoans.ts

import { useState, useCallback } from "react";
import { apiService } from "../services/api";
import type { Loan, CreateLoanDto, PayInstallmentDto, CalculateLoanDto, LoanCalculation } from "../types";

export const useLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);

  const fetchAllLoans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllLoans();
      if (response.success && response.data) {
        setLoans(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching loans");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccountLoans = useCallback(async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAccountLoans(accountId);
      if (response.success && response.data) {
        setLoans(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching account loans");
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateLoan = useCallback(async (loanData: CalculateLoanDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.calculateLoan(loanData);
      if (response.success && response.data) {
        setCalculation(response.data);
        return response.data;
      }
      throw new Error(response.message || "Failed to calculate loan");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error calculating loan";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestLoan = useCallback(
    async (accountId: string, loanData: CreateLoanDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.requestLoan(accountId, loanData);
        if (response.success) {
          // Refresh loans after successful request
          await fetchAccountLoans(accountId);
          return response.data;
        }
        throw new Error(response.message || "Failed to request loan");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error requesting loan";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchAccountLoans]
  );

  const payInstallment = useCallback(async (loanId: string, paymentData: PayInstallmentDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.payLoanInstallment(loanId, paymentData);
      if (response.success) {
        // Update the specific loan in the state
        setLoans((prev) =>
          prev.map((loan) => {
            if (loan.id === loanId && response.data?.prestamo) {
              return response.data.prestamo;
            }
            return loan;
          })
        );
        return response.data;
      }
      throw new Error(response.message || "Failed to pay installment");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error paying installment";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCalculation = useCallback(() => {
    setCalculation(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loans,
    loading,
    error,
    calculation,
    fetchAllLoans,
    fetchAccountLoans,
    calculateLoan,
    requestLoan,
    payInstallment,
    clearCalculation,
    clearError,
  };
};
