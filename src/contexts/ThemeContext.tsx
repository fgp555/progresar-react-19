// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkModeState] = useState(() => {
    // Verificar si hay preferencia guardada
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    
    // Si no hay preferencia guardada, usar la preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem('darkMode', dark.toString());
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // Aplicar la clase al HTML
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar si no hay preferencia guardada
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme === null) {
        setDarkModeState(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    darkMode,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema en cualquier componente
export const useThemeColors = () => {
  const { darkMode } = useTheme();
  
  return {
    // Colores de fondo principales
    bg: {
      primary: darkMode ? 'bg-gray-900' : 'bg-white',
      secondary: darkMode ? 'bg-gray-800' : 'bg-gray-50',
      tertiary: darkMode ? 'bg-gray-700' : 'bg-gray-100',
    },
    
    // Colores de texto
    text: {
      primary: darkMode ? 'text-white' : 'text-black',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-700',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500',
    },
    
    // Colores de borde
    border: {
      primary: darkMode ? 'border-gray-700' : 'border-gray-200',
      secondary: darkMode ? 'border-gray-600' : 'border-gray-300',
    },
    
    // Colores de estado
    status: {
      success: darkMode ? 'text-green-400' : 'text-green-600',
      error: darkMode ? 'text-red-400' : 'text-red-600',
      warning: darkMode ? 'text-yellow-400' : 'text-yellow-600',
      info: darkMode ? 'text-blue-400' : 'text-blue-600',
    },
    
    // Colores de botones
    button: {
      primary: darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600',
      secondary: darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
    }
  };
};