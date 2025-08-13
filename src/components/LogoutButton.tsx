import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button 
      className="btn btn-danger"
      onClick={logout}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}
    >
      Cerrar Sesión
    </button>
  );
};
