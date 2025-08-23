import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardHeader, CardBody } from "../UI";
// import "./TransaccionesHistorial.css";

const TransaccionesHistorial = ({ accountId }: { accountId: string }) => {
  const { transactions, loading, error, pagination, fetchAccountTransactions } = useTransactions();

  return (
    <>
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
    </>
  );
};

export default TransaccionesHistorial;
