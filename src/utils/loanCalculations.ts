import type { LoanSummary } from '../types';

export const calculateLoanSummary = (amount: number, terms: number): LoanSummary => {
  const interestRate = terms * 1.5;
  const totalInterest = (amount * interestRate) / 100;
  const totalAmount = amount + totalInterest;
  const monthlyPayment = totalAmount / terms;

  return {
    amount,
    interestRate,
    totalInterest,
    totalAmount,
    monthlyPayment
  };
};

export const getNextPaymentDate = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toLocaleDateString();
};
