import { useAuthStore } from '../stores/authStore';
import { calculateLoanSummary, getNextPaymentDate } from '../utils/loanCalculations';
import { validateLoanAmount } from '../utils/validators';
import type { Loan } from '../types';

export const useLoans = () => {
  const { 
    currentUser, 
    adminViewingUser, 
    users, 
    addLoan, 
    payLoanInstallment,
    addTransaction 
  } = useAuthStore();

  const getTargetUserId = () => adminViewingUser || currentUser;

  const requestLoan = (amount: number, terms: number): boolean => {
    const userId = getTargetUserId();
    if (!userId || !validateLoanAmount(amount)) return false;

    const user = users[userId];
    if (!user) return false;

    const activeLoans = user.loans.filter(loan => loan.status === 'active');
    if (activeLoans.length >= 2) return false;

    const summary = calculateLoanSummary(amount, terms);
    
    const loan: Loan = {
      id: Date.now(),
      amount: summary.amount,
      interestRate: summary.interestRate,
      totalInterest: summary.totalInterest,
      totalAmount: summary.totalAmount,
      monthlyPayment: summary.monthlyPayment,
      terms,
      remainingPayments: terms,
      status: 'active',
      dateCreated: new Date().toLocaleDateString(),
      nextPaymentDate: getNextPaymentDate()
    };

    addLoan(userId, loan);
    addTransaction(userId, 'loan', amount, `Préstamo aprobado: +$${amount.toFixed(2)} (${terms} cuotas)`);
    return true;
  };

  const payInstallment = (loanId: number): boolean => {
    const userId = getTargetUserId();
    if (!userId) return false;

    return payLoanInstallment(userId, loanId);
  };

  return { requestLoan, payInstallment };
};
