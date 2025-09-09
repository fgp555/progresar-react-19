// components/TransactionHistory/TransactionHistory.tsx
import React from "react";
import type { Transaction, Pagination } from "../../types/transaction.types";
import { TransactionCard } from "../TransactionCard/TransactionCard";
import { PaginationComponent } from "../Pagination/Pagination";
import styles from "./TransactionHistory.module.css";

interface TransactionHistoryProps {
  transactions: Transaction[];
  pagination: Pagination | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  pagination,
  currentPage,
  onPageChange,
}) => {
  if (transactions.length === 0) {
    return (
      <div className={styles.noTransactions}>
        <i className="fas fa-receipt"></i>
        <p>No hay transacciones registradas para esta cuenta</p>
      </div>
    );
  }

  return (
    <div className={styles.historyTab}>
      <div className={styles.transactionsList}>
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {pagination && (
        <PaginationComponent
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
