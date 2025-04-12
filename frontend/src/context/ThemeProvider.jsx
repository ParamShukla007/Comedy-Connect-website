import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;
      
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove("light", "dark");
    // Add the current theme class
    root.classList.add(theme);
    
    localStorage.setItem("theme", theme);
    
    // Update theme color for mobile browsers
    const themeColor = theme === "dark" ? "#030711" : "#ffffff";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(theme === "light" ? "dark" : "light") }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
