// components/Pagination/Pagination.tsx
import React from "react";
import type { Pagination } from "../../types/transaction.types";
import styles from "./Pagination.module.css";

interface PaginationProps {
  pagination: Pagination;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PaginationComponent: React.FC<PaginationProps> = ({ pagination, currentPage, onPageChange }) => {
  if (pagination.total <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.pageBtn}>
        Anterior
      </button>
      <span className={styles.pageInfo}>
        Página {pagination.current} de {pagination.total}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pagination.total}
        className={styles.pageBtn}
      >
        Siguiente
      </button>
    </div>
  );
};
