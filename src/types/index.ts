// src\types\index.ts

// ==================== API TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  pagination?: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

// ==================== USER TYPES ====================

export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  fechaCreacion: string;
  cuentas?: Account[];
}

export interface CreateUserDto {
  nombre: string;
  email: string;
  telefono?: string;
}

export interface UpdateUserDto {
  nombre?: string;
  email?: string;
  telefono?: string;
}

// ==================== ACCOUNT TYPES ====================

export const AccountType = {
  AHORRO: "ahorro",
  CORRIENTE: "corriente",
  PLAZO_FIJO: "plazo fijo",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const Currency = {
  COL: "COL$",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const AccountStatus = {
  ACTIVA: "activa",
  INACTIVA: "inactiva",
  CERRADA: "cerrada",
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

export interface Account {
  id: string;
  usuarioId: string;
  numeroCuenta: string;
  tipoCuenta: AccountType;
  saldo: number;
  moneda: Currency;
  fechaCreacion: string;
  estado: AccountStatus;
  user?: {
    nombre: string;
    email: string;
  };
  transacciones?: Transaction[];
  prestamos?: Loan[];
}

export interface CreateAccountDto {
  tipoCuenta: AccountType;
  moneda: Currency;
}

// ==================== TRANSACTION TYPES ====================

export const TransactionType = {
  DEPOSITO: "deposito",
  RETIRO: "retiro",
  TRANSFERENCIA_ENTRADA: "transferencia_entrada",
  TRANSFERENCIA_SALIDA: "transferencia_salida",
  PRESTAMO_DESEMBOLSO: "prestamo_desembolso",
  PRESTAMO_PAGO_CUOTA: "prestamo_pago_cuota",
  PRESTAMO_PAGO_MULTIPLE: "prestamo_pago_multiple",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  id: string;
  cuentaId: string;
  cuentaDestinoId?: string;
  cuentaOrigenId?: string;
  prestamoId?: string;
  cuotaId?: string;
  tipo: TransactionType;
  monto: number;
  descripcion?: string;
  fecha: string;
  saldoAnterior: number;
  saldoNuevo: number;
}

export interface DepositDto {
  monto: number;
  descripcion?: string;
}

export interface WithdrawDto {
  monto: number;
  descripcion?: string;
}

export interface TransferDto {
  cuentaOrigenId: string;
  cuentaDestinoNumero: string;
  monto: number;
  descripcion?: string;
}

// ==================== LOAN TYPES ====================

export const LoanStatus = {
  ACTIVO: "activo",
  COMPLETADO: "completado",
  CANCELADO: "cancelado",
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];

export const InstallmentStatus = {
  PENDIENTE: "pendiente",
  PAGADA: "pagada",
  VENCIDA: "vencida",
} as const;

export type InstallmentStatus = (typeof InstallmentStatus)[keyof typeof InstallmentStatus];

export interface LoanInstallment {
  id: string;
  prestamoId: string;
  numeroCuota: number;
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: InstallmentStatus;
}

export interface Loan {
  id: string;
  cuentaId: string;
  montoPrincipal: number;
  numeroCuotas: number;
  montoCuota: number;
  montoTotal: number;
  interesTotal: number;
  cuotasPagadas: number;
  fechaCreacion: string;
  fechaVencimiento?: string;
  fechaCompletado?: string;
  estado: LoanStatus;
  descripcion?: string;
  scoreAprobacion: number;
  ratioCapacidadPago: string;
  account?: {
    id: string;
    numeroCuenta: string;
    usuario?: {
      nombre: string;
      email: string;
    };
  };
  cuotas?: LoanInstallment[];
}

export interface CreateLoanDto {
  monto: number;
  numeroCuotas: number;
  descripcion?: string;
}

export interface PayInstallmentDto {
  numeroCuotas?: number;
}

export interface CalculateLoanDto {
  monto: number;
  numeroCuotas: number;
}

export interface LoanCalculation {
  montoPrincipal: number;
  numeroCuotas: number;
  montoCuota: number;
  montoTotal: number;
  interesTotal: number;
  tasaInteres: string;
}

// ==================== FORM TYPES ====================

export interface FormErrors {
  [key: string]: string;
}

export interface LoadingState {
  [key: string]: boolean;
}

// ==================== NOTIFICATION TYPES ====================

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

// ==================== UTILITY TYPES ====================

// Helper types for better type safety
export type AccountTypeKeys = keyof typeof AccountType;
export type CurrencyKeys = keyof typeof Currency;
export type AccountStatusKeys = keyof typeof AccountStatus;
export type TransactionTypeKeys = keyof typeof TransactionType;
export type LoanStatusKeys = keyof typeof LoanStatus;
export type InstallmentStatusKeys = keyof typeof InstallmentStatus;
