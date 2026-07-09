// src/core/layout/UILayoutProvider.tsx
import React from "react";
import {
  type UIDeviceKind,
  type UILayoutMode,
  type UILayoutState,
  type UIResolvedLayoutMode,
} from "./layout.types";
import { useMediaQuery } from "../dom/useMediaQuery";

type SetLayoutModeAction =
  | UILayoutMode
  | ((prevMode: UILayoutMode) => UILayoutMode);

export interface UILayoutContextValue extends UILayoutState {
  setMode: (action: SetLayoutModeAction) => void;
  setNormalMode: () => void;
  setMobileMode: () => void;
  setAutoMode: () => void;
}

const UILayoutContext = React.createContext<UILayoutContextValue | null>(null);

export interface UILayoutProviderProps {
  children: React.ReactNode;

  /**
   * Modo controlado.
   *
   * normal: fuerza layout normal.
   * mobile: fuerza layout mobile.
   * auto: resuelve por breakpoint.
   */
  mode?: UILayoutMode;

  /**
   * Modo inicial cuando el provider no está controlado.
   */
  defaultMode?: UILayoutMode;

  /**
   * Se dispara cuando setMode intenta cambiar el modo.
   */
  onModeChange?: (mode: UILayoutMode) => void;

  /**
   * Breakpoint usado cuando mode="auto".
   */
  mobileBreakpoint?: number;

  /**
   * Información opcional de dispositivo.
   * La librería no intenta adivinar de forma agresiva.
   * La app host, Tauri o el runtime pueden pasar un valor más confiable.
   */
  deviceKind?: UIDeviceKind;

  /**
   * Si está activo, setMode no cambia el modo.
   * Útil para apps Android/nativas donde no quieres permitir alternar diseño.
   */
  lockMode?: boolean;

  /**
   * Si está activo, evita leer matchMedia durante el primer render.
   *
   * Útil para Next.js / SSR, porque el servidor y el primer render
   * del cliente deben coincidir para evitar hydration mismatch.
   *
   * En React puro puedes dejarlo en false.
   */
  ssrSafe?: boolean;
}

function resolveEffectiveMode(
  mode: UILayoutMode,
  matchesMobile: boolean
): UIResolvedLayoutMode {
  if (mode === "mobile") return "mobile";
  if (mode === "normal") return "normal";

  return matchesMobile ? "mobile" : "normal";
}

export const UILayoutProvider: React.FC<UILayoutProviderProps> = ({
  children,
  mode,
  defaultMode = "auto",
  onModeChange,
  mobileBreakpoint = 720,
  deviceKind = "unknown",
  lockMode = false,
  ssrSafe = false,
}) => {
  const isControlled = mode !== undefined;

  const [internalMode, setInternalMode] =
    React.useState<UILayoutMode>(defaultMode);

  const currentMode = isControlled ? mode : internalMode;

  const mobileQuery = React.useMemo(() => {
    return `(max-width: ${Math.max(0, mobileBreakpoint - 0.02)}px)`;
  }, [mobileBreakpoint]);

  const matchesMobile = useMediaQuery(mobileQuery, currentMode === "mobile", {
    initializeWithValue: !ssrSafe,
  });

  const effectiveMode = React.useMemo(
    () => resolveEffectiveMode(currentMode, matchesMobile),
    [currentMode, matchesMobile]
  );

  const canChangeMode = !lockMode;

  const setMode = React.useCallback(
    (action: SetLayoutModeAction) => {
      if (lockMode) return;

      const nextMode =
        typeof action === "function" ? action(currentMode) : action;

      if (!isControlled) {
        setInternalMode(nextMode);
      }

      onModeChange?.(nextMode);
    },
    [currentMode, isControlled, lockMode, onModeChange]
  );

  const setNormalMode = React.useCallback(() => {
    setMode("normal");
  }, [setMode]);

  const setMobileMode = React.useCallback(() => {
    setMode("mobile");
  }, [setMode]);

  const setAutoMode = React.useCallback(() => {
    setMode("auto");
  }, [setMode]);

  const value = React.useMemo<UILayoutContextValue>(
    () => ({
      mode: currentMode,
      effectiveMode,
      isMobile: effectiveMode === "mobile",
      isNormal: effectiveMode === "normal",
      mobileBreakpoint,
      deviceKind,
      lockMode,
      canChangeMode,
      setMode,
      setNormalMode,
      setMobileMode,
      setAutoMode,
    }),
    [
      currentMode,
      effectiveMode,
      mobileBreakpoint,
      deviceKind,
      lockMode,
      canChangeMode,
      setMode,
      setNormalMode,
      setMobileMode,
      setAutoMode,
    ]
  );

  return (
    <UILayoutContext.Provider value={value}>
      {children}
    </UILayoutContext.Provider>
  );
};

UILayoutProvider.displayName = "UILayoutProvider";

export function useUILayout(): UILayoutContextValue {
  const ctx = React.useContext(UILayoutContext);

  if (!ctx) {
    throw new Error("useUILayout must be used inside <UILayoutProvider />");
  }

  return ctx;
}

export function useOptionalUILayout(): UILayoutContextValue | null {
  return React.useContext(UILayoutContext);
}