import { create } from 'zustand';
import type { User, Transaction, Loan } from '../types';

interface AuthStore {
  currentUser: string | null;
  isAdmin: boolean;
  adminViewingUser: string | null;
  selectedUserForDetails: string | null;
  users: Record<string, User>;
  userCounter: number;
  
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  setAdminViewingUser: (userId: string | null) => void;
  setSelectedUserForDetails: (userId: string | null) => void;
  createUser: (name: string, balance: number, password: string) => void;
  deleteUser: (userId: string) => void;
  updateUserBalance: (userId: string, amount: number, operation: 'add' | 'subtract') => void;
  resetPassword: (userId: string, newPassword: string) => void;
  addTransaction: (userId: string, type: 'deposit' | 'withdrawal' | 'loan', amount: number, description: string) => void;
  addLoan: (userId: string, loan: Loan) => void;
  payLoanInstallment: (userId: string, loanId: number) => boolean;
}

const initialUsers: Record<string, User> = {
  user1: { name: 'ALIRIO MANRIQUE', balance: 540, accountNumber: '10001', password: 'password123', transactions: [], loans: [] },
  user2: { name: 'ELOINA MANRIQUE', balance: 540, accountNumber: '10002', password: 'password123', transactions: [], loans: [] },
  user3: { name: 'PEDRO CONTRERAS', balance: 540, accountNumber: '10003', password: 'password123', transactions: [], loans: [] },
  user4: { name: 'PEDRO CONTRERAS', balance: 540, accountNumber: '10004', password: 'password123', transactions: [], loans: [] },
  user5: { name: 'AUGUSTO CONTRERAS', balance: 540, accountNumber: '10005', password: 'password123', transactions: [], loans: [] },
  user6: { name: 'AUGUSTO CONTRERAS', balance: 540, accountNumber: '10006', password: 'password123', transactions: [], loans: [] },
  user7: { name: 'SANDRA MORENO', balance: 540, accountNumber: '10007', password: 'password123', transactions: [], loans: [] },
  user8: { name: 'SANDRA MORENO', balance: 540, accountNumber: '10008', password: 'password123', transactions: [], loans: [] },
  user9: { name: 'BRAYAN IDARRAGA', balance: 540, accountNumber: '10009', password: 'password123', transactions: [], loans: [] },
  user10: { name: 'BRAYAN MORENO', balance: 540, accountNumber: '10010', password: 'password123', transactions: [], loans: [] },
  user11: { name: 'DIEGO TORRES', balance: 540, accountNumber: '10011', password: 'password123', transactions: [], loans: [] },
  user12: { name: 'CAROLINA REATIGA', balance: 540, accountNumber: '10012', password: 'password123', transactions: [], loans: [] },
  user13: { name: 'MARIA VARGAS', balance: 540, accountNumber: '10013', password: 'password123', transactions: [], loans: [] },
  user14: { name: 'STELLA AMAYA', balance: 540, accountNumber: '10014', password: 'password123', transactions: [], loans: [] },
  user15: { name: 'DAVID LOPEZ', balance: 540, accountNumber: '10015', password: 'password123', transactions: [], loans: [] },
  user16: { name: 'JESSICA PLATA', balance: 540, accountNumber: '10016', password: 'password123', transactions: [], loans: [] },
  user17: { name: 'JESSICA PLATA', balance: 540, accountNumber: '10017', password: 'password123', transactions: [], loans: [] },
  user18: { name: 'CESAR MANRIQUE', balance: 540, accountNumber: '10018', password: 'password123', transactions: [], loans: [] },
  user19: { name: 'CESAR MANRIQUE', balance: 540, accountNumber: '10019', password: 'password123', transactions: [], loans: [] },
  user20: { name: 'DIEGO CONTRERAS', balance: 540, accountNumber: '10020', password: 'password123', transactions: [], loans: [] }
};

const getNextPaymentDate = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toLocaleDateString();
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  isAdmin: false,
  adminViewingUser: null,
  selectedUserForDetails: null,
  users: initialUsers,
  userCounter: 20,

  login: (userId: string, password: string) => {
    const { users } = get();
    
    if (userId === 'admin' && password === 'admin123') {
      set({ currentUser: 'admin', isAdmin: true });
      return true;
    }
    
    if (users[userId] && users[userId].password === password) {
      set({ currentUser: userId, isAdmin: false });
      return true;
    }
    
    return false;
  },

  logout: () => {
    set({ 
      currentUser: null, 
      isAdmin: false, 
      adminViewingUser: null,
      selectedUserForDetails: null 
    });
  },

  setAdminViewingUser: (userId) => {
    set({ adminViewingUser: userId });
  },

  setSelectedUserForDetails: (userId) => {
    set({ selectedUserForDetails: userId });
  },

  createUser: (name: string, balance: number, password: string) => {
    const { users, userCounter } = get();
    const newCounter = userCounter + 1;
    const userId = `user${newCounter}`;
    const accountNumber = (10000 + newCounter).toString();

    const newUser: User = {
      name,
      balance,
      accountNumber,
      password,
      transactions: [],
      loans: []
    };

    set({
      users: { ...users, [userId]: newUser },
      userCounter: newCounter
    });
  },

  deleteUser: (userId: string) => {
    const { users } = get();
    const newUsers = { ...users };
    delete newUsers[userId];
    set({ users: newUsers });
  },

  updateUserBalance: (userId: string, amount: number, operation: 'add' | 'subtract') => {
    const { users, addTransaction } = get();
    const user = users[userId];
    
    if (!user) return;

    const newBalance = operation === 'add' 
      ? user.balance + amount 
      : user.balance - amount;

    if (operation === 'subtract' && user.balance < amount) return;

    set({
      users: {
        ...users,
        [userId]: { ...user, balance: newBalance }
      }
    });

    const description = operation === 'add' 
      ? `Depósito por administrador: +$${amount.toFixed(2)}`
      : `Retiro por administrador: -$${amount.toFixed(2)}`;

    addTransaction(userId, operation === 'add' ? 'deposit' : 'withdrawal', amount, description);
  },

  resetPassword: (userId: string, newPassword: string) => {
    const { users } = get();
    const user = users[userId];
    
    if (!user) return;

    set({
      users: {
        ...users,
        [userId]: { ...user, password: newPassword }
      }
    });
  },

  addTransaction: (userId: string, type: 'deposit' | 'withdrawal' | 'loan', amount: number, description: string) => {
    const { users } = get();
    const user = users[userId];
    
    if (!user) return;

    const transaction: Transaction = {
      id: Date.now() + Math.random(),
      type,
      amount,
      description,
      date: new Date().toLocaleString()
    };

    set({
      users: {
        ...users,
        [userId]: {
          ...user,
          transactions: [transaction, ...user.transactions]
        }
      }
    });
  },

  addLoan: (userId: string, loan: Loan) => {
    const { users } = get();
    const user = users[userId];
    
    if (!user) return;

    set({
      users: {
        ...users,
        [userId]: {
          ...user,
          loans: [...user.loans, loan],
          balance: user.balance + loan.amount
        }
      }
    });
  },

  payLoanInstallment: (userId: string, loanId: number) => {
    const { users, addTransaction } = get();
    const user = users[userId];
    
    if (!user) return false;

    const loanIndex = user.loans.findIndex(l => l.id === loanId);
    const loan = user.loans[loanIndex];
    
    if (!loan || loan.status !== 'active' || user.balance < loan.monthlyPayment) {
      return false;
    }

    const updatedLoan = {
      ...loan,
      remainingPayments: loan.remainingPayments - 1,
      status: loan.remainingPayments <= 1 ? 'paid' as const : 'active' as const,
      nextPaymentDate: loan.remainingPayments > 1 ? getNextPaymentDate() : loan.nextPaymentDate
    };

    const updatedLoans = [...user.loans];
    updatedLoans[loanIndex] = updatedLoan;

    set({
      users: {
        ...users,
        [userId]: {
          ...user,
          balance: user.balance - loan.monthlyPayment,
          loans: updatedLoans
        }
      }
    });

    const description = updatedLoan.status === 'paid'
      ? `Pago final de préstamo: -$${loan.monthlyPayment.toFixed(2)}`
      : `Pago de cuota: -$${loan.monthlyPayment.toFixed(2)} (${updatedLoan.remainingPayments} cuotas restantes)`;

    addTransaction(userId, 'loan', loan.monthlyPayment, description);
    return true;
  }
}));
