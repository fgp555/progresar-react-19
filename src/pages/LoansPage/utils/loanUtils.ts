// utils/loanUtils.ts

import type { Loan } from "../types/loans";

// Enhanced currency formatting function
export const formatCurrency = (amount: string): string => {
  const number = parseFloat(amount);
  if (isNaN(number)) return "$0";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Function to format number input with thousands separators
export const formatNumberInput = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, "");

  // If empty, return empty string
  if (!numericValue) return "";

  // Format with thousands separators
  return new Intl.NumberFormat("es-CO").format(parseInt(numericValue));
};

// Function to clean formatted number for API calls
export const parseFormattedNumber = (formattedValue: string): number => {
  return parseFloat(formattedValue.toString().replace(/[^\d]/g, ""));
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case "ACTIVO":
      return "active";
    case "COMPLETADO":
      return "completed";
    case "VENCIDO":
      return "overdue";
    case "PENDIENTE":
      return "pending";
    case "PAGADA":
      return "paid";
    default:
      return "";
  }
};

export const getProgressPercentage = (loan: Loan): number => {
  return (loan.cuotasPagadas / loan.numeroCuotas) * 100;
};

export const getCurrentDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const generateCuotasOptions = (max: number = 12): number[] => {
  return Array.from({ length: max }, (_, i) => i + 1);
};
