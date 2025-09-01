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
import PasswordForgot from "./auth/pages/PasswordForgot/PasswordForgot";
import PasswordRestore from "./auth/pages/PasswordRestore/PasswordRestore";
import UserDetailsPage from "./pages/UserDetailsPage";
import UserEditPage from "./pages/UserEdit";
import UserCreate from "./pages/UserCreate";
import UsersList from "./pages/UsersList";
import AccountCreatePage from "./pages/AccountCreatePage";
import AccountUpdatePage from "./pages/AccountUpdatePage";

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/create" element={<UserCreate />} />
          <Route path="/users/edit/:userId" element={<UserEditPage />} />
          <Route path="/userDetails/:userId" element={<UserDetailsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/create/:userId" element={<AccountCreatePage />} />
          <Route path="/accounts/edit/:userId" element={<AccountUpdatePage />} />
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
