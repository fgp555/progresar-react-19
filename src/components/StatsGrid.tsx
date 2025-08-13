import React from 'react';

interface StatsGridProps {
  stats: { 
    totalUsers: number; 
    totalBalance: number; 
    totalLoans: number; 
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>{stats.totalUsers}</h3>
        <p>Usuarios Totales</p>
      </div>
      <div className="stat-card">
        <h3>${stats.totalBalance.toFixed(2)}</h3>
        <p>Balance Total</p>
      </div>
      <div className="stat-card">
        <h3>{stats.totalLoans}</h3>
        <p>Préstamos Activos</p>
      </div>
    </div>
  );
};
