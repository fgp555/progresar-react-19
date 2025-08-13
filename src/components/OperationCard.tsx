import React, { useState } from 'react';
import { useBanking } from '../hooks/useBanking';
import { useLoans } from '../hooks/useLoans';
import { LoanSummaryDisplay } from './LoanSummaryDisplay';

interface OperationCardProps {
  type: 'deposit' | 'withdrawal' | 'loan';
}

export const OperationCard: React.FC<OperationCardProps> = ({ type }) => {
  const [amount, setAmount] = useState('');
  const [loanTerms, setLoanTerms] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const { deposit, withdraw } = useBanking();
  const { requestLoan } = useLoans();

  const handleOperation = () => {
    const numAmount = parseFloat(amount);
    let success = false;

    switch (type) {
      case 'deposit':
        success = deposit(numAmount);
        break;
      case 'withdrawal':
        success = withdraw(numAmount);
        break;
      case 'loan':
        success = requestLoan(numAmount, loanTerms);
        break;
    }

    if (success) {
      setAmount('');
      setShowSummary(false);
      alert(getSuccessMessage(type));
    } else {
      alert(getErrorMessage(type));
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'deposit': return '💰 Depositar';
      case 'withdrawal': return '💸 Retirar';
      case 'loan': return '💳 Solicitar Préstamo';
    }
  };

  const getSuccessMessage = (type: string) => {
    switch (type) {
      case 'deposit': return 'Depósito realizado exitosamente';
      case 'withdrawal': return 'Retiro realizado exitosamente';
      case 'loan': return 'Préstamo aprobado exitosamente';
    }
  };

  const getErrorMessage = (type: string) => {
    switch (type) {
      case 'deposit': return 'Error al realizar el depósito';
      case 'withdrawal': return 'Saldo insuficiente';
      case 'loan': return 'Error al procesar el préstamo';
    }
  };

  return (
    <div className="operation-card">
      <h3>{getTitle()}</h3>
      <div className="form-group">
        <label>Monto:</label>
        <input
          type="number"
          placeholder="0.00"
          min="1"
          max={type === 'loan' ? "1000" : undefined}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (type === 'loan') setShowSummary(!!e.target.value);
          }}
        />
      </div>

      {type === 'loan' && (
        <>
          <div className="form-group">
            <label>Cuotas (máximo 6 meses):</label>
            <select 
              value={loanTerms} 
              onChange={(e) => setLoanTerms(parseInt(e.target.value))}
            >
              <option value="1">1 mes - 1.5% interés</option>
              <option value="2">2 meses - 3.0% interés</option>
              <option value="3">3 meses - 4.5% interés</option>
              <option value="4">4 meses - 6.0% interés</option>
              <option value="5">5 meses - 7.5% interés</option>
              <option value="6">6 meses - 9.0% interés</option>
            </select>
          </div>

          {showSummary && amount && (
            <LoanSummaryDisplay amount={parseFloat(amount)} terms={loanTerms} />
          )}
        </>
      )}

      <button 
        className={`btn ${type === 'withdrawal' ? 'btn-danger' : type === 'deposit' ? 'btn-success' : ''}`} 
        onClick={handleOperation}
      >
        {type === 'deposit' ? 'Depositar' : type === 'withdrawal' ? 'Retirar' : 'Solicitar Préstamo'}
      </button>
    </div>
  );
};
