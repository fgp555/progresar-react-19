import axiosInstance from "@/config/axiosInstance";

export const authService = {
  async refreshAccessToken() {
    try {
      const response = await axiosInstance.post("/api/auth/token/refresh");
      return response.data;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  },

  // Login
  async signin(userData: any) {
    try {
      const response = await axiosInstance.post("/api/auth/login", userData);
      return response.data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  // Login
  async login(userData: any) {
    try {
      const response = await axiosInstance.post("/api/auth/login", userData);
      return response.data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  // Registro de usuario (Signup)
  async signup(userData: any) {
    try {
      const response = await axiosInstance.post("/api/auth/signup", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Error desconocido al registrarse.";
      const errorStatus = error.response?.status || 500;

      console.error("Error en signup:", { message: errorMessage, status: errorStatus });

      throw new Error(errorMessage);
    }
  },

  // Actualización de usuario
  async update(id: any, userData: any) {
    try {
      const response = await axiosInstance.patch(`/auth/update/${id}`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
