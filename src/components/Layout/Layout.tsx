import React from "react";
import { Navbar } from "./Navbar";
import "./Layout.css";
import Navbar2 from "./Navbar2";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <Navbar2 />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};
