// components/TransactionCard/TransactionCard.tsx
import React from "react";
import type { Transaction } from "../../types/transaction.types";
import { formatCurrency, formatDate, getTransactionIcon, getTransactionColor } from "../../utils/transactionUtils";
import styles from "./TransactionCard.module.css";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  return (
    <div className={styles.transactionCard}>
      <div className={styles.transactionHeader}>
        <div className={styles.transactionType}>
          <i
            className={`${getTransactionIcon(transaction.tipo)} ${styles[getTransactionColor(transaction.tipo)]}`}
          ></i>
          <span className={styles.typeName}>
            {transaction.tipo.charAt(0).toUpperCase() + transaction.tipo.slice(1)}
          </span>
        </div>
        <div className={styles.transactionAmount}>
          <span className={styles[getTransactionColor(transaction.tipo)]}>
            {transaction.tipo === "deposito" ? "+" : "-"}
            {formatCurrency(transaction.monto)}
          </span>
        </div>
      </div>

      <div className={styles.transactionDetails}>
        <p className={styles.description}>{transaction.descripcion}</p>
        <div className={styles.transactionMeta}>
          <span className={styles.date}>{formatDate(transaction.fecha)}</span>
          <span className={styles.balance}>
            Saldo: {formatCurrency(transaction.saldoAnterior)} →{" "}
            {formatCurrency(transaction.saldoNuevo)}
          </span>
        </div>
      </div>
    </div>
  );
};
