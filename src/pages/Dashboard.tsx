import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "../components/UI";
import { apiService } from "../services/api";
import "../components/Layout/Layout.css";
import { useAccounts } from "../hooks/useAccounts";
import { useUsers } from "../hooks/useUsers";

interface DashboardStats {
  usuarios: number;
  cuentas: number;
  transacciones: number;
  prestamos: number;
  prestamosActivos: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    usuarios: 0,
    cuentas: 0,
    transacciones: 0,
    prestamos: 0,
    prestamosActivos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { users } = useUsers();
  const { accounts: userAccounts, fetchAllAccounts: fetchUserAccounts } = useAccounts();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.healthCheck();
        if (response.success && response.data?.stats) {
          setStats(response.data.stats);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchUserAccounts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-title">Error en el Dashboard</div>
        <div className="error-description">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general de PROGRESAR</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Usuarios</div>
            <div className="stat-icon">👥</div>
          </div>
          {/* <pre>{JSON.stringify(accounts, null, 2)}</pre> */}
          <div className="stat-value">{users.length}</div>
          <div className="stat-change neutral">Usuarios registrados en el sistema</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Cuentas</div>
            <div className="stat-icon">💳</div>
          </div>
          <div className="stat-value">{userAccounts.length}</div>
          <div className="stat-change neutral">Cuentas activas</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Transacciones</div>
            <div className="stat-icon">💸</div>
          </div>
          <div className="stat-value">{stats.transacciones}</div>
          <div className="stat-change neutral">Total de operaciones realizadas</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Préstamos</div>
            <div className="stat-icon">🏦</div>
          </div>
          <div className="stat-value">{stats.prestamos}</div>
          <div className="stat-change positive">{stats.prestamosActivos} activos</div>
        </div>
      </div>

      <div className="grid grid-2">
        <Card>
          <CardHeader title="Acceso Rápido" subtitle="Operaciones frecuentes" />
          <CardBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
              <a
                href="/users"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-3)",
                  padding: "var(--spacing-3)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  color: "var(--secondary-700)",
                  backgroundColor: "var(--secondary-50)",
                  transition: "var(--transition-colors)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary-50)";
                  e.currentTarget.style.color = "var(--primary-700)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary-50)";
                  e.currentTarget.style.color = "var(--secondary-700)";
                }}
              >
                <span style={{ fontSize: "var(--font-size-xl)" }}>👥</span>
                <div>
                  <div style={{ fontWeight: "500" }}>Gestionar Usuarios</div>
                  <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>Crear y administrar usuarios</div>
                </div>
              </a>

              <a
                href="/accounts"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-3)",
                  padding: "var(--spacing-3)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  color: "var(--secondary-700)",
                  backgroundColor: "var(--secondary-50)",
                  transition: "var(--transition-colors)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary-50)";
                  e.currentTarget.style.color = "var(--primary-700)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary-50)";
                  e.currentTarget.style.color = "var(--secondary-700)";
                }}
              >
                <span style={{ fontSize: "var(--font-size-xl)" }}>💳</span>
                <div>
                  <div style={{ fontWeight: "500" }}>Gestionar Cuentas</div>
                  <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>Administrar cuentas</div>
                </div>
              </a>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Estado del Sistema" subtitle="Información del servidor" />
          <CardBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-2)",
                  padding: "var(--spacing-3)",
                  backgroundColor: "var(--success-50)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--success-200)",
                }}
              >
                <span style={{ fontSize: "var(--font-size-xl)" }}>✅</span>
                <div>
                  <div style={{ fontWeight: "500", color: "var(--success-700)" }}>Sistema Operativo</div>
                  <div style={{ fontSize: "var(--font-size-sm)", color: "var(--success-700)" }}>
                    Todas las funciones disponibles
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-2)",
                  padding: "var(--spacing-3)",
                  backgroundColor: "var(--info-50)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--info-200)",
                }}
              >
                <span style={{ fontSize: "var(--font-size-xl)" }}>🔄</span>
                <div>
                  <div style={{ fontWeight: "500", color: "var(--info-700)" }}>Base de Datos Activa</div>
                  <div style={{ fontSize: "var(--font-size-sm)", color: "var(--info-700)" }}>
                    Conexión estable establecida
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-2)",
                  padding: "var(--spacing-3)",
                  backgroundColor: "var(--secondary-50)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--secondary-200)",
                }}
              >
                <span style={{ fontSize: "var(--font-size-xl)" }}>🕐</span>
                <div>
                  <div style={{ fontWeight: "500" }}>Última Actualización</div>
                  <div style={{ fontSize: "var(--font-size-sm)", color: "var(--secondary-600)" }}>
                    {new Date().toLocaleString("es-PE")}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
