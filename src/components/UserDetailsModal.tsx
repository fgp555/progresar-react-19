import React from 'react';
import { useAuthStore } from '../stores/authStore';

export const UserDetailsModal: React.FC = () => {
  const { selectedUserForDetails, users, setSelectedUserForDetails, updateUserBalance, resetPassword, deleteUser } = useAuthStore();

  if (!selectedUserForDetails) return null;

  const user = users[selectedUserForDetails];
  if (!user) return null;

  const handleClose = () => {
    setSelectedUserForDetails(null);
  };

  const handleAdjustBalance = (operation: 'add' | 'subtract') => {
    const amount = parseFloat(prompt('Ingrese el monto:') || '0');
    if (amount > 0) {
      updateUserBalance(selectedUserForDetails, amount, operation);
      alert('Balance actualizado');
    }
  };

  const handleResetPassword = () => {
    const newPassword = prompt('Ingrese la nueva contraseña:');
    if (newPassword) {
      resetPassword(selectedUserForDetails, newPassword);
      alert('Contraseña actualizada exitosamente');
    }
  };

  const handleDeleteUser = () => {
    if (confirm(`¿Está seguro de eliminar al usuario ${user.name}?`)) {
      deleteUser(selectedUserForDetails);
      handleClose();
      alert('Usuario eliminado');
    }
  };

  return (
    <div className="modal" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles de {user.name}</h2>
          <button className="close" onClick={handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="detail-section">
            <h4>📋 Información General</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Nombre Completo</strong>
                <span>{user.name}</span>
              </div>
              <div className="detail-item">
                <strong>Número de Cuenta</strong>
                <span>{user.accountNumber}</span>
              </div>
              <div className="detail-item">
                <strong>Balance Actual</strong>
                <span>${user.balance.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <strong>Estado de Cuenta</strong>
                <span style={{color: user.balance >= 0 ? '#27ae60' : '#e74c3c'}}>
                  {user.balance >= 0 ? 'Activa' : 'Sobregiro'}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>💳 Préstamos</h4>
            {user.loans.length === 0 ? (
              <p>No tiene préstamos registrados</p>
            ) : (
              user.loans.map(loan => (
                <div key={loan.id} className="detail-item loan-detail">
                  <div className="loan-detail-header">
                    <strong>Préstamo #{loan.id.toString().slice(-4)}</strong>
                    <span className={`loan-status ${loan.status}`}>
                      {loan.status === 'active' ? 'Activo' : 'Pagado'}
                    </span>
                  </div>
                  <div className="loan-detail-grid">
                    <div><strong>Monto:</strong> ${loan.amount.toFixed(2)}</div>
                    <div><strong>Interés:</strong> {loan.interestRate}%</div>
                    <div><strong>Total:</strong> ${loan.totalAmount.toFixed(2)}</div>
                    <div><strong>Cuota:</strong> ${loan.monthlyPayment.toFixed(2)}</div>
                    <div><strong>Restantes:</strong> {loan.remainingPayments}/{loan.terms}</div>
                    <div><strong>Creado:</strong> {loan.dateCreated}</div>
                  </div>
                  {loan.status === 'active' && (
                    <div className="next-payment">
                      <strong>Próximo pago:</strong> {loan.nextPaymentDate}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="detail-section">
            <h4>📊 Historial de Transacciones</h4>
            {user.transactions.length === 0 ? (
              <p>No hay transacciones registradas</p>
            ) : (
              user.transactions.slice(0, 10).map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-detail">
                    <strong>{transaction.description}</strong>
                    <span className="transaction-date">{transaction.date}</span>
                  </div>
                </div>
              ))
            )}
            {user.transactions.length > 10 && (
              <p className="more-transactions">... y más transacciones</p>
            )}
          </div>

          <div className="detail-section">
            <h4>🔧 Acciones de Administrador</h4>
            <div className="admin-actions">
              <button className="btn" onClick={() => handleAdjustBalance('add')}>
                💰 Agregar Dinero
              </button>
              <button className="btn btn-danger" onClick={() => handleAdjustBalance('subtract')}>
                💸 Restar Dinero
              </button>
              <button className="btn btn-success" onClick={handleResetPassword}>
                🔑 Reset Contraseña
              </button>
              <button className="btn btn-danger" onClick={handleDeleteUser}>
                🗑️ Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
