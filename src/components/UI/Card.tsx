import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, actions, className = "" }) => {
  return (
    <div className={`card-header ${className}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>{title}</h2>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = "" }) => {
  return <div className={`card-body ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = "" }) => {
  return <div className={`card-footer ${className}`}>{children}</div>;
};
