// src/pages/TransactionsPage.tsx
import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../components/UI";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionModal } from "../components/Transactions/TransactionModal";
import { useParams } from "react-router-dom";
import TransaccionesHistorial from "@/components/TransaccionesHistorial/TransaccionesHistorial";
import { useAuth } from "@/auth/hooks/useAuth";

const TransactionsPage: React.FC = () => {
  const { deposit, withdraw, transfer } = useTransactions();
  const [modalType, setModalType] = useState<null | "deposit" | "withdraw" | "transfer">(null);

  const { accountId: paramAccountId } = useParams<{ accountId: string }>();

  const accountId = paramAccountId;
  if (!accountId) {
    return <div>Error: No account ID provided.</div>;
  }

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

  const { hasRole } = useAuth();

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Transacciones</h1>
        <p className="page-subtitle">Gestión de operaciones</p>
      </div>

      {/* Tarjetas de acciones */}
      {hasRole("admin") && (
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
      )}

      <TransaccionesHistorial accountId={accountId} />

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
