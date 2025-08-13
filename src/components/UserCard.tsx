import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { User } from '../types';

interface UserCardProps {
  userId: string;
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ userId, user }) => {
  const { setAdminViewingUser, setSelectedUserForDetails } = useAuthStore();

  const handleViewAccount = () => {
    setAdminViewingUser(userId);
  };

  const handleShowDetails = () => {
    setSelectedUserForDetails(userId);
  };

  return (
    <div className="user-card">
      <h4>{user.name}</h4>
      <p><strong>Cuenta:</strong> {user.accountNumber}</p>
      <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>
      <p><strong>Transacciones:</strong> {user.transactions.length}</p>
      <p><strong>Préstamos:</strong> {user.loans.filter(loan => loan.status === 'active').length} activos</p>
      <div className="user-actions">
        <button className="btn" onClick={handleViewAccount}>
          👁️ Ver Cuenta
        </button>
        <button className="btn" onClick={handleShowDetails}>
          📋 Detalles
        </button>
      </div>
    </div>
  );
};
