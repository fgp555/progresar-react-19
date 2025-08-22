import { baseUrl } from "@/config/constants";
import axios from "axios";

export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    const res: any = await axios.post(`${baseUrl}/api/auth/refresh-token`, { refreshToken });
    return res.data.accessToken;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
};
