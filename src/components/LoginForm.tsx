import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const { login } = useAuth();

  const handleLogin = () => {
    if (!selectedUser || !password) {
      setAlert({ message: 'Por favor seleccione un usuario e ingrese la contraseña', type: 'danger' });
      return;
    }

    const success = login(selectedUser, password);
    if (!success) {
      setAlert({ message: 'Credenciales incorrectas', type: 'danger' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-section">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <div className="form-group">
          <label htmlFor="userSelect">Seleccionar Usuario:</label>
          <select 
            id="userSelect" 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            <option value="admin">Administrador</option>
            <option value="user1">ALIRIO MANRIQUE - 10001</option>
            <option value="user2">ELOINA MANRIQUE - 10002</option>
            <option value="user3">PEDRO CONTRERAS - 10003</option>
            <option value="user4">PEDRO CONTRERAS - 10004</option>
            <option value="user5">AUGUSTO CONTRERAS - 10005</option>
            <option value="user6">AUGUSTO CONTRERAS - 10006</option>
            <option value="user7">SANDRA MORENO - 10007</option>
            <option value="user8">SANDRA MORENO - 10008</option>
            <option value="user9">BRAYAN IDARRAGA - 10009</option>
            <option value="user10">BRAYAN MORENO - 10010</option>
            <option value="user11">DIEGO TORRES - 10011</option>
            <option value="user12">CAROLINA REATIGA - 10012</option>
            <option value="user13">MARIA VARGAS - 10013</option>
            <option value="user14">STELLA AMAYA - 10014</option>
            <option value="user15">DAVID LOPEZ - 10015</option>
            <option value="user16">JESSICA PLATA - 10016</option>
            <option value="user17">JESSICA PLATA - 10017</option>
            <option value="user18">CESAR MANRIQUE - 10018</option>
            <option value="user19">CESAR MANRIQUE - 10019</option>
            <option value="user20">DIEGO CONTRERAS - 10020</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button className="btn" onClick={handleLogin}>
          Iniciar Sesión
        </button>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Admin: admin / admin123</p>
          <p>Usuarios: password123</p>
        </div>
      </div>
    </div>
  );
};
