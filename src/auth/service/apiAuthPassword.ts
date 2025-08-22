import axiosInstance from "@/config/axiosInstance";

export const authPasswordService = {
  // Servicio para solicitar un restablecimiento de contraseña
  async forgotPassword(email: any, baseURL: any) {
    try {
      const response = await axiosInstance.post("/api/auth/forgot-password", {
        email,
        baseURL: baseURL,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error al solicitar restablecimiento de contraseña:", error);
      throw new Error(error.response?.data?.message || "Error en la solicitud de restablecimiento de contraseña");
    }
  },

  // Servicio para restablecer la contraseña con el token recibido
  async restorePassword(resetToken: any, newPassword: any) {
    try {
      const response = await axiosInstance.post("/api/auth/restore-password", {
        resetToken: resetToken,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error al restablecer la contraseña:", error);
      throw new Error(error.response?.data?.message || "Error al restablecer la contraseña");
    }
  },
};
