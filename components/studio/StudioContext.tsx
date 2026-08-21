"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

interface StudioContextType {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMobile = () => setIsOpenMobile((prev) => !prev);
  const closeMobile = () => setIsOpenMobile(false);

  const value = useMemo(
    () => ({
      isCollapsed,
      setIsCollapsed,
      toggleSidebar,
      isOpenMobile,
      setIsOpenMobile,
      toggleMobile,
      closeMobile,
    }),
    [isCollapsed, isOpenMobile]
  );

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
}
