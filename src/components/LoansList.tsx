import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLoans } from '../hooks/useLoans';

export const LoansList: React.FC = () => {
  const { getCurrentUser, getAdminViewingUser, adminViewingUser } = useAuth();
  const { payInstallment } = useLoans();
  const user = adminViewingUser ? getAdminViewingUser() : getCurrentUser();

  if (!user) return null;

  const handlePayment = (loanId: number) => {
    const success = payInstallment(loanId);
    if (success) {
      alert('Cuota pagada exitosamente');
    } else {
      alert('Saldo insuficiente para pagar la cuota');
    }
  };

  return (
    <div className="loans-section">
      <h3>💳 {adminViewingUser ? 'Préstamos del Usuario' : 'Mis Préstamos'}</h3>
      <div className="loans-list">
        {user.loans.length === 0 ? (
          <p>No tiene préstamos registrados</p>
        ) : (
          user.loans.map(loan => (
            <div key={loan.id} className="loan-item">
              <div className="loan-header">
                <strong>Préstamo #{loan.id.toString().slice(-4)}</strong>
                <span className={`loan-status ${loan.status}`}>
                  {loan.status === 'active' ? 'Activo' : 'Pagado'}
                </span>
              </div>
              <p><strong>Monto original:</strong> ${loan.amount.toFixed(2)}</p>
              <p><strong>Interés:</strong> {loan.interestRate}% (${loan.totalInterest.toFixed(2)})</p>
              <p><strong>Total a pagar:</strong> ${loan.totalAmount.toFixed(2)}</p>
              <p><strong>Cuota mensual:</strong> ${loan.monthlyPayment.toFixed(2)}</p>
              <p><strong>Cuotas restantes:</strong> {loan.remainingPayments}/{loan.terms}</p>
              {loan.status === 'active' ? (
                <>
                  <p><strong>Próximo pago:</strong> {loan.nextPaymentDate}</p>
                  <button 
                    className="btn btn-success loan-payment-btn" 
                    onClick={() => handlePayment(loan.id)}
                  >
                    Pagar Cuota (${loan.monthlyPayment.toFixed(2)})
                  </button>
                </>
              ) : (
                <p className="loan-paid">✓ Préstamo completamente pagado</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
