// hooks/useLoans.ts

import { useState, useEffect } from "react";
import type {
  Loan,
  Account,
  CreateLoanForm,
  PayInstallmentForm,
  PaySingleInstallmentForm,
  LoanCalculation,
  TabType,
} from "../types/loans";
import { loanApi } from "../services/loanApi";
import {
  validateCreateForm,
  validatePayForm,
  validateSinglePayForm,
  validateCalculationForm,
  type ValidationErrors,
} from "../utils/loanValidation";
import { getCurrentDateString } from "../utils/loanUtils";

export const useLoans = (accountId: string | undefined) => {
  // State
  const [loans, setLoans] = useState<Loan[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("loans");
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Forms
  const [createLoanForm, setCreateLoanForm] = useState<CreateLoanForm>({
    monto: "",
    numeroCuotas: 1,
    descripcion: "",
    fechaCreacion: getCurrentDateString(),
  });

  const [payForm, setPayForm] = useState<PayInstallmentForm>({
    numeroCuotas: 1,
    fechaPago: getCurrentDateString(),
  });

  const [singlePayForm, setSinglePayForm] = useState<PaySingleInstallmentForm>({
    installmentId: "",
    fechaPago: getCurrentDateString(),
  });

  // Clear validation error for field
  const clearValidationError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  // Fetch data
  const fetchData = async () => {
    if (!accountId) {
      setError("ID de cuenta no proporcionado");
      setLoading(false);
      return;
    }

    try {
      // Fetch loans
      const loansData = await loanApi.getLoansByAccount(accountId);
      setLoans(loansData);

      // Try to get account info
      try {
        const accountData = await loanApi.getAccount(accountId);
        setAccount(accountData);
      } catch (accountErr) {
        console.warn("Could not fetch account details:", accountErr);
      }

      setError("");
    } catch (err: any) {
      const errorMessage = err?.message || "Error al cargar los datos";
      setError(errorMessage);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh loans
  const refreshLoans = async () => {
    if (!accountId) return;

    try {
      const loansData = await loanApi.getLoansByAccount(accountId);
      setLoans(loansData);
    } catch (err: any) {
      console.error("Error refreshing loans:", err);
    }
  };

  // Calculate loan
  const calculateLoan = async () => {
    const validationError = validateCalculationForm(createLoanForm.monto, createLoanForm.numeroCuotas);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const calculationData = await loanApi.calculateLoan(createLoanForm.monto, createLoanForm.numeroCuotas);
      setCalculation(calculationData);
      setError("");
    } catch (err: any) {
      const errorMessage = err?.message || "Error al calcular el préstamo";
      setError(errorMessage);
      console.error("Error calculating loan:", err);
    }
  };

  // Create loan
  const createLoan = async () => {
    const errors = validateCreateForm(createLoanForm, account);
    if (Object.keys(errors).length > 0 || !accountId) {
      setValidationErrors(errors);
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await loanApi.createLoan(accountId, createLoanForm);

      // Reset form
      setCreateLoanForm({
        monto: "",
        numeroCuotas: 1,
        descripcion: "",
        fechaCreacion: getCurrentDateString(),
      });
      setCalculation(null);

      // Refresh loans and switch to loans tab
      await refreshLoans();
      setActiveTab("loans");
    } catch (err: any) {
      const errorMessage = err?.message || "Error al crear el préstamo";
      setError(errorMessage);
      console.error("Error creating loan:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Pay installments
  const payInstallments = async (loanId: string) => {
    const errors = validatePayForm(payForm);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await loanApi.payInstallments(loanId, payForm.numeroCuotas, payForm.fechaPago);

      // Reset form
      setPayForm({
        numeroCuotas: 1,
        fechaPago: getCurrentDateString(),
      });

      // Refresh loans
      await refreshLoans();
    } catch (err: any) {
      const errorMessage = err?.message || "Error al pagar la cuota";
      setError(errorMessage);
      console.error("Error paying installment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Pay single installment
  const paySingleInstallment = async (loanId: string) => {
    const errors = validateSinglePayForm(singlePayForm);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await loanApi.paySingleInstallment(loanId, singlePayForm.fechaPago);

      // Reset form
      setSinglePayForm({
        installmentId: "",
        fechaPago: getCurrentDateString(),
      });

      // Refresh loans
      await refreshLoans();
    } catch (err: any) {
      const errorMessage = err?.message || "Error al pagar la cuota";
      setError(errorMessage);
      console.error("Error paying single installment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Effect to fetch data on mount
  useEffect(() => {
    fetchData();
  }, [accountId]);

  return {
    // State
    loans,
    account,
    loading,
    submitting,
    error,
    activeTab,
    calculation,
    validationErrors,

    // Forms
    createLoanForm,
    payForm,
    singlePayForm,

    // Actions
    setActiveTab,
    setError,
    setCreateLoanForm,
    setPayForm,
    setSinglePayForm,
    clearValidationError,
    calculateLoan,
    createLoan,
    payInstallments,
    paySingleInstallment,
    refreshLoans,
  };
};
