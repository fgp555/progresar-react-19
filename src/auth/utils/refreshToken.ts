import { baseUrl } from "@/config/constants";
import axios from "axios";

export const refreshToken = async (): Promise<string | null> => {
  console.log("Refreshing token...");
  try {
    const refreshTokenValue = localStorage.getItem("refreshToken");

    if (!refreshTokenValue) {
      console.log("No refresh token found");
      return null;
    }

    console.log("Attempting to refresh with token:", refreshTokenValue.substring(0, 20) + "...");

    const response: any = await axios.post(
      `${baseUrl}/api/auth/refresh-token`,
      { refreshToken: refreshTokenValue },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 segundos timeout
      }
    );

    console.log("Refresh response:", response.data);

    if (response.data?.accessToken) {
      return response.data.accessToken;
    } else {
      console.error("No access token in response:", response.data);
      return null;
    }
  } catch (err: any) {
    console.error("Error refreshing token:", {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
    });

    // Si el refresh token es inválido, limpiarlo
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.log("Refresh token is invalid, clearing storage");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
    }

    return null;
  }
};
