// utils/transactionUtils.ts
export const formatCurrency = (amount: string): string => {
    const number = parseFloat(amount);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(number);
  };
  
  export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  export const getTransactionIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case "deposito":
        return "fas fa-arrow-down";
      case "retiro":
        return "fas fa-arrow-up";
      case "transferencia":
        return "fas fa-exchange-alt";
      default:
        return "fas fa-money-bill-wave";
    }
  };
  
  export const getTransactionColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "deposito":
        return "deposit";
      case "retiro":
        return "withdrawal";
      case "transferencia":
        return "transfer";
      default:
        return "other";
    }
  };
  