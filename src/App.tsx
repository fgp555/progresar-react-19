import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { NotificationContainer } from "./components/UI";
import type { Notification } from "./types";

// Pages (we'll create these next)
import DashboardPage from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import AccountsPage from "./pages/AccountsPage";
import TransactionsPage from "./pages/TransactionsPage";
import LoansPage from "./pages/LoansPage";

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
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions/:accountId" element={<TransactionsPage />} />
          <Route path="/loans/:accountId" element={<LoansPage />} />
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </Layout>

      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </div>
  );
}

export default App;
