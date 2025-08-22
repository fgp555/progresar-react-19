import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell, Button } from "../UI";
import type { Account } from "../../types";
import "./AccountForm.css";

interface AccountListProps {
  accounts: Account[];
  loading: boolean;
  onCreateAccount: () => void;
  onViewTransactions: (accountId: string) => void;
  onViewLoans: (accountId: string) => void;
  onMakeTransaction: (accountId: string) => void;
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  loading,
  onCreateAccount,
  onViewTransactions,
  onViewLoans,
  onMakeTransaction,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "COL$",
    }).format(balance);
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "ahorro":
        return "💰";
      case "corriente":
        return "🏦";
      case "plazo fijo":
        return "📈";
      default:
        return "💳";
    }
  };

  const getAccountTypeBadge = (type: string) => {
    const className = type.replace(" ", "-");
    return (
      <span className={`type-badge ${className}`}>
        {getAccountTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando cuentas...</div>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💳</div>
        <div className="empty-title">No hay cuentas registradas</div>
        <div className="empty-description">Comience creando la primera cuenta bancaria</div>
        <Button variant="primary" onClick={onCreateAccount}>
          Crear Primera Cuenta
        </Button>
      </div>
    );
  }

  return (
    <div className="account-list">
      <div className="list-header">
        <div className="header-content">
          <h1 className="header-title">Cuentas Bancarias</h1>
          <p className="header-subtitle">PROGRESAR</p>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={onCreateAccount}>
            ➕ Crear Cuenta
          </Button>
        </div>
      </div>

      <div className="account-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Cuentas</div>
            <div className="stat-icon">💳</div>
          </div>
          <div className="stat-value">{accounts.length}</div>
          <div className="stat-description">Cuentas registradas</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Saldo Total</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">
            {formatBalance(accounts.reduce((total, account) => total + Number(account.saldo), 0))}
          </div>
          <div className="stat-description">En todas las cuentas</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Cuentas Activas</div>
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-value">{accounts.filter((account) => account.estado === "activa").length}</div>
          <div className="stat-description">Estado operativo</div>
        </div>
      </div>

      <Table className="account-table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Tipo</TableHeaderCell>
            <TableHeaderCell>Número de Cuenta</TableHeaderCell>
            <TableHeaderCell>Propietario</TableHeaderCell>
            <TableHeaderCell>Saldo</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Fecha Creación</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id} className="account-row">
              <TableCell className="account-cell account-type-cell">
                {getAccountTypeBadge(account.tipoCuenta)}
              </TableCell>
              <TableCell className="account-cell account-number-cell">{account.numeroCuenta}</TableCell>
              <TableCell className="account-cell">{account.user?.name || "No disponible"}</TableCell>
              <TableCell className="account-cell account-balance-cell">
                {formatBalance(Number(account.saldo))}
              </TableCell>
              <TableCell className="account-cell">
                <span className={`account-status ${account.estado}`}>{account.estado}</span>
              </TableCell>
              <TableCell className="account-cell">{formatDate(account.fechaCreacion)}</TableCell>
              <TableCell className="account-cell account-actions-cell">
                <div className="action-buttons">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onMakeTransaction(account.id)}
                    title="Realizar transacción"
                  >
                    💸
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewTransactions(account.id)}
                    title="Ver transacciones"
                  >
                    📋
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onViewLoans(account.id)} title="Ver préstamos">
                    🏦
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
