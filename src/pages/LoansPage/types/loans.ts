// types/loans.ts

export interface LoanInstallment {
  id: string;
  numeroCuota: number;
  monto: string;
  fechaVencimiento: string;
  fechaPago?: string | null;
  estado: "pendiente" | "pagada" | "vencida";
}

export interface Account {
  id: string;
  usuarioId: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  fechaCreacion: string;
  estado: string;
}

export interface Loan {
  id: string;
  cuentaId: string;
  montoPrincipal: string;
  numeroCuotas: number;
  montoCuota: string;
  montoTotal: string;
  interesTotal: string;
  cuotasPagadas: number;
  fechaVencimiento: string;
  fechaCompletado?: string | null;
  estado: "activo" | "completado" | "vencido";
  descripcion: string;
  scoreAprobacion: number;
  ratioCapacidadPago: string;
  fechaCreacion: string;
  cuotas: LoanInstallment[];
  account?: Account;
}

export interface CreateLoanForm {
  monto: string;
  numeroCuotas: number;
  descripcion: string;
  fechaCreacion: string;
}

export interface PayInstallmentForm {
  numeroCuotas: number;
  fechaPago: string;
}

export interface PaySingleInstallmentForm {
  installmentId: string;
  fechaPago: string;
}

export interface LoanCalculation {
  montoPrincipal: number;
  numeroCuotas: number;
  montoCuota: number;
  montoTotal: number;
  interesTotal: number;
  tasaInteres: string;
}

export type TabType = "loans" | "request" | "calculate";
