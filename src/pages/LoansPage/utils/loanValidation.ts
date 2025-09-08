// utils/loanValidation.ts

import type { CreateLoanForm, PayInstallmentForm, PaySingleInstallmentForm, Account } from "../types/loans";
import { parseFormattedNumber, formatCurrency } from "./loanUtils";

export interface ValidationErrors {
  [key: string]: string;
}

export const validateCreateForm = (form: CreateLoanForm, account: Account | null): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!form.monto || form.monto.toString().trim() === "") {
    errors.monto = "El monto es requerido";
  } else {
    const amount = parseFormattedNumber(form.monto);
    if (isNaN(amount) || amount <= 0) {
      errors.monto = "El monto debe ser un número positivo";
    } else if (account) {
      // Validar que el monto no exceda el doble del saldo
      const maxAmount = parseFloat(account.saldo) * 2;
      if (amount > maxAmount) {
        errors.monto = `El monto máximo permitido es ${formatCurrency(maxAmount.toString())} (2x su saldo actual)`;
      }
    }
  }

  if (!form.fechaCreacion) {
    errors.fechaCreacion = "La fecha de creación es requerida";
  }

  if (form.numeroCuotas < 1 || form.numeroCuotas > 12) {
    errors.numeroCuotas = "El número de cuotas debe estar entre 1 y 12";
  }

  return errors;
};

export const validatePayForm = (form: PayInstallmentForm): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!form.fechaPago) {
    errors.fechaPago = "La fecha de pago es requerida";
  }

  if (form.numeroCuotas < 1) {
    errors.numeroCuotas = "Debe seleccionar al menos 1 cuota";
  }

  return errors;
};

export const validateSinglePayForm = (form: PaySingleInstallmentForm): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!form.fechaPago) {
    errors.fechaPago = "La fecha de pago es requerida";
  }

  return errors;
};

export const validateCalculationForm = (monto: string, numeroCuotas: number): string | null => {
  if (!monto || numeroCuotas < 1 || numeroCuotas > 12) {
    return "Por favor ingresa un monto válido y número de cuotas entre 1 y 12";
  }

  const amount = parseFormattedNumber(monto);
  if (isNaN(amount) || amount <= 0) {
    return "El monto debe ser un número positivo";
  }

  return null;
};
