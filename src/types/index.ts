export interface User {
  name: string;
  balance: number;
  accountNumber: string;
  password: string;
  transactions: Transaction[];
  loans: Loan[];
}

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'loan';
  amount: number;
  description: string;
  date: string;
}

export interface Loan {
  id: number;
  amount: number;
  interestRate: number;
  totalInterest: number;
  totalAmount: number;
  monthlyPayment: number;
  terms: number;
  remainingPayments: number;
  status: 'active' | 'paid';
  dateCreated: string;
  nextPaymentDate: string;
}

export interface LoanSummary {
  amount: number;
  interestRate: number;
  totalInterest: number;
  totalAmount: number;
  monthlyPayment: number;
}
