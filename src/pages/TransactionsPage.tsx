// src/pages/TransactionsPage.tsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../components/UI";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionModal } from "../components/Transactions/TransactionModal";
import { useParams } from "react-router-dom";

const TransactionsPage: React.FC = () => {
  const { transactions, loading, error, pagination, fetchAccountTransactions, deposit, withdraw, transfer } =
    useTransactions();
  const [modalType, setModalType] = useState<null | "deposit" | "withdraw" | "transfer">(null);

  const { accountId: paramAccountId } = useParams<{ accountId: string }>();

  const accountId = paramAccountId ?? "419fd57d-a062-41cb-b4a3-f0515b6d2085";
  if (!accountId) {
    return <div>Error: No account ID provided.</div>;
  }

  // cargar transacciones al montar
  useEffect(() => {
    fetchAccountTransactions(accountId, 1, 10);
  }, [accountId, fetchAccountTransactions]);

  const handleSubmit = async (formData: any) => {
    try {
      if (modalType === "deposit") {
        await deposit(accountId, {
          monto: Number(formData.monto),
          descripcion: formData.descripcion,
        });
      } else if (modalType === "withdraw") {
        await withdraw(accountId, {
          monto: Number(formData.monto),
          descripcion: formData.descripcion,
        });
      } else if (modalType === "transfer") {
        await transfer({
          cuentaOrigenId: accountId,
          cuentaDestinoNumero: formData.cuentaDestinoNumero,
          monto: Number(formData.monto),
          descripcion: formData.descripcion,
        });
      }
      setModalType(null);
    } catch (err) {
      alert(`❌ ${(err as Error).message}`);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Transacciones</h1>
        <p className="page-subtitle">Gestión de operaciones bancarias</p>
      </div>

      {/* Tarjetas de acciones */}
      <div className="grid grid-3">
        <Card>
          <CardHeader title="Depósitos" subtitle="Realizar depósitos a cuentas" />
          <CardBody>
            <div className="text-center">
              <div className="text-5xl">💰</div>
              <button className="btn btn-primary mt-2" onClick={() => setModalType("deposit")}>
                Realizar Depósito
              </button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Retiros" subtitle="Realizar retiros de cuentas" />
          <CardBody>
            <div className="text-center">
              <div className="text-5xl">💸</div>
              <button className="btn btn-primary mt-2" onClick={() => setModalType("withdraw")}>
                Realizar Retiro
              </button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Transferencias" subtitle="Transferir entre cuentas" />
          <CardBody>
            <div className="text-center">
              <div className="text-5xl">🔄</div>
              <button className="btn btn-primary mt-2" onClick={() => setModalType("transfer")}>
                Realizar Transferencia
              </button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Historial */}
      <Card>
        <CardHeader title="Historial de Transacciones" subtitle="Últimas operaciones realizadas" />
        <CardBody>
          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && transactions.length === 0 && <p>No hay transacciones.</p>}

          <ul className="divide-y">
            {transactions.map((t) => (
              <li key={t.id} className="py-2 flex justify-between">
                <span>
                  {t.tipo} - {t.descripcion}
                </span>
                <span className="font-bold">${t.monto}</span>
              </li>
            ))}
          </ul>

          {/* Paginación */}
          {pagination.total > 1 && (
            <div className="flex justify-between mt-4">
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

      {/* Modal */}
      {modalType && (
        <TransactionModal
          type={modalType}
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
