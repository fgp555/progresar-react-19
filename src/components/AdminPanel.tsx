import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { StatsGrid } from './StatsGrid';
import { UserCard } from './UserCard';

export const AdminPanel: React.FC = () => {
  const { users, createUser } = useAuthStore();
  const [newUserData, setNewUserData] = useState({
    name: '',
    balance: '',
    password: ''
  });

  const handleCreateUser = () => {
    const { name, balance, password } = newUserData;
    if (!name || !password) {
      alert('Por favor complete todos los campos');
      return;
    }

    createUser(name, parseFloat(balance) || 0, password);
    setNewUserData({ name: '', balance: '', password: '' });
    alert('Usuario creado exitosamente');
  };

  const getTotalStats = () => {
    const totalUsers = Object.keys(users).length;
    const totalBalance = Object.values(users).reduce((sum, user) => sum + user.balance, 0);
    const totalLoans = Object.values(users).reduce((sum, user) => 
      sum + user.loans.filter(loan => loan.status === 'active').length, 0
    );
    return { totalUsers, totalBalance, totalLoans };
  };

  const stats = getTotalStats();

  return (
    <div className="admin-panel">
      <h2>🔧 Panel de Administrador</h2>
      
      <StatsGrid stats={stats} />

      <div className="create-user-section">
        <h3>➕ Crear Nuevo Usuario</h3>
        <div className="create-user-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              placeholder="Nombre completo"
              value={newUserData.name}
              onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Balance Inicial:</label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              value={newUserData.balance}
              onChange={(e) => setNewUserData({...newUserData, balance: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={newUserData.password}
              onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
            />
          </div>
          <button className="btn btn-success" onClick={handleCreateUser}>
            Crear
          </button>
        </div>
      </div>

      <h3>👥 Gestión de Usuarios</h3>
      <div className="users-grid">
        {Object.entries(users).map(([userId, user]) => (
          <UserCard key={userId} userId={userId} user={user} />
        ))}
      </div>
    </div>
  );
};
