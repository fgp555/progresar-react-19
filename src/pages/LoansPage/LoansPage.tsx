// LoansPage.tsx - Componente principal refactorizado

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Loan, LoanInstallment } from "./types/loans";
import { useLoans } from "./hooks/useLoans";
import { formatNumberInput } from "./utils/loanUtils";
import { LoansList } from "./components/LoansList";
import { LoanCalculator } from "./components/LoanCalculator";
import { LoanRequestForm } from "./components/LoanRequestForm";
import { PaymentModals } from "./components/PaymentModals";
import styles from "./LoansPage.module.css";

const LoansPage: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();

  // State para modales
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [showSinglePayModal, setShowSinglePayModal] = useState<boolean>(false);
  const [selectedInstallment, setSelectedInstallment] = useState<LoanInstallment | null>(null);

  // Hook personalizado que maneja toda la lógica
  const {
    loans,
    account,
    loading,
    submitting,
    error,
    activeTab,
    calculation,
    validationErrors,
    createLoanForm,
    payForm,
    singlePayForm,
    setActiveTab,
    // setError,
    setCreateLoanForm,
    setPayForm,
    setSinglePayForm,
    clearValidationError,
    calculateLoan,
    createLoan,
    payInstallments,
    paySingleInstallment,
  } = useLoans(accountId);

  // Handlers para cambios en formularios
  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      const numValue = parseInt(value) || 1;
      setCreateLoanForm((prev) => ({ ...prev, [name]: numValue }));
    } else if (name === "monto") {
      const formattedValue = formatNumberInput(value);
      setCreateLoanForm((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setCreateLoanForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePayFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    clearValidationError(name);

    if (type === "number") {
      const numValue = parseInt(value) || 1;
      setPayForm((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setPayForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSinglePayFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    clearValidationError(name);
    setSinglePayForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers para modales
  const openPayModal = (loan: Loan) => {
    setSelectedLoan(loan);
    const pendingInstallments = loan.cuotas.filter((c) => c.estado === "pendiente").length;
    setPayForm({
      numeroCuotas: Math.min(1, pendingInstallments),
      fechaPago: new Date().toISOString().split("T")[0],
    });
    setShowPayModal(true);
  };

  const openSinglePayModal = (loan: Loan, installment: LoanInstallment) => {
    setSelectedLoan(loan);
    setSelectedInstallment(installment);
    setSinglePayForm({
      installmentId: installment.id,
      fechaPago: new Date().toISOString().split("T")[0],
    });
    setShowSinglePayModal(true);
  };

  const closePayModal = () => {
    setShowPayModal(false);
    setSelectedLoan(null);
  };

  const closeSinglePayModal = () => {
    setShowSinglePayModal(false);
    setSelectedLoan(null);
    setSelectedInstallment(null);
  };

  // Handlers para pagos
  const handlePayInstallments = async () => {
    if (selectedLoan) {
      await payInstallments(selectedLoan.id);
      closePayModal();
    }
  };

  const handlePaySingleInstallment = async () => {
    if (selectedLoan) {
      await paySingleInstallment(selectedLoan.id);
      closeSinglePayModal();
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando préstamos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Préstamos</h1>
        {/* <pre>{JSON.stringify(account?.usuarioId, null, 2)}</pre> */}
        {account?.usuarioId && (
          <Link to={`/userDetails/${account?.usuarioId}`} className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i>
            Volver a la cuenta
          </Link>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Account Info */}
      {/* {account && (
        <div className={styles.accountInfo}>
          <div className={styles.accountDetails}>
            <h3>Cuenta: {account.numeroCuenta}</h3>
            <p>Saldo actual: {formatCurrency(account.saldo)}</p>
            <p>Monto máximo préstamo: {formatCurrency((parseFloat(account.saldo) * 2).toString())}</p>
            <span className={`${styles.accountStatus} ${styles[account.estado]}`}>{account.estado.toUpperCase()}</span>
          </div>
        </div>
      )} */}

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("loans")}
          className={`${styles.tab} ${activeTab === "loans" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-list"></i>
          Mis Préstamos
        </button>
        <button
          onClick={() => setActiveTab("calculate")}
          className={`${styles.tab} ${activeTab === "calculate" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-calculator"></i>
          Calculadora
        </button>
        <button
          onClick={() => setActiveTab("request")}
          className={`${styles.tab} ${activeTab === "request" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-plus-circle"></i>
          Asignar Préstamo
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "loans" && (
          <div className={styles.loansTab}>
            <LoansList
              loans={loans}
              onPayMultiple={openPayModal}
              onPaySingle={openSinglePayModal}
              onRequestLoan={() => setActiveTab("request")}
            />
          </div>
        )}

        {activeTab === "calculate" && (
          <LoanCalculator
            form={createLoanForm}
            calculation={calculation}
            onFormChange={handleCreateFormChange}
            onCalculate={calculateLoan}
            onClearValidationError={clearValidationError}
          />
        )}

        {activeTab === "request" && (
          <LoanRequestForm
            form={createLoanForm}
            validationErrors={validationErrors}
            submitting={submitting}
            onFormChange={handleCreateFormChange}
            onSubmit={createLoan}
            onClearValidationError={clearValidationError}
          />
        )}
      </div>

      {/* Payment Modals */}
      <PaymentModals
        showPayModal={showPayModal}
        selectedLoan={selectedLoan}
        payForm={payForm}
        showSinglePayModal={showSinglePayModal}
        selectedInstallment={selectedInstallment}
        singlePayForm={singlePayForm}
        validationErrors={validationErrors}
        submitting={submitting}
        onClosePayModal={closePayModal}
        onCloseSinglePayModal={closeSinglePayModal}
        onPayFormChange={handlePayFormChange}
        onSinglePayFormChange={handleSinglePayFormChange}
        onPayInstallments={handlePayInstallments}
        onPaySingleInstallment={handlePaySingleInstallment}
      />
    </div>
  );
};

export default LoansPage;
