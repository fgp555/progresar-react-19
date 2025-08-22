import React from "react";
import "./LoagingComp.css";

interface LoadingProps {
  mensaje?: string; // El signo de interrogación indica que la prop es opcional
}

const LoagingComp: React.FC<LoadingProps> = ({ mensaje }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      {mensaje && <p className="loading-message">{mensaje}</p>}
    </div>
  );
};

export default LoagingComp;
