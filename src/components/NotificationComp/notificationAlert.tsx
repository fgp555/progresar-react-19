import ReactDOM from "react-dom/client";
import { NotificationComp } from "./NotificationComp";

type NotificationType = "success" | "danger" | "warning" | "info";

const defaultMessages: Record<NotificationType, string> = {
  success: "Operación realizada con éxito.",
  danger: "¡Ha ocurrido un error!",
  warning: "Advertencia, tenga cuidado.",
  info: "Información importante.",
};

export function notificationAlert(type: NotificationType = "success", message?: string, duration: number = 3000) {
  // Validar el tipo
  const validTypes: NotificationType[] = ["success", "danger", "warning", "info"];
  const finalType: NotificationType = validTypes.includes(type) ? type : "info";

  // Si no se pasa mensaje, usar el predeterminado según tipo
  const finalMessage = message ?? defaultMessages[finalType];

  // Crear contenedor
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);

  const handleClose = () => {
    root.unmount();
    container.remove();
  };

  root.render(<NotificationComp message={finalMessage} type={finalType} duration={duration} onClose={handleClose} />);
}

// notificationAlert();
// notificationAlert("danger");
// notificationAlert("success", "Usuario creado con éxito.");
// notificationAlert("danger", "Advertencia personalizada.", -1);
// notificationAlert("success", undefined, -1);

// Swal.fire("¡Error!", "Credenciales incorrectas", "error");
