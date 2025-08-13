import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    currentUser,
    isAdmin,
    adminViewingUser,
    users,
    login,
    logout,
    setAdminViewingUser
  } = useAuthStore();

  const getCurrentUser = () => {
    if (!currentUser || currentUser === 'admin') return null;
    return users[currentUser];
  };

  const getAdminViewingUser = () => {
    if (!adminViewingUser) return null;
    return users[adminViewingUser];
  };

  return {
    currentUser,
    isAdmin,
    adminViewingUser,
    getCurrentUser,
    getAdminViewingUser,
    login,
    logout,
    setAdminViewingUser
  };
};
