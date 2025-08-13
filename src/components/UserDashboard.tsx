import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { OperationCard } from './OperationCard';
import { TransactionHistory } from './TransactionHistory';
import { LoansList } from './LoansList';

export const UserDashboard: React.FC = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  if (!user) return null;

  return (
    <div className="user-dashboard">
      <div className="user-info">
        <h2>Bienvenido, {user.name}</h2>
        <div className="balance">${user.balance.toFixed(2)}</div>
        <p>Número de Cuenta: {user.accountNumber}</p>
      </div>

      <div className="operations-grid">
        <OperationCard type="deposit" />
        <OperationCard type="withdrawal" />
        <OperationCard type="loan" />
      </div>

      <TransactionHistory />
      <LoansList />
    </div>
  );
};
