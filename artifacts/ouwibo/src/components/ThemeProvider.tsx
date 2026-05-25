import { createContext, useContext, useEffect, useState } from "react";

export type BaseMode    = "dark" | "light";
export type AccentColor = "orange" | "blue" | "purple" | "green" | "cyan" | "rose" | "gold";

export interface AccentInfo { id: AccentColor; label: string; hex: string; }

export const ACCENT_LIST: AccentInfo[] = [
  { id: "orange", label: "Orange", hex: "#d0612a" },
  { id: "blue",   label: "Blue",   hex: "#4f7ed4" },
  { id: "purple", label: "Purple", hex: "#8e68c8" },
  { id: "green",  label: "Green",  hex: "#3d9e73" },
  { id: "cyan",   label: "Cyan",   hex: "#2f9db5" },
  { id: "rose",   label: "Rose",   hex: "#c04272" },
  { id: "gold",   label: "Gold",   hex: "#c19830" },
];

interface ThemeContextValue {
  mode:       BaseMode;
  accent:     AccentColor;
  isDark:     boolean;
  setMode:    (m: BaseMode)    => void;
  setAccent:  (a: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark", accent: "orange", isDark: true,
  setMode: () => {}, setAccent: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode,   setModeState]   = useState<BaseMode>(()    => (localStorage.getItem("ouwibo-mode")   as BaseMode)    ?? "dark");
  const [accent, setAccentState] = useState<AccentColor>(() => (localStorage.getItem("ouwibo-accent") as AccentColor) ?? "orange");

  const setMode   = (m: BaseMode)    => { setModeState(m);   localStorage.setItem("ouwibo-mode",   m); };
  const setAccent = (a: AccentColor) => { setAccentState(a); localStorage.setItem("ouwibo-accent", a); };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.setAttribute("data-accent", accent);
  }, [mode, accent]);

  return (
    <ThemeContext.Provider value={{ mode, accent, isDark: mode === "dark", setMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() { return useContext(ThemeContext); }
