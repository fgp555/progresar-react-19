// src/components/Accounts/AccountCard.tsx
import React, { useState } from "react";
import { Card, CardBody, Button } from "../UI";
import { Link } from "react-router-dom";
import { formatBalance } from "@/utils/formatBalance";
import { useAuth } from "@/auth/hooks/useAuth";
import axiosInstance from "@/config/axiosInstance";

interface AccountCardProps {
  account: any;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const [isActive, setIsActive] = useState(account.estado === "activa");
  // const isActive = true;

  const handleToggle = async (account: any) => {
    const newState = isActive ? "inactiva" : "activa"; // alternar estado
    setIsActive(!isActive);

    try {
      const { data }: any = await axiosInstance.put(`/api/progresar/cuentas/${account.id}`, {
        estado: newState,
      });

      console.log("✅ Cuenta actualizada:", data.data);
    } catch (error) {
      console.error("❌ No se pudo actualizar la cuenta:", error);
      setIsActive(isActive); // revertir si falla
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "ahorro":
        return "💰";
      case "corriente":
        return "🏦";
      case "prestamo":
        return "📈";
      default:
        return "💳";
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const { hasRole } = useAuth();

  return (
    <Card key={account.id} className="account-card">
      {/* <pre>{JSON.stringify(account, null, 2)}</pre> */}
      <CardBody>
        <div className="account-header">
          <div className="account-type">
            {getAccountTypeIcon(account.tipoCuenta)} {account.tipoCuenta}
          </div>
          {hasRole("admin") && (
            <div className={`account-status ${account.estado}`}>
              {isActive ? "Activa" : "Inactiva"}{" "}
              <Button variant="secondary" size="sm" onClick={() => handleToggle(account)}>
                {isActive ? (
                  <i className="fa-solid fa-toggle-on" style={{ color: "green" }}></i>
                ) : (
                  <i className="fa-solid fa-toggle-off" style={{ color: "red" }}></i>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="account-number">{account.numeroCuenta}</div>

        <div className="account-balance">
          <div className="balance-label">Saldo Disponible</div>
          <div className="balance-amount">{formatBalance(Number(account.saldo))}</div>
        </div>

        <div className="account-meta">
          {account.user && (
            <div className="meta-item">
              <>
                <div className="meta-label">Propietario</div>
                <div className="meta-value">{account.user?.name + " " + account.user?.lastName || "No disponible"}</div>
              </>
            </div>
          )}
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
          {/* editar button */}
          <Link to={`/accounts/edit/${account.usuarioId}`}>
            <Button variant="secondary" size="sm">
              📝 Editar
            </Button>
          </Link>

        </div>
      </CardBody>
    </Card>
  );
};

export default AccountCard;
