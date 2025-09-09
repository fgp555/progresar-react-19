// hooks/useTransactionForm.ts
import { useState } from "react";
import type { TransactionForm, TransactionType } from "../types/transaction.types";
import axiosInstance from "@/config/axiosInstance";

export const useTransactionForm = (
  accountId: string | undefined,
  onSuccess: () => void
) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const initialForm: TransactionForm = {
    monto: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
  };

  const [depositForm, setDepositForm] = useState<TransactionForm>(initialForm);
  const [withdrawForm, setWithdrawForm] = useState<TransactionForm>(initialForm);

  const validateForm = (form: TransactionForm, type: TransactionType): boolean => {
    const errors: { [key: string]: string } = {};
    const prefix = type === "deposit" ? "deposit_" : "withdraw_";

    // Amount validation
    if (!form.monto.trim()) {
      errors[`${prefix}monto`] = "El monto es requerido";
    } else {
      const amount = parseFloat(form.monto);
      if (isNaN(amount) || amount <= 0) {
        errors[`${prefix}monto`] = "El monto debe ser un número positivo";
      }
      if (amount > 999999999) {
        errors[`${prefix}monto`] = "El monto es demasiado grande";
      }
    }

    // Date validation
    if (!form.fecha) {
      errors[`${prefix}fecha`] = "La fecha es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formType: TransactionType
  ) => {
    const { name, value } = e.target;
    const prefix = formType === "deposit" ? "deposit_" : "withdraw_";

    // Clear validation error for this field
    if (validationErrors[`${prefix}${name}`]) {
      setValidationErrors((prev) => ({ ...prev, [`${prefix}${name}`]: "" }));
    }

    if (formType === "deposit") {
      setDepositForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setWithdrawForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTransaction = async (type: TransactionType) => {
    const form = type === "deposit" ? depositForm : withdrawForm;

    if (!validateForm(form, type) || !accountId) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        monto: parseFloat(form.monto),
        descripcion: form.descripcion,
        fecha: form.fecha,
      };

      const endpoint =
        type === "deposit"
          ? `/api/progresar/transacciones/deposit/${accountId}`
          : `/api/progresar/transacciones/withdraw/${accountId}`;

      const response: any = await axiosInstance.post(endpoint, payload);

      if (response.data.success) {
        // Reset form
        if (type === "deposit") {
          setDepositForm(initialForm);
        } else {
          setWithdrawForm(initialForm);
        }

        onSuccess();
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || `Error al realizar ${type === "deposit" ? "depósito" : "retiro"}`;
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    depositForm,
    withdrawForm,
    submitting,
    validationErrors,
    handleFormChange,
    handleTransaction,
  };
};
