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

export const UserList: React.FC<UserListProps> = ({ users, loading, onCreateUser, onEditUser, onDeleteUser }) => {
  const navigate = useNavigate();

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
          <div className="stat-value">{users.reduce((total, user) => total + user.cupos, 0)}</div>
          <div className="stat-label">Total Cupos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{users.filter((user) => user.cupos > 1).length}</div>
          <div className="stat-label">Cupos Múltiples</div>
        </div>
      </div>

      <Table className="user-table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Usuario</TableHeaderCell>
            <TableHeaderCell>Contacto</TableHeaderCell>
            <TableHeaderCell>Documento</TableHeaderCell>
            <TableHeaderCell>Cupos</TableHeaderCell>
            <TableHeaderCell>Fecha Registro</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} className="user-row" onClick={() => navigate(`/userDetails/${user._id}`)}>
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
                    <div style={{ fontWeight: "500" }}>{`${user.name} ${user.lastName || ""}`}</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--secondary-500)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-1)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "1px 6px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: user.role === "admin" ? "var(--success-100)" : "var(--secondary-100)",
                          color: user.role === "admin" ? "var(--success-700)" : "var(--secondary-600)",
                          fontSize: "var(--font-size-xs)",
                          fontWeight: "500",
                          textTransform: "uppercase",
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="user-cell user-contact-cell">
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "500",
                      color: "var(--secondary-700)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ fontSize: "var(--font-size-xs)" }}>📧</span>
                    <span style={{ fontSize: "var(--font-size-sm)" }}>{user.email}</span>
                  </div>
                  {user.whatsapp && (
                    <div
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--secondary-500)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontSize: "var(--font-size-xs)" }}>📱</span>
                      <span style={{ fontFamily: "monospace" }}>{user.whatsapp}</span>
                    </div>
                  )}
                  {!user.whatsapp && (
                    <div
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--secondary-400)",
                        fontStyle: "italic",
                      }}
                    >
                      Sin teléfono
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="user-cell">
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "500",
                    }}
                  >
                    {user.documentType?.code || "N/A"}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--secondary-500)",
                      fontFamily: "monospace",
                    }}
                  >
                    {user.documentNumber}
                  </span>
                </div>
              </TableCell>

              <TableCell className="user-cell">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--spacing-1)",
                    padding: "var(--spacing-1) var(--spacing-2)",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: user.cupos > 1 ? "var(--success-100)" : "var(--primary-100)",
                    color: user.cupos > 1 ? "var(--success-700)" : "var(--primary-700)",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "600",
                  }}
                >
                  {user.cupos > 1 ? "🌟" : "👤"} {user.cupos}
                </span>
              </TableCell>

              <TableCell className="user-cell user-date-cell">{formatDate(user.createdAt)}</TableCell>

              <TableCell className="user-cell user-actions-cell">
                <div className="action-buttons">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
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
                      e.stopPropagation();
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
