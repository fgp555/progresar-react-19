import React from "react";
import { LoginForm } from "./components/LoginForm";
import { UserDashboard } from "./components/UserDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { AdminUserView } from "./components/AdminUserView";
import { UserDetailsModal } from "./components/UserDetailsModal";
import { LogoutButton } from "./components/LogoutButton";
import { useAuth } from "./hooks/useAuth";
import "./styles/global.css";

const App: React.FC = () => {
  const { currentUser, isAdmin, adminViewingUser } = useAuth();

  const renderCurrentView = () => {
    if (!currentUser) {
      return <LoginForm />;
    }

    if (isAdmin) {
      if (adminViewingUser) {
        return <AdminUserView />;
      }
      return <AdminPanel />;
    }

    return <UserDashboard />;
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🏦 Banco Digital</h1>
          <p>Sistema Bancario Seguro y Confiable</p>
        </header>

        {currentUser && <LogoutButton />}
        {renderCurrentView()}
        <UserDetailsModal />
      </div>
    </div>
  );
};

export default App;
