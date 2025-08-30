// src/components/TransaccionesHistorial.tsx
import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardHeader, CardBody } from "../UI";
import { useEffect } from "react";
import "./TransaccionesHistorial.css";

const TransaccionesHistorial = ({ accountId }: { accountId: string }) => {
  const { transactions, loading, error, pagination, fetchAccountTransactions } = useTransactions();

  useEffect(() => {
    fetchAccountTransactions(accountId, 1, 100);
  }, [accountId, fetchAccountTransactions]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader title="Historial de Transacciones" subtitle="Últimas operaciones realizadas" />
      <CardBody>
        {loading && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && transactions.length === 0 && <p>No hay transacciones.</p>}

        <ul className="divide-y">
          {transactions.map((t) => (
            <li key={t.id}>
              <div className="transaction-info">
                <span className="description">
                  {t.tipo} - {t.descripcion}
                </span>
                <span className="date">{formatDate(t.fecha)}</span>
              </div>
              <span
                className={`amount ${
                  ["deposito", "transferencia_entrada", "prestamo_desembolso"].includes(t.tipo)
                    ? "amount-positive"
                    : "amount-negative"
                }`}
              >
                ${t.monto}
              </span>
            </li>
          ))}
        </ul>

        {/* Paginación */}
        {pagination.total > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary"
              disabled={pagination.current === 1}
              onClick={() => fetchAccountTransactions(accountId, pagination.current - 1, 10)}
            >
              ⬅️ Anterior
            </button>
            <span>
              Página {pagination.current} de {pagination.total}
            </span>
            <button
              className="btn btn-secondary"
              disabled={pagination.current === pagination.total}
              onClick={() => fetchAccountTransactions(accountId, pagination.current + 1, 10)}
            >
              Siguiente ➡️
            </button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TransaccionesHistorial;
