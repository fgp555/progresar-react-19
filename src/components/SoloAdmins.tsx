import React from "react";
import LogoutButton from "@/auth/components/LogoutButton/LogoutButton";
import styles from "./SoloAdmins.module.css";

const SoloAdmins: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Acceso restringido 🚫</h2>
        <p>Este contenido es solo para administradores.</p>
      </div>
      <LogoutButton />
    </div>
  );
};

export default SoloAdmins;
