// src\services\api.ts

import { baseUrl } from "../config/constants";
import type {
  ApiResponse,
  User,
  CreateUserDto,
  UpdateUserDto,
  Account,
  CreateAccountDto,
  Transaction,
  DepositDto,
  WithdrawDto,
  TransferDto,
  Loan,
  CreateLoanDto,
  PayInstallmentDto,
  CalculateLoanDto,
  LoanCalculation,
} from "../types";

class ApiService {
  private baseURL = baseUrl + "/api/progresar";

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const token = localStorage.getItem("accessToken");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // 🔑 Solo si hay token
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request("/health");
  }

  // ==================== USER ENDPOINTS ====================

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request("/usuarios");
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request(`/usuarios/${id}`);
  }

  async createUser(userData: CreateUserDto): Promise<ApiResponse<User>> {
    return this.request("/usuarios", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<ApiResponse<User>> {
    return this.request(`/usuarios/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request(`/usuarios/${id}`, {
      method: "DELETE",
    });
  }

  // ==================== ACCOUNT ENDPOINTS ====================

  async getAccounts(): Promise<ApiResponse<Account[]>> {
    return this.request("/cuentas");
  }

  async getAccountById(id: string): Promise<ApiResponse<Account>> {
    return this.request(`/cuentas/${id}`);
  }

  async getUserAccounts(userId: string): Promise<ApiResponse<Account[]>> {
    return this.request(`/cuentas/user/${userId}`);
  }

  async createAccount(userId: string, accountData: CreateAccountDto): Promise<ApiResponse<Account>> {
    return this.request(`/cuentas/user/${userId}`, {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  }

  // ==================== TRANSACTION ENDPOINTS ====================

  async getAccountTransactions(
    accountId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Transaction[]>> {
    return this.request(`/transacciones/account/${accountId}?page=${page}&limit=${limit}`);
  }

  async deposit(accountId: string, depositData: DepositDto): Promise<ApiResponse<any>> {
    return this.request(`/transacciones/deposit/${accountId}`, {
      method: "POST",
      body: JSON.stringify(depositData),
    });
  }

  async withdraw(accountId: string, withdrawData: WithdrawDto): Promise<ApiResponse<any>> {
    return this.request(`/transacciones/withdraw/${accountId}`, {
      method: "POST",
      body: JSON.stringify(withdrawData),
    });
  }

  async transfer(transferData: TransferDto): Promise<ApiResponse<any>> {
    return this.request("/transacciones/transfer", {
      method: "POST",
      body: JSON.stringify(transferData),
    });
  }

  // ==================== LOAN ENDPOINTS ====================

  async getAllLoans(): Promise<ApiResponse<Loan[]>> {
    return this.request("/prestamos");
  }

  async getAccountLoans(accountId: string): Promise<ApiResponse<Loan[]>> {
    return this.request(`/prestamos/account/${accountId}`);
  }

  async calculateLoan(loanData: CalculateLoanDto): Promise<ApiResponse<LoanCalculation>> {
    return this.request("/prestamos/calculate", {
      method: "POST",
      body: JSON.stringify(loanData),
    });
  }

  async requestLoan(accountId: string, loanData: CreateLoanDto): Promise<ApiResponse<any>> {
    return this.request(`/prestamos/account/${accountId}`, {
      method: "POST",
      body: JSON.stringify(loanData),
    });
  }

  async payLoanInstallment(loanId: string, paymentData: PayInstallmentDto): Promise<ApiResponse<any>> {
    return this.request(`/prestamos/pay/${loanId}`, {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }
}

export const apiService = new ApiService();
