import React from "react";
import { Navbar } from "./Navbar";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};
