// src/types/index.ts

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

// ==================== DOCUMENT TYPE ====================

export interface DocumentType {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== USER TYPES ====================

export const UserRoleEnum = {
  USER: "user",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
  COLLABORATOR: "collaborator",
  DEVELOPER: "developer",
  GUEST: "guest",
} as const;

export type UserRoleEnum = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

export interface User {
  _id: string;
  username: string;
  name: string;
  lastName?: string;
  email: string;
  whatsapp?: string;
  password?: string; // Opcional para cuando se retorna del backend (generalmente hasheado)
  photo?: string | null;
  role: UserRoleEnum;
  isVisible: boolean;
  isActive: boolean;
  googleId?: string | null;
  displayName?: string | null;
  rawGoogle?: any | null;
  documentNumber: string;
  documentType?: DocumentType;
  cupos: number;
  createdAt: string;
  updatedAt: string;
  cuentas?: Account[];
}

export interface CreateUserDto {
  name: string;
  lastName?: string;
  email: string;
  whatsapp?: string;
  documentType: string; // código del tipo de documento
  documentNumber: string;
  cupos?: number;
  password?: string;
}

export interface UpdateUserDto {
  name?: string;
  lastName?: string;
  email?: string;
  whatsapp?: string;
  documentType?: string;
  documentNumber?: string;
  cupos?: number;
  isVisible?: boolean;
  isActive?: boolean;
}

// ==================== ACCOUNT TYPES ====================

export const AccountType = {
  AHORRO: "ahorro",
  CORRIENTE: "corriente",
  PRESTAMO: "prestamo",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const Currency = {
  COP: "COP",
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
  saldo: string | number; // Puede venir como string del backend (decimal) o number en frontend
  moneda: Currency;
  fechaCreacion: string;
  estado: AccountStatus;
  user?: User; // Relación completa con el usuario
  transacciones?: Transaction[];
  prestamos?: Loan[];
}

export interface CreateAccountDto {
  tipoCuenta: AccountType;
  moneda: Currency;
  usuarioId?: string; // Opcional si se toma del contexto de autenticación
}

export interface UpdateAccountDto {
  tipoCuenta?: AccountType;
  estado?: AccountStatus;
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
  monto: string | number; // Similar a Account.saldo
  descripcion?: string;
  fecha: string;
  saldoAnterior: string | number;
  saldoNuevo: string | number;
  createdAt?: string;
  updatedAt?: string;
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
  monto: string | number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: InstallmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Loan {
  id: string;
  cuentaId: string;
  montoPrincipal: string | number;
  numeroCuotas: number;
  montoCuota: string | number;
  montoTotal: string | number;
  interesTotal: string | number;
  cuotasPagadas: number;
  fechaCreacion: string;
  fechaVencimiento?: string;
  fechaCompletado?: string;
  estado: LoanStatus;
  descripcion?: string;
  scoreAprobacion: number;
  ratioCapacidadPago: string;
  createdAt?: string;
  updatedAt?: string;
  account?: {
    id: string;
    numeroCuenta: string;
    usuario?: {
      name: string;
      email: string;
      lastName?: string;
    };
  };
  cuotas?: LoanInstallment[];
}

export interface CreateLoanDto {
  monto: number;
  numeroCuotas: number;
  descripcion?: string;
  cuentaId?: string; // Opcional si se toma del contexto
}

export interface PayInstallmentDto {
  numeroCuotas?: number;
  monto?: number; // Para pagos parciales o múltiples
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
  [key: string]: string | string[];
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "textarea" | "checkbox";
  placeholder?: string;
  value?: any;
  options?: Array<{ value: any; label: string }>;
  validation?: ValidationRule;
  disabled?: boolean;
}

// ==================== NOTIFICATION TYPES ====================

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  timestamp?: string;
}

// ==================== PAGINATION TYPES ====================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ==================== FILTER TYPES ====================

export interface UserFilter extends PaginationParams {
  role?: UserRoleEnum;
  isActive?: boolean;
  isVisible?: boolean;
  cupos?: number;
  documentType?: string;
}

export interface AccountFilter extends PaginationParams {
  tipoCuenta?: AccountType;
  estado?: AccountStatus;
  moneda?: Currency;
  saldoMin?: number;
  saldoMax?: number;
  userId?: string;
}

export interface TransactionFilter extends PaginationParams {
  tipo?: TransactionType;
  cuentaId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  montoMin?: number;
  montoMax?: number;
}

export interface LoanFilter extends PaginationParams {
  estado?: LoanStatus;
  cuentaId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  montoMin?: number;
  montoMax?: number;
}

// ==================== UTILITY TYPES ====================

// Helper types for better type safety
export type AccountTypeKeys = keyof typeof AccountType;
export type CurrencyKeys = keyof typeof Currency;
export type AccountStatusKeys = keyof typeof AccountStatus;
export type TransactionTypeKeys = keyof typeof TransactionType;
export type LoanStatusKeys = keyof typeof LoanStatus;
export type InstallmentStatusKeys = keyof typeof InstallmentStatus;
export type UserRoleKeys = keyof typeof UserRoleEnum;

// Utility type para convertir strings numericos a numbers
export type ParsedAccount = Omit<Account, "saldo"> & {
  saldo: number;
};

export type ParsedTransaction = Omit<Transaction, "monto" | "saldoAnterior" | "saldoNuevo"> & {
  monto: number;
  saldoAnterior: number;
  saldoNuevo: number;
};

export type ParsedLoan = Omit<Loan, "montoPrincipal" | "montoCuota" | "montoTotal" | "interesTotal"> & {
  montoPrincipal: number;
  montoCuota: number;
  montoTotal: number;
  interesTotal: number;
};

// Tipos para estadísticas y dashboards
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalAccounts: number;
  totalBalance: number;
  totalLoans: number;
  activeLoans: number;
  totalTransactions: number;
  recentTransactions: Transaction[];
}

export interface UserStats {
  totalBalance: number;
  activeLoans: number;
  completedLoans: number;
  totalTransactions: number;
  recentActivity: Transaction[];
}

// Tipos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends CreateUserDto {
  password: string;
  confirmPassword: string;
}

export interface AuthUser extends Omit<User, "password"> {
  token?: string;
  refreshToken?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Tipos para contextos de React
export interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (filters?: UserFilter) => Promise<void>;
  createUser: (userData: CreateUserDto) => Promise<User>;
  updateUser: (id: string, userData: UpdateUserDto) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

export interface AccountContextType {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  fetchAccounts: (filters?: AccountFilter) => Promise<void>;
  createAccount: (accountData: CreateAccountDto) => Promise<Account>;
  updateAccount: (id: string, accountData: UpdateAccountDto) => Promise<Account>;
  deposit: (accountId: string, depositData: DepositDto) => Promise<Transaction>;
  withdraw: (accountId: string, withdrawData: WithdrawDto) => Promise<Transaction>;
  transfer: (transferData: TransferDto) => Promise<Transaction>;
}

// Export por defecto para facilitar imports
export default {
  UserRoleEnum,
  AccountType,
  Currency,
  AccountStatus,
  TransactionType,
  LoanStatus,
  InstallmentStatus,
};
