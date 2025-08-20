import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import type { User, CreateUserDto, UpdateUserDto } from "../types";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching users");
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createUser(userData);
      if (response.success && response.data) {
        setUsers((prev) => [...prev, response.data!]);
        return response.data;
      }
      throw new Error(response.message || "Failed to create user");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error creating user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: UpdateUserDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateUser(id, userData);
      if (response.success && response.data) {
        setUsers((prev) => prev.map((user) => (user.id === id ? response.data! : user)));
        return response.data;
      }
      throw new Error(response.message || "Failed to update user");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error updating user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.deleteUser(id);
      if (response.success) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        throw new Error(response.message || "Failed to delete user");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error deleting user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
