import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "@/auth/hooks/useAuth";
import LogoutButton from "@/auth/components/LogoutButton/LogoutButton";

const navigation = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Cuentas", href: "/accounts", icon: "💳" },
  { name: "Usuarios", href: "/users", icon: "👥" },
  // { name: 'Transacciones', href: '/transactions', icon: '💸' },
  // { name: 'Préstamos', href: '/loans', icon: '🏦' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🏦</span>
            <span className="brand-text">PROGRESAR</span>
          </Link>
        </div>

        <div className="navbar-nav">
          <div className="nav-links">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));

              return (
                <Link key={item.name} to={item.href} className={`nav-link ${isActive ? "active" : ""}`}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* <div className="nav-actions">
            <button className="btn btn-secondary btn-sm">
              <span>⚙️</span>
              <span className="action-text">Configuración</span>
            </button>
          </div> */}

          {isAuthenticated && (
            <>
              {/* <div className="nav-actions">
                <GoogleProfileChip />
              </div> */}
              <div className="nav-actions">
                <LogoutButton />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
