import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return (
    <div className={`table-container ${className}`}>
      <table>{children}</table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead>{children}</thead>;
};

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, onClick, className = "" }) => {
  return (
    <tr
      onClick={onClick}
      className={`${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </tr>
  );
};

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ children, className = "" }) => {
  return <th className={className}>{children}</th>;
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => {
  return <td className={className}>{children}</td>;
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, totalRecords, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "var(--spacing-4)",
        borderTop: "1px solid var(--secondary-200)",
        backgroundColor: "var(--secondary-50)",
      }}
    >
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--secondary-600)" }}>
        Mostrando {totalRecords} registros
      </div>

      <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "var(--spacing-2) var(--spacing-3)",
            border: "1px solid var(--secondary-300)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          Anterior
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: "var(--spacing-2) var(--spacing-3)",
              border: "1px solid var(--secondary-300)",
              borderRadius: "var(--radius-md)",
              backgroundColor: page === currentPage ? "var(--primary-600)" : "white",
              color: page === currentPage ? "white" : "var(--secondary-700)",
              cursor: "pointer",
              minWidth: "2.5rem",
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "var(--spacing-2) var(--spacing-3)",
            border: "1px solid var(--secondary-300)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "white",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
