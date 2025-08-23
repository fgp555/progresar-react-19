// src\components\Users\UserList.tsx

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell, Button } from "../UI";
import type { User } from "../../types";
import "./UserForm.css";
import { useNavigate } from "react-router-dom";

interface UserListProps {
  users: User[];
  loading: boolean;
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  onCreateUser,
  onEditUser,
  onDeleteUser,
}) => {
  const navigate = useNavigate(); // 👈 hook de navegación

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando usuarios...</div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <div className="empty-title">No hay usuarios registrados</div>
        <div className="empty-description">Comience creando el primer usuario de PROGRESAR</div>
        <Button variant="primary" onClick={onCreateUser}>
          Crear Primer Usuario
        </Button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="list-header">
        <div>
          <h1 className="header-title">Usuarios</h1>
          <p style={{ color: "var(--secondary-600)", marginTop: "var(--spacing-1)" }}>
            Gestión de usuarios de PROGRESAR
          </p>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={onCreateUser}>
            ➕ Crear Usuario
          </Button>
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-item">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Usuarios</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{users.reduce((total, user) => total + (user.cuentas?.length || 0), 0)}</div>
          <div className="stat-label">Total Cuentas</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{users.filter((user) => (user.cuentas?.length || 0) > 0).length}</div>
          <div className="stat-label">Con Cuentas</div>
        </div>
      </div>

      <Table className="user-table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Usuario</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Teléfono</TableHeaderCell>
            <TableHeaderCell>Cuentas</TableHeaderCell>
            <TableHeaderCell>Fecha Registro</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              className="user-row"
              onClick={() => navigate(`/userDetails/${user._id}`)} // 👈 redirección al detalle
            >
              <TableCell className="user-cell user-name-cell">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)" }}>
                  <div
                    className="user-avatar"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary-500), var(--primary-600))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "var(--font-size-sm)",
                    }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: "500" }}>{`${user.name} ${user.lastName}`}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="user-cell user-email-cell">{user.email}</TableCell>
              <TableCell className="user-cell user-phone-cell">{user.whatsapp || "-"}</TableCell>
              <TableCell className="user-cell">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--spacing-1)",
                    padding: "var(--spacing-1) var(--spacing-2)",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--primary-100)",
                    color: "var(--primary-700)",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "500",
                  }}
                >
                  💳 {user.cuentas?.length || 0}
                </span>
              </TableCell>
              <TableCell className="user-cell user-date-cell">{formatDate(user.createdAt)}</TableCell>
              <TableCell className="user-cell user-actions-cell">
                <div className="action-buttons">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // ❌ evita que dispare el onClick de la fila
                      onEditUser(user);
                    }}
                    title="Editar usuario"
                  >
                    ✏️
                  </Button>

                  <Button
                    variant="error"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // ❌ evita navegación
                      onDeleteUser(user._id);
                    }}
                    title="Eliminar usuario"
                  >
                    🗑️
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
