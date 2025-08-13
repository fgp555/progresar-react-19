import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { OperationCard } from './OperationCard';
import { TransactionHistory } from './TransactionHistory';
import { LoansList } from './LoansList';

export const AdminUserView: React.FC = () => {
  const { getAdminViewingUser, setAdminViewingUser } = useAuth();
  const user = getAdminViewingUser();

  const handleBackToAdmin = () => {
    setAdminViewingUser(null);
  };

  if (!user) return null;

  return (
    <div className="admin-user-view">
      <div className="admin-view-header">
        <button className="btn" onClick={handleBackToAdmin}>
          ← Volver al Panel Admin
        </button>
      </div>
      
      <div className="user-info">
        <h2>Vista de {user.name}</h2>
        <div className="balance">${user.balance.toFixed(2)}</div>
        <p>Número de Cuenta: {user.accountNumber}</p>
        <p className="admin-notice">Vista de administrador - Operaciones habilitadas</p>
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
