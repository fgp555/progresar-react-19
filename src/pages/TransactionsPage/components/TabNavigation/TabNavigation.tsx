// components/TabNavigation/TabNavigation.tsx
import React from "react";
import type { TabType } from "../../types/transaction.types";
import styles from "./TabNavigation.module.css";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabs}>
      <button
        onClick={() => onTabChange("history")}
        className={`${styles.tab} ${activeTab === "history" ? styles.activeTab : ""}`}
      >
        <i className="fas fa-history"></i>
        Historial
      </button>
      <button
        onClick={() => onTabChange("deposit")}
        className={`${styles.tab} ${activeTab === "deposit" ? styles.activeTab : ""}`}
      >
        <i className="fas fa-arrow-down"></i>
        Depósito
      </button>
      <button
        onClick={() => onTabChange("withdraw")}
        className={`${styles.tab} ${activeTab === "withdraw" ? styles.activeTab : ""}`}
      >
        <i className="fas fa-arrow-up"></i>
        Retiro
      </button>
    </div>
  );
};

