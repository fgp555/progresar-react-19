// src/hooks/useDocumentTypes.ts

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/config/axiosInstance";
import type { DocumentType, ApiResponse } from "@/types";

export interface DocumentTypeFilters {
  search?: string;
  sortBy?: "code" | "name" | "createdAt";
  sortOrder?: "ASC" | "DESC";
}

export interface UseDocumentTypesReturn {
  // Data
  documentTypes: DocumentType[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  fetchDocumentTypes: (filters?: DocumentTypeFilters) => Promise<void>;
  getDocumentTypeById: (id: number) => Promise<DocumentType | null>;
  getDocumentTypeByCode: (code: string) => Promise<DocumentType | null>;
  createDocumentType: (data: { code: string; name: string }) => Promise<DocumentType>;
  updateDocumentType: (id: number, data: { code?: string; name?: string }) => Promise<DocumentType>;
  deleteDocumentType: (id: number) => Promise<boolean>;
  seedDefaultTypes: () => Promise<void>;

  // Utilities
  refreshDocumentTypes: () => Promise<void>;
  clearError: () => void;

  // Computed values
  getDocumentTypeOptions: () => Array<{ value: string; label: string; id: number }>;
  findDocumentTypeByCode: (code: string) => DocumentType | undefined;
}

export const useDocumentTypes = (): UseDocumentTypesReturn => {
  // States
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Error handler
  const handleError = useCallback((err: any, defaultMessage: string = "Error desconocido") => {
    let errorMessage = defaultMessage;

    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    setError(errorMessage);
    console.error("DocumentTypes Error:", err);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all document types
  const fetchDocumentTypes = useCallback(
    async (filters?: DocumentTypeFilters) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get<ApiResponse<DocumentType[]>>("/api/progresar/document", {
          params: filters,
        });

        if (response.data.success && response.data.data) {
          let types = response.data.data;

          // Client-side filtering if needed
          if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            types = types.filter(
              (type) => type.code.toLowerCase().includes(searchTerm) || type.name.toLowerCase().includes(searchTerm)
            );
          }

          // Client-side sorting
          if (filters?.sortBy) {
            types.sort((a, b) => {
              const aValue = a[filters.sortBy!];
              const bValue = b[filters.sortBy!];
              const order = filters.sortOrder === "DESC" ? -1 : 1;

              if (aValue < bValue) return -1 * order;
              if (aValue > bValue) return 1 * order;
              return 0;
            });
          }

          setDocumentTypes(types);
        } else {
          throw new Error("Respuesta inválida del servidor");
        }
      } catch (err) {
        handleError(err, "Error al cargar tipos de documento");
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Get document type by ID
  const getDocumentTypeById = useCallback(
    async (id: number): Promise<DocumentType | null> => {
      try {
        setError(null);

        const response = await axiosInstance.get<ApiResponse<DocumentType>>(`/api/progresar/document/${id}`);

        if (response.data.success && response.data.data) {
          return response.data.data;
        }

        return null;
      } catch (err) {
        handleError(err, `Error al obtener tipo de documento con ID ${id}`);
        return null;
      }
    },
    [handleError]
  );

  // Get document type by code
  const getDocumentTypeByCode = useCallback(
    async (code: string): Promise<DocumentType | null> => {
      try {
        setError(null);

        const response = await axiosInstance.get<ApiResponse<DocumentType>>(`/api/progresar/document/code/${code}`);

        if (response.data.success && response.data.data) {
          return response.data.data;
        }

        return null;
      } catch (err) {
        handleError(err, `Error al obtener tipo de documento con código ${code}`);
        return null;
      }
    },
    [handleError]
  );

  // Create document type
  const createDocumentType = useCallback(
    async (data: { code: string; name: string }): Promise<DocumentType> => {
      try {
        setError(null);

        const response = await axiosInstance.post<ApiResponse<DocumentType>>("/api/progresar/document", data);

        if (response.data.success && response.data.data) {
          // Update local state
          setDocumentTypes((prev) => [...prev, response.data.data!]);
          return response.data.data;
        } else {
          throw new Error("Error al crear tipo de documento");
        }
      } catch (err) {
        handleError(err, "Error al crear tipo de documento");
        throw err;
      }
    },
    [handleError]
  );

  // Update document type
  const updateDocumentType = useCallback(
    async (id: number, data: { code?: string; name?: string }): Promise<DocumentType> => {
      try {
        setError(null);

        const response = await axiosInstance.patch<ApiResponse<DocumentType>>(`/api/progresar/document/${id}`, data);

        if (response.data.success && response.data.data) {
          // Update local state
          setDocumentTypes((prev) => prev.map((type) => (type.id === id ? response.data.data! : type)));
          return response.data.data;
        } else {
          throw new Error("Error al actualizar tipo de documento");
        }
      } catch (err) {
        handleError(err, "Error al actualizar tipo de documento");
        throw err;
      }
    },
    [handleError]
  );

  // Delete document type
  const deleteDocumentType = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setError(null);

        const response = await axiosInstance.delete<ApiResponse<void>>(`/api/progresar/document/${id}`);

        if (response.data.success) {
          // Update local state
          setDocumentTypes((prev) => prev.filter((type) => type.id !== id));
          return true;
        } else {
          throw new Error("Error al eliminar tipo de documento");
        }
      } catch (err) {
        handleError(err, "Error al eliminar tipo de documento");
        return false;
      }
    },
    [handleError]
  );

  // Seed default types
  const seedDefaultTypes = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post<ApiResponse<void>>("/api/progresar/document/seed-defaults");

      if (response.data.success) {
        // Refresh the list after seeding
        await fetchDocumentTypes();
      } else {
        throw new Error("Error al poblar tipos por defecto");
      }
    } catch (err) {
      handleError(err, "Error al poblar tipos de documento por defecto");
    } finally {
      setLoading(false);
    }
  }, [handleError, fetchDocumentTypes]);

  // Refresh document types
  const refreshDocumentTypes = useCallback(async () => {
    await fetchDocumentTypes();
  }, [fetchDocumentTypes]);

  // Get document type options for selects
  const getDocumentTypeOptions = useCallback(() => {
    return documentTypes.map((type) => ({
      value: type.code,
      label: `${type.code} - ${type.name}`,
      id: type.id,
    }));
  }, [documentTypes]);

  // Find document type by code (local search)
  const findDocumentTypeByCode = useCallback(
    (code: string): DocumentType | undefined => {
      return documentTypes.find((type) => type.code === code);
    },
    [documentTypes]
  );

  // Initial load
  useEffect(() => {
    fetchDocumentTypes();
  }, [fetchDocumentTypes]);

  return {
    // Data
    documentTypes,
    loading,
    error,

    // CRUD operations
    fetchDocumentTypes,
    getDocumentTypeById,
    getDocumentTypeByCode,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    seedDefaultTypes,

    // Utilities
    refreshDocumentTypes,
    clearError,

    // Computed values
    getDocumentTypeOptions,
    findDocumentTypeByCode,
  };
};

export default useDocumentTypes;
