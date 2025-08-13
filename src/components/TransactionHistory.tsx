import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const TransactionHistory: React.FC = () => {
  const { getCurrentUser, getAdminViewingUser, adminViewingUser } = useAuth();
  const user = adminViewingUser ? getAdminViewingUser() : getCurrentUser();

  if (!user) return null;

  return (
    <div className="transaction-history">
      <h3>📊 Historial de Transacciones</h3>
      <div className="transaction-list">
        {user.transactions.length === 0 ? (
          <p>No hay transacciones registradas</p>
        ) : (
          user.transactions.map(transaction => (
            <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
              <strong>{transaction.description}</strong>
              <br />
              <small>{transaction.date}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
