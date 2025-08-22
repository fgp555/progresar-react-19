import { useEffect, useState } from "react";

type Theme = "light" | "dark-mode";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });

  useEffect(() => {
    const body = document.body;
    body.classList.remove("light", "dark-mode");
    body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark-mode" : "light"));
  };

  return { theme, setTheme, toggleTheme };
};
