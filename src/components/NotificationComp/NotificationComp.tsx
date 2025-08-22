import { useEffect, useState } from "react";
import "./NotificationComp.css";

interface NotificationProps {
  message: string;
  type?: "success" | "danger" | "warning" | "info";
  duration?: number; // ms
  onClose: () => void;
}

export const NotificationComp = ({ message, type = "success", duration = 3000, onClose }: NotificationProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (duration === -1) return;

    const interval = 50;
    const totalSteps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        handleClose();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // esperar fadeOut
  };

  return (
    <div className={`notification-comp ${type} ${isExiting ? "exit" : ""}`}>
      <span className="message">{message}</span>
      <button className="close-btn" onClick={handleClose}>
        &times;
      </button>
      {duration !== -1 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};
