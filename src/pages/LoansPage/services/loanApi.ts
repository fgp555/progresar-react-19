// services/loanApi.ts

import axiosInstance from "@/config/axiosInstance";
import type { Loan, Account, LoanCalculation, CreateLoanForm } from "../types/loans";
import { parseFormattedNumber } from "../utils/loanUtils";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const loanApi = {
  // Obtener préstamos por cuenta
  getLoansByAccount: async (accountId: string): Promise<Loan[]> => {
    const response = await axiosInstance.get<ApiResponse<Loan[]>>(`/api/progresar/prestamos/account/${accountId}`);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Error al obtener préstamos");
  },

  // Obtener información de cuenta
  getAccount: async (accountId: string): Promise<Account> => {
    const response = await axiosInstance.get<ApiResponse<Account>>(`/api/progresar/cuentas/${accountId}`);

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Error al obtener información de cuenta");
  },

  // Calcular préstamo
  calculateLoan: async (monto: string, numeroCuotas: number): Promise<LoanCalculation> => {
    const cleanAmount = parseFormattedNumber(monto);
    const response = await axiosInstance.post<ApiResponse<LoanCalculation>>("/api/progresar/prestamos/calculate", {
      monto: cleanAmount,
      numeroCuotas: numeroCuotas,
    });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Error al calcular el préstamo");
  },

  // Crear préstamo
  createLoan: async (accountId: string, form: CreateLoanForm): Promise<void> => {
    const cleanAmount = parseFormattedNumber(form.monto);
    const payload = {
      monto: cleanAmount,
      numeroCuotas: form.numeroCuotas,
      descripcion: form.descripcion,
      fechaCreacion: form.fechaCreacion,
    };

    console.log("Payload being sent:", payload); // Para debug

    const response = await axiosInstance.post<ApiResponse<any>>(
      `/api/progresar/prestamos/account/${accountId}`,
      payload
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error al crear el préstamo");
    }
  },

  // Pagar cuotas
  payInstallments: async (loanId: string, numeroCuotas: number, fechaPago: string): Promise<void> => {
    const payload = {
      numeroCuotas: numeroCuotas,
      fechaPago: fechaPago,
    };

    const response = await axiosInstance.post<ApiResponse<any>>(`/api/progresar/prestamos/pay/${loanId}`, payload);

    if (!response.data.success) {
      throw new Error(response.data.message || "Error al pagar la cuota");
    }
  },

  // Pagar una sola cuota
  paySingleInstallment: async (loanId: string, fechaPago: string): Promise<void> => {
    const payload = {
      numeroCuotas: 1,
      fechaPago: fechaPago,
    };

    const response = await axiosInstance.post<ApiResponse<any>>(`/api/progresar/prestamos/pay/${loanId}`, payload);

    if (!response.data.success) {
      throw new Error(response.data.message || "Error al pagar la cuota");
    }
  },
};
