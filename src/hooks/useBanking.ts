import { useAuthStore } from '../stores/authStore';
import { validateAmount } from '../utils/validators';

export const useBanking = () => {
  const { 
    currentUser, 
    adminViewingUser, 
    users, 
    updateUserBalance, 
    addTransaction 
  } = useAuthStore();

  const getTargetUserId = () => adminViewingUser || currentUser;

  const deposit = (amount: number): boolean => {
    const userId = getTargetUserId();
    if (!userId || !validateAmount(amount)) return false;

    const user = users[userId];
    if (!user) return false;

    updateUserBalance(userId, amount, 'add');
    return true;
  };

  const withdraw = (amount: number): boolean => {
    const userId = getTargetUserId();
    if (!userId || !validateAmount(amount)) return false;

    const user = users[userId];
    if (!user || user.balance < amount) return false;

    updateUserBalance(userId, amount, 'subtract');
    return true;
  };

  return { deposit, withdraw };
};
