// components/TransactionsPage/TransactionsPage.tsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTransactions } from "../../hooks/useTransactions";
import { useTransactionForm } from "../../hooks/useTransactionForm";
import { TabNavigation } from "../TabNavigation/TabNavigation";
import { TransactionHistory } from "../TransactionHistory/TransactionHistory";
import { TransactionFormComponent } from "../TransactionForm/TransactionForm";
import type { TabType } from "../../types/transaction.types";
// import { formatCurrency } from "../../utils/transactionUtils";
import styles from "./TransactionsPage.module.css";

const TransactionsPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<TabType>("history");

  const { transactions, pagination, user, loading, error, refreshTransactions, setError } = useTransactions(
    accountId,
    currentPage
  );

  const { depositForm, withdrawForm, submitting, validationErrors, handleFormChange, handleTransaction } =
    useTransactionForm(accountId, () => {
      refreshTransactions();
      setCurrentPage(1);
      setActiveTab("history");
    });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTransactionSubmit = async (type: "deposit" | "withdraw") => {
    try {
      await handleTransaction(type);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando transacciones...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {user && (
          <Link to={`/userDetails/${user._id}`} className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i>
            Volver a la cuenta
          </Link>
        )}
        <h1 className={styles.title}>Gestión de Transacciones</h1>
        {/* <pre>{JSON.stringify(accountId, null, 2)}</pre> */}
        <Link to={`/transactions/transfer/${accountId}`} className={styles.transferBtn}>
          <i className="fas fa-exchange-alt"></i>
          Transferir
        </Link>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.tabContent}>
        {activeTab === "history" && (
          <TransactionHistory
            transactions={transactions}
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {activeTab === "deposit" && (
          <TransactionFormComponent
            type="deposit"
            form={depositForm}
            submitting={submitting}
            validationErrors={validationErrors}
            onChange={handleFormChange}
            onSubmit={handleTransactionSubmit}
          />
        )}

        {activeTab === "withdraw" && (
          <TransactionFormComponent
            type="withdraw"
            form={withdrawForm}
            submitting={submitting}
            validationErrors={validationErrors}
            onChange={handleFormChange}
            onSubmit={handleTransactionSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
