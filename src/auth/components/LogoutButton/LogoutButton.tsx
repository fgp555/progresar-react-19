import React from "react";
import { useAuth } from "../../hooks/useAuth";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button type="button" className="btn btn-primary" onClick={logout}>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
