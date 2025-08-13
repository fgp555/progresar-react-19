import React from 'react';
import { calculateLoanSummary } from '../utils/loanCalculations';

interface LoanSummaryDisplayProps {
  amount: number;
  terms: number;
}

export const LoanSummaryDisplay: React.FC<LoanSummaryDisplayProps> = ({ amount, terms }) => {
  const summary = calculateLoanSummary(amount, terms);

  return (
    <div className="loan-summary">
      <p><strong>Resumen del Préstamo:</strong></p>
      <p>Monto solicitado: ${summary.amount.toFixed(2)}</p>
      <p>Interés total: ${summary.totalInterest.toFixed(2)}</p>
      <p>Total a pagar: ${summary.totalAmount.toFixed(2)}</p>
      <p>Cuota mensual: ${summary.monthlyPayment.toFixed(2)}</p>
    </div>
  );
};
