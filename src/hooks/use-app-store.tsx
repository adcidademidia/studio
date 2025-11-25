
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { LowerThird, Theme } from "@/lib/types";
import { APP_STORAGE_KEY } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface AppState {
  isInitialized: boolean;
  lowerThirds: LowerThird[];
  themes: Theme[];
  activeThemeId: string | null;
  addLowerThird: (item: Omit<LowerThird, "id">) => void;
  updateLowerThird: (item: LowerThird) => void;
  removeLowerThird: (id: string) => void;
  moveLowerThird: (id: string, direction: "up" | "down") => void;
  addTheme: (theme: Omit<Theme, "id">) => void;
  updateTheme: (theme: Theme) => void;
  removeTheme: (id: string) => void;
  getThemeById: (id: string | null) => Theme | undefined;
  getActiveTheme: () => Theme | undefined;
  setActiveThemeId: (id: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const defaultThemes: Theme[] = [
  {
    id: "theme-1",
    name: "Default Light",
    titleColor: "#000000",
    subtitleColor: "#333333",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  {
    id: "theme-2",
    name: "Default Dark",
    titleColor: "#FFFFFF",
    subtitleColor: "#CCCCCC",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  {
    id: "theme-3",
    name: "Vibrant",
    titleColor: "#FFFFFF",
    subtitleColor: "#FFFFFF",
    backgroundColor: "rgba(41, 171, 226, 0.9)",
    backgroundLayer1: PlaceHolderImages[0]?.imageUrl || "",
    backgroundLayer2: PlaceHolderImages[1]?.imageUrl || "",
    backgroundLayer3: PlaceHolderImages[2]?.imageUrl || "",
  },
];

const defaultLowerThirds: LowerThird[] = [
    { id: "person-1", type: "person", title: "John Doe", subtitle: "Lead Pastor" },
    { id: "person-2", type: "person", title: "Jane Smith", subtitle: "Worship Leader" },
    { id: "music-1", type: "music", title: "Amazing Grace", subtitle: "John Newton" },
]

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [lowerThirds, setLowerThirds] = useState<LowerThird[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(APP_STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        setLowerThirds(parsedState.lowerThirds || defaultLowerThirds);
        setThemes(parsedState.themes || defaultThemes);
        setActiveThemeId(parsedState.activeThemeId || defaultThemes[0]?.id || null);
      } else {
        setLowerThirds(defaultLowerThirds);
        setThemes(defaultThemes);
        setActiveThemeId(defaultThemes[0]?.id || null);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      setLowerThirds(defaultLowerThirds);
      setThemes(defaultThemes);
      setActiveThemeId(defaultThemes[0]?.id || null);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        const stateToStore = JSON.stringify({ lowerThirds, themes, activeThemeId });
        localStorage.setItem(APP_STORAGE_KEY, stateToStore);
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [lowerThirds, themes, activeThemeId, isInitialized]);
  
  const addLowerThird = (item: Omit<LowerThird, "id">) => {
    const newItem = { ...item, id: `${item.type}-${Date.now()}` };
    setLowerThirds((prev) => [...prev, newItem]);
  };

  const updateLowerThird = (item: LowerThird) => {
    setLowerThirds((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  };

  const removeLowerThird = (id: string) => {
    setLowerThirds((prev) => prev.filter((i) => i.id !== id));
  };
  
  const moveLowerThird = (id: string, direction: "up" | "down") => {
    setLowerThirds(prev => {
      const array = [...prev];
      const index = array.findIndex(item => item.id === id);
      if (index === -1) return array;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= array.length) return array;
      
      const item = array[index];
      const otherItem = array[newIndex];
      // only move within the same type
      if (item.type !== otherItem.type) return array;

      [array[index], array[newIndex]] = [array[newIndex], array[index]]; // Swap
      return array;
    });
  };

  const addTheme = (theme: Omit<Theme, "id">) => {
    const newTheme = { ...theme, id: `theme-${Date.now()}` };
    setThemes((prev) => [...prev, newTheme]);
  };

  const updateTheme = (theme: Theme) => {
    setThemes((prev) => prev.map((t) => (t.id === theme.id ? theme : t)));
  };

  const removeTheme = (id: string) => {
    if (activeThemeId === id) {
        // If the active theme is being deleted, try to set the first available theme as active.
        const remainingThemes = themes.filter((t) => t.id !== id);
        setActiveThemeId(remainingThemes[0]?.id || null);
    }
    setThemes((prev) => prev.filter((t) => t.id !== id));
  };
  
  const getThemeById = (id: string | null) => {
    if (!id) return undefined;
    return themes.find(t => t.id === id);
  }

  const getActiveTheme = () => {
    return getThemeById(activeThemeId);
  }

  const value = {
    isInitialized,
    lowerThirds,
    themes,
    activeThemeId,
    addLowerThird,
    updateLowerThird,
    removeLowerThird,
    moveLowerThird,
    addTheme,
    updateTheme,
    removeTheme,
    getThemeById,
    getActiveTheme,
    setActiveThemeId,
  };

  if (!isInitialized) {
    return <AppContext.Provider value={{...value, lowerThirds: [], themes: []}}>{children}</AppContext.Provider>;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within a AppStoreProvider");
  }
  return context;
};

    