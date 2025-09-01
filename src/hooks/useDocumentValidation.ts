// src/hooks/useDocumentValidation.ts

import { useCallback } from "react";
import { useDocumentTypes } from "./useDocumentTypes";

export interface DocumentValidationResult {
  isValid: boolean;
  message?: string;
}

export interface DocumentValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => DocumentValidationResult;
}

export interface UseDocumentValidationReturn {
  validateDocumentNumber: (documentType: string, documentNumber: string) => DocumentValidationResult;
  getDocumentTypeInfo: (code: string) => Promise<any>;
  validateDocumentFormat: (documentType: string, documentNumber: string) => DocumentValidationResult;
  getValidationRules: (documentType: string) => DocumentValidationRules | null;
  validateAllDocumentFields: (data: { documentType: string; documentNumber: string }) => { [key: string]: string };
}

export const useDocumentValidation = (): UseDocumentValidationReturn => {
  const { findDocumentTypeByCode, getDocumentTypeByCode } = useDocumentTypes();

  // Definir reglas de validación por tipo de documento
  const getValidationRules = useCallback((documentType: string): DocumentValidationRules | null => {
    const rules: { [key: string]: DocumentValidationRules } = {
      CC: {
        minLength: 7,
        maxLength: 10,
        pattern: /^\d{7,10}$/,
        customValidator: (value: string) => {
          if (!/^\d+$/.test(value)) {
            return { isValid: false, message: "La cédula de ciudadanía debe contener solo números" };
          }
          if (value.length < 7) {
            return { isValid: false, message: "La cédula debe tener al menos 7 dígitos" };
          }
          if (value.length > 10) {
            return { isValid: false, message: "La cédula no puede tener más de 10 dígitos" };
          }
          // Validación adicional: no puede empezar con 0
          if (value.startsWith("0") && value.length > 1) {
            return { isValid: false, message: "La cédula no puede empezar con 0" };
          }
          return { isValid: true };
        },
      },
      CE: {
        minLength: 6,
        maxLength: 12,
        pattern: /^\d{6,12}$/,
        customValidator: (value: string) => {
          if (!/^\d+$/.test(value)) {
            return { isValid: false, message: "La cédula de extranjería debe contener solo números" };
          }
          if (value.length < 6) {
            return { isValid: false, message: "La cédula de extranjería debe tener al menos 6 dígitos" };
          }
          if (value.length > 12) {
            return { isValid: false, message: "La cédula de extranjería no puede tener más de 12 dígitos" };
          }
          return { isValid: true };
        },
      },
      TI: {
        minLength: 10,
        maxLength: 11,
        pattern: /^\d{10,11}$/,
        customValidator: (value: string) => {
          if (!/^\d+$/.test(value)) {
            return { isValid: false, message: "La tarjeta de identidad debe contener solo números" };
          }
          if (value.length !== 10 && value.length !== 11) {
            return { isValid: false, message: "La tarjeta de identidad debe tener 10 u 11 dígitos" };
          }
          return { isValid: true };
        },
      },
      RC: {
        minLength: 10,
        maxLength: 11,
        pattern: /^\d{10,11}$/,
        customValidator: (value: string) => {
          if (!/^\d+$/.test(value)) {
            return { isValid: false, message: "El registro civil debe contener solo números" };
          }
          if (value.length !== 10 && value.length !== 11) {
            return { isValid: false, message: "El registro civil debe tener 10 u 11 dígitos" };
          }
          return { isValid: true };
        },
      },
      PSP: {
        minLength: 6,
        maxLength: 12,
        pattern: /^[A-Z]{1,3}\d{6,9}$/,
        customValidator: (value: string) => {
          const upperValue = value.toUpperCase();
          if (!/^[A-Z]{1,3}\d{6,9}$/.test(upperValue)) {
            return {
              isValid: false,
              message: "El pasaporte debe tener formato válido (ej: ABC123456, A1234567)",
            };
          }
          const letterPart = upperValue.match(/^[A-Z]+/)?.[0] || "";
          const numberPart = upperValue.match(/\d+$/)?.[0] || "";

          if (letterPart.length < 1 || letterPart.length > 3) {
            return { isValid: false, message: "El pasaporte debe tener 1-3 letras al inicio" };
          }
          if (numberPart.length < 6 || numberPart.length > 9) {
            return { isValid: false, message: "El pasaporte debe tener 6-9 números al final" };
          }
          return { isValid: true };
        },
      },
      NIT: {
        minLength: 8,
        maxLength: 15,
        pattern: /^\d{8,15}$/,
        customValidator: (value: string) => {
          // Remover guiones si existen para la validación
          const cleanValue = value.replace(/-/g, "");
          if (!/^\d+$/.test(cleanValue)) {
            return { isValid: false, message: "El NIT debe contener solo números (y opcionalmente guiones)" };
          }
          if (cleanValue.length < 8) {
            return { isValid: false, message: "El NIT debe tener al menos 8 dígitos" };
          }
          if (cleanValue.length > 15) {
            return { isValid: false, message: "El NIT no puede tener más de 15 dígitos" };
          }
          return { isValid: true };
        },
      },
      PEP: {
        minLength: 8,
        maxLength: 15,
        pattern: /^[A-Z]{2,3}\d{6,12}$/,
        customValidator: (value: string) => {
          const upperValue = value.toUpperCase();
          if (!/^[A-Z]{2,3}\d{6,12}$/.test(upperValue)) {
            return {
              isValid: false,
              message: "El PEP debe tener formato válido (ej: PEP123456789)",
            };
          }
          return { isValid: true };
        },
      },
      PT: {
        minLength: 6,
        maxLength: 20,
        customValidator: (value: string) => {
          if (value.length < 6) {
            return { isValid: false, message: "El permiso temporal debe tener al menos 6 caracteres" };
          }
          if (value.length > 20) {
            return { isValid: false, message: "El permiso temporal no puede tener más de 20 caracteres" };
          }
          if (!/^[A-Z0-9\-]+$/i.test(value)) {
            return {
              isValid: false,
              message: "El permiso temporal solo puede contener letras, números y guiones",
            };
          }
          return { isValid: true };
        },
      },
      AS: {
        minLength: 5,
        maxLength: 20,
        customValidator: (value: string) => {
          if (value.length < 5) {
            return { isValid: false, message: "El documento debe tener al menos 5 caracteres" };
          }
          if (value.length > 20) {
            return { isValid: false, message: "El documento no puede tener más de 20 caracteres" };
          }
          return { isValid: true };
        },
      },
      MS: {
        minLength: 5,
        maxLength: 20,
        customValidator: (value: string) => {
          if (value.length < 5) {
            return { isValid: false, message: "El documento debe tener al menos 5 caracteres" };
          }
          if (value.length > 20) {
            return { isValid: false, message: "El documento no puede tener más de 20 caracteres" };
          }
          return { isValid: true };
        },
      },
      NUIP: {
        minLength: 10,
        maxLength: 11,
        pattern: /^\d{10,11}$/,
        customValidator: (value: string) => {
          if (!/^\d+$/.test(value)) {
            return { isValid: false, message: "El NUIP debe contener solo números" };
          }
          if (value.length !== 10 && value.length !== 11) {
            return { isValid: false, message: "El NUIP debe tener 10 u 11 dígitos" };
          }
          return { isValid: true };
        },
      },
      OTRO: {
        minLength: 5,
        maxLength: 30,
        customValidator: (value: string) => {
          if (value.length < 5) {
            return { isValid: false, message: "El documento debe tener al menos 5 caracteres" };
          }
          if (value.length > 30) {
            return { isValid: false, message: "El documento no puede tener más de 30 caracteres" };
          }
          // Permitir letras, números, espacios y algunos caracteres especiales
          if (!/^[A-Za-z0-9\s\-_\.]+$/.test(value)) {
            return {
              isValid: false,
              message: "El documento contiene caracteres no válidos",
            };
          }
          return { isValid: true };
        },
      },
    };

    return rules[documentType] || null;
  }, []);

  // Validar formato de documento
  const validateDocumentFormat = useCallback(
    (documentType: string, documentNumber: string): DocumentValidationResult => {
      if (!documentType || !documentNumber) {
        return { isValid: false, message: "Tipo y número de documento son requeridos" };
      }

      // Verificar que el tipo de documento existe
      const docType = findDocumentTypeByCode(documentType);
      if (!docType) {
        return { isValid: false, message: "Tipo de documento no válido" };
      }

      // Obtener reglas de validación
      const rules = getValidationRules(documentType);
      if (!rules) {
        // Si no hay reglas específicas, validación básica
        if (documentNumber.length < 5) {
          return { isValid: false, message: "El número de documento debe tener al menos 5 caracteres" };
        }
        return { isValid: true };
      }

      // Aplicar validación personalizada si existe
      if (rules.customValidator) {
        return rules.customValidator(documentNumber);
      }

      // Validación por patrón si existe
      if (rules.pattern && !rules.pattern.test(documentNumber)) {
        return { isValid: false, message: "El formato del número de documento no es válido" };
      }

      // Validación por longitud
      if (rules.minLength && documentNumber.length < rules.minLength) {
        return {
          isValid: false,
          message: `El número de documento debe tener al menos ${rules.minLength} caracteres`,
        };
      }

      if (rules.maxLength && documentNumber.length > rules.maxLength) {
        return {
          isValid: false,
          message: `El número de documento no puede tener más de ${rules.maxLength} caracteres`,
        };
      }

      return { isValid: true };
    },
    [findDocumentTypeByCode, getValidationRules]
  );

  // Función principal de validación
  const validateDocumentNumber = useCallback(
    (documentType: string, documentNumber: string): DocumentValidationResult => {
      // Limpiar espacios en blanco
      const cleanedNumber = documentNumber.trim();

      return validateDocumentFormat(documentType, cleanedNumber);
    },
    [validateDocumentFormat]
  );

  // Obtener información del tipo de documento
  const getDocumentTypeInfo = useCallback(
    async (code: string) => {
      try {
        return await getDocumentTypeByCode(code);
      } catch (error) {
        console.error("Error obteniendo información del tipo de documento:", error);
        return null;
      }
    },
    [getDocumentTypeByCode]
  );

  // Validar todos los campos de documento
  const validateAllDocumentFields = useCallback(
    (data: { documentType: string; documentNumber: string }): { [key: string]: string } => {
      const errors: { [key: string]: string } = {};

      // Validar tipo de documento
      if (!data.documentType) {
        errors.documentType = "El tipo de documento es requerido";
      } else {
        const docType = findDocumentTypeByCode(data.documentType);
        if (!docType) {
          errors.documentType = "Tipo de documento no válido";
        }
      }

      // Validar número de documento
      if (!data.documentNumber) {
        errors.documentNumber = "El número de documento es requerido";
      } else if (data.documentType) {
        const validation = validateDocumentNumber(data.documentType, data.documentNumber);
        if (!validation.isValid) {
          errors.documentNumber = validation.message || "Número de documento inválido";
        }
      }

      return errors;
    },
    [findDocumentTypeByCode, validateDocumentNumber]
  );

  return {
    validateDocumentNumber,
    getDocumentTypeInfo,
    validateDocumentFormat,
    getValidationRules,
    validateAllDocumentFields,
  };
};

export default useDocumentValidation;
