import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Alert, Button } from "../components/UI";
import { useAccounts } from "../hooks/useAccounts";
import { useUsers } from "../hooks/useUsers";
import { AccountForm } from "../components/Accounts/AccountForm";
import type { CreateAccountDto } from "../types";
import { Link } from "react-router-dom";

const AccountsPage: React.FC = () => {
  const { accounts, loading: accountsLoading, fetchAllAccounts, createAccount } = useAccounts();
  const { users, loading: usersLoading } = useUsers();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [isActive, setIsActive] = useState(true);
  // const isActive = true;

  const handleToggle = (account: any) => {
    const newState = !isActive;
    setIsActive(newState);
    console.log("account", account);
    // onToggle(account.id, newState); // Llamada al backend para actualizar
  };

  useEffect(() => {
    fetchAllAccounts();
  }, [fetchAllAccounts]);

  const handleCreateAccount = async (accountData: CreateAccountDto) => {
    if (!selectedUser) {
      setNotification({
        type: "error",
        message: "Debe seleccionar un usuario",
      });
      return;
    }

    try {
      await createAccount(selectedUser, accountData);
      setShowCreateForm(false);
      setSelectedUser("");
      setNotification({
        type: "success",
        message: "Cuenta creada exitosamente",
      });
      await fetchAllAccounts(); // Refresh the list
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Error al crear cuenta",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "COL",
    }).format(balance);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  // const getAccountTypeBadge = (type: string) => {
  //   const className = type.replace(" ", "-");
  //   return (
  //     <span className={`type-badge ${className}`}>
  //       {getAccountTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
  //     </span>
  //   );
  // };

  const loading = accountsLoading || usersLoading;

  if (loading && accounts.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando cuentas...</div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="page-content">
        <Card>
          <CardHeader title="Crear Nueva Cuenta" subtitle="Seleccione el usuario y configure la cuenta" />
          <CardBody>
            <div style={{ marginBottom: "var(--spacing-6)" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "500",
                  color: "var(--secondary-700)",
                  marginBottom: "var(--spacing-2)",
                }}
              >
                Seleccionar Usuario *
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-3)",
                  border: "1px solid var(--secondary-300)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                  backgroundColor: "white",
                }}
              >
                <option value="">Seleccione un usuario...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <AccountForm
              onSubmit={handleCreateAccount}
              onCancel={() => {
                setShowCreateForm(false);
                setSelectedUser("");
              }}
              isLoading={loading}
            />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-content">
      {notification && (
        <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}

      <div className="account-list">
        <div className="list-header">
          <div className="header-content">
            <h1 className="header-title">Cuentas Bancarias</h1>
            <p className="header-subtitle">Gestión de cuentas de PROGRESAR</p>
          </div>
          <div className="header-actions">
            <Button variant="primary" onClick={() => setShowCreateForm(true)} disabled={users.length === 0}>
              ➕ Crear Cuenta
            </Button>
          </div>
        </div>

        {users.length === 0 && (
          <Alert
            type="warning"
            title="Sin Usuarios"
            message="Debe crear usuarios antes de poder crear cuentas. Vaya a la sección de Usuarios primero."
          />
        )}

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

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Tipos de Cuenta</div>
              <div className="stat-icon">📊</div>
            </div>
            <div className="stat-value">{new Set(accounts.map((account) => account.tipoCuenta)).size}</div>
            <div className="stat-description">Tipos diferentes</div>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <div className="empty-title">No hay cuentas registradas</div>
            <div className="empty-description">Comience creando la primera cuenta bancaria</div>
            {users.length > 0 && (
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                Crear Primera Cuenta
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-3">
            {accounts.map((account) => (
              <Card key={account.id} className="account-card">
                <CardBody>
                  <div className="account-header">
                    <div className="account-type">
                      {getAccountTypeIcon(account.tipoCuenta)} {account.tipoCuenta}
                    </div>
                    <div className={`account-status ${account.estado}`}>
                      {account.estado}{" "}
                      <Button variant="secondary" size="sm" onClick={() => handleToggle(account.id)}>
                        {isActive ? (
                          <i className="fa-solid fa-toggle-on" style={{ color: "green" }}></i>
                        ) : (
                          <i className="fa-solid fa-toggle-off" style={{ color: "red" }}></i>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="account-number">{account.numeroCuenta}</div>

                  <div className="account-balance">
                    <div className="balance-label">Saldo Disponible</div>
                    <div className="balance-amount">{formatBalance(Number(account.saldo))}</div>
                    {/* <div className="balance-currency">{account.moneda}</div> */}
                  </div>

                  <div className="account-meta">
                    <div className="meta-item">
                      <div className="meta-label">Propietario</div>
                      <div className="meta-value">
                        {account.user?.name + " " + account.user?.lastName || "No disponible"}
                      </div>
                    </div>
                    <div className="meta-item">
                      <div className="meta-label">Fecha Creación</div>
                      <div className="meta-value">{formatDate(account.fechaCreacion)}</div>
                    </div>
                  </div>

                  <div className="account-actions">
                    <Link to={`/transactions/${account.id}`}>
                      <Button variant="primary" size="sm">
                        💸 Transacciones
                      </Button>
                    </Link>
                    <Link to={`/loans/${account.id}`}>
                      <Button variant="secondary" size="sm">
                        🏦 Préstamos
                      </Button>
                    </Link>
                    <Button variant="secondary" size="sm">
                      <i className="fa-solid fa-pen"></i>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
