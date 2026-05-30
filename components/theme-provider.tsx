"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = React.PropsWithChildren<{
  attribute?: string;
  defaultTheme?: Theme;
  disableTransitionOnChange?: boolean;
  enableSystem?: boolean;
}>;

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "theme";

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ResolvedTheme, disableTransitionOnChange: boolean) {
  const root = document.documentElement;

  if (disableTransitionOnChange) {
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(
        "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;transition:none!important}",
      ),
    );
    document.head.appendChild(style);
    window.getComputedStyle(document.body);
    window.setTimeout(() => {
      document.head.removeChild(style);
    }, 1);
  }

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
    defaultTheme === "dark" ? "dark" : "light",
  );

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem(
      STORAGE_KEY,
    ) as Theme | null;
    const activeTheme = storedTheme ?? defaultTheme;

    if (activeTheme === "system" && enableSystem) {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme, disableTransitionOnChange);
      queueMicrotask(() => {
        setThemeState(activeTheme);
        setResolvedTheme(systemTheme);
      });
      return;
    }

    const nextTheme: ResolvedTheme = activeTheme === "dark" ? "dark" : "light";
    applyTheme(nextTheme, disableTransitionOnChange);
    queueMicrotask(() => {
      setThemeState(activeTheme);
      setResolvedTheme(nextTheme);
    });
  }, [defaultTheme, disableTransitionOnChange, enableSystem]);

  React.useEffect(() => {
    if (theme !== "system" || !enableSystem) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemTheme = () => {
      const nextTheme = mediaQuery.matches ? "dark" : "light";
      setResolvedTheme(nextTheme);
      applyTheme(nextTheme, disableTransitionOnChange);
    };

    updateSystemTheme();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateSystemTheme);
      return () => mediaQuery.removeEventListener("change", updateSystemTheme);
    }

    mediaQuery.addListener(updateSystemTheme);
    return () => mediaQuery.removeListener(updateSystemTheme);
  }, [disableTransitionOnChange, enableSystem, theme]);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);
      window.localStorage.setItem(STORAGE_KEY, nextTheme);

      if (nextTheme === "system" && enableSystem) {
        const systemTheme = getSystemTheme();
        setResolvedTheme(systemTheme);
        applyTheme(systemTheme, disableTransitionOnChange);
        return;
      }

      const resolved: ResolvedTheme = nextTheme === "dark" ? "dark" : "light";
      setResolvedTheme(resolved);
      applyTheme(resolved, disableTransitionOnChange);
    },
    [disableTransitionOnChange, enableSystem],
  );

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
