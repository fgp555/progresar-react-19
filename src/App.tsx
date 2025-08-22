import { NotificationContainer } from "./components/UI";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import AccountsPage from "./pages/AccountsPage";
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import DashboardPage from "./pages/Dashboard";
import LoansPage from "./pages/LoansPage";
import LoginPage from "./auth/pages/LoginPage/LoginPage";
import TransactionsPage from "./pages/TransactionsPage";
import type { Notification } from "./types";
import UsersPage from "./pages/UsersPage";
import PasswordForgot from "./auth/pages/PasswordForgot/PasswordForgot";
import PasswordRestore from "./auth/pages/PasswordRestore/PasswordRestore";

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // const addNotification = (notification: Omit<Notification, 'id'>) => {
  //   const id = Math.random().toString(36).substr(2, 9);
  //   const newNotification = { ...notification, id };

  //   setNotifications(prev => [...prev, newNotification]);

  //   // Auto remove notification after duration
  //   const duration = notification.duration || 5000;
  //   setTimeout(() => {
  //     removeNotification(id);
  //   }, duration);
  // };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/password/forgot" element={<PasswordForgot />} />
        <Route path="/password/reset" element={<PasswordRestore />} />

        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions/:accountId" element={<TransactionsPage />} />
          <Route path="/loans/:accountId" element={<LoansPage />} />
        </Route>
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>

      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </div>
  );
}

export default App;
