import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "error" | "warning";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "btn";
  const variantClasses = `btn-${variant}`;
  const sizeClasses = size !== "md" ? `btn-${size}` : "";
  const iconClasses = !children && icon ? "btn-icon" : "";

  const allClasses = [baseClasses, variantClasses, sizeClasses, iconClasses, className].filter(Boolean).join(" ");

  return (
    <button className={allClasses} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <span className="loading" />
          {children && "Cargando..."}
        </>
      ) : (
        <>
          {icon && icon}
          {children}
        </>
      )}
    </button>
  );
};
