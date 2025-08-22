import React from "react";

interface ButtonLoadingSpinnerProps {
  text?: string;
}

const ButtonLoadingSpinner: React.FC<ButtonLoadingSpinnerProps> = ({ text = "Loading..." }) => {
  return (
    <div style={styles.container}>
      <i className="fas fa-spinner fa-spin" style={styles.icon}></i>
      <span style={styles.text}>{text}</span>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    justifyContent: "center",
    padding: "0.5rem 1rem",
    color: "var(--text-color)",
    fontFamily: "var(--font-family)",
    fontSize: "1rem",
  },
  icon: {
    fontSize: "1.2rem",
  },
  text: {
    fontWeight: 500,
  },
};

export default ButtonLoadingSpinner;
