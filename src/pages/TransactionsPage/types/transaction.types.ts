// types/transaction.types.ts
export interface Transaction {
  id: string;
  cuentaId: string;
  cuentaDestinoId?: string | null;
  cuentaOrigenId?: string | null;
  prestamoId?: string | null;
  cuotaId?: string | null;
  tipo: string;
  monto: string;
  descripcion: string;
  fecha: string;
  saldoAnterior: string;
  saldoNuevo: string;
}

export interface TransactionForm {
  monto: string;
  descripcion: string;
  fecha: string;
}

export interface Pagination {
  current: number;
  total: number;
  count: number;
  totalRecords: number;
}

export interface Account {
  id: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: string;
  moneda: string;
  estado: string;
}

export type TransactionType = "deposit" | "withdraw";
export type TabType = "history" | "deposit" | "withdraw";
