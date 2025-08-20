import React from "react";
import type { Notification } from "../../types";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose, className = "" }) => {
  return (
    <div className={`alert alert-${type} ${className}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          {title && <div className="alert-title">{title}</div>}
          <div className="alert-message">{message}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
              padding: "0",
              marginLeft: "var(--spacing-4)",
              color: "inherit",
              opacity: 0.7,
            }}
            aria-label="Cerrar alerta"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationProps> = ({ notification, onClose }) => {
  return (
    <Alert
      type={notification.type}
      title={notification.title}
      message={notification.message}
      onClose={() => onClose(notification.id)}
      className="notification-item"
    />
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "var(--spacing-4)",
        right: "var(--spacing-4)",
        zIndex: 1000,
        maxWidth: "400px",
        width: "100%",
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            marginBottom: "var(--spacing-2)",
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <NotificationItem notification={notification} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

// Add animation keyframes to the global styles
const animationStyles = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
`;

// Inject styles if not already present
if (typeof document !== "undefined" && !document.querySelector("#notification-animations")) {
  const style = document.createElement("style");
  style.id = "notification-animations";
  style.textContent = animationStyles;
  document.head.appendChild(style);
}
