import { useState } from "react";
import axiosInstance from "@/config/axiosInstance";

interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<DeleteUserResponse | null>(null);

  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const { data } = await axiosInstance.delete<DeleteUserResponse>(`/api/progresar/usuarios/${userId}`);

      setResponse(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error, response };
}
