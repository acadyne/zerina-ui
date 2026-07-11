// src/core/motion/UIMotionProvider.tsx
import React from "react";
import { useMediaQuery } from "../dom";
import type {
  UIMotionIntent,
  UIMotionLevel,
  UIMotionPreset,
  UIMotionState,
} from "./motion.types";
import {
  getMotionPresetVariants,
  getMotionTransition,
  getPressMotion,
} from "./motion.presets";

export interface UIMotionContextValue extends UIMotionState {
  setLevel: (level: UIMotionLevel) => void;
  getTransition: typeof getMotionTransition;
  getVariants: typeof getMotionPresetVariants;
  getPressMotion: typeof getPressMotion;
}

export const UIMotionContext =
  React.createContext<UIMotionContextValue | null>(null);

export interface UIMotionProviderProps {
  children: React.ReactNode;

  /**
   * Nivel controlado de motion.
   */
  level?: UIMotionLevel;

  /**
   * Nivel inicial cuando el provider no está controlado.
   */
  defaultLevel?: UIMotionLevel;

  /**
   * Se dispara cuando setLevel intenta cambiar el nivel.
   */
  onLevelChange?: (level: UIMotionLevel) => void;

  /**
   * Si está activo, respeta prefers-reduced-motion.
   */
  respectReducedMotion?: boolean;
}

function resolveEffectiveLevel({
  level,
  prefersReducedMotion,
  respectReducedMotion,
}: {
  level: UIMotionLevel;
  prefersReducedMotion: boolean;
  respectReducedMotion: boolean;
}): UIMotionLevel {
  if (level === "none") return "none";

  if (respectReducedMotion && prefersReducedMotion) {
    return "reduced";
  }

  return level;
}

export const UIMotionProvider: React.FC<UIMotionProviderProps> = ({
  children,
  level,
  defaultLevel = "subtle",
  onLevelChange,
  respectReducedMotion = true,
}) => {
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
    false
  );

  const isControlled = level !== undefined;
  const [internalLevel, setInternalLevel] =
    React.useState<UIMotionLevel>(defaultLevel);

  const currentLevel = isControlled ? level : internalLevel;

  const effectiveLevel = React.useMemo(
    () =>
      resolveEffectiveLevel({
        level: currentLevel,
        prefersReducedMotion,
        respectReducedMotion,
      }),
    [currentLevel, prefersReducedMotion, respectReducedMotion]
  );

  const setLevel = React.useCallback(
    (nextLevel: UIMotionLevel) => {
      if (!isControlled) {
        setInternalLevel(nextLevel);
      }

      onLevelChange?.(nextLevel);
    },
    [isControlled, onLevelChange]
  );

  const shouldAnimate = effectiveLevel !== "none";

  const getTransition = React.useCallback(
    (motionLevel: UIMotionLevel, intent?: UIMotionIntent) =>
      getMotionTransition(motionLevel, intent),
    []
  );

  const getVariants = React.useCallback(
    (preset: UIMotionPreset, motionLevel: UIMotionLevel) =>
      getMotionPresetVariants(preset, motionLevel),
    []
  );

  const getPress = React.useCallback(
    (motionLevel: UIMotionLevel) => getPressMotion(motionLevel),
    []
  );

  React.useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-ui-motion", currentLevel);
    root.setAttribute("data-ui-motion-effective", effectiveLevel);
    root.setAttribute(
      "data-ui-reduced-motion",
      prefersReducedMotion ? "true" : "false"
    );
  }, [currentLevel, effectiveLevel, prefersReducedMotion]);

  const value = React.useMemo<UIMotionContextValue>(
    () => ({
      level: currentLevel,
      effectiveLevel,
      prefersReducedMotion,
      respectReducedMotion,
      shouldAnimate,
      setLevel,
      getTransition,
      getVariants,
      getPressMotion: getPress,
    }),
    [
      currentLevel,
      effectiveLevel,
      prefersReducedMotion,
      respectReducedMotion,
      shouldAnimate,
      setLevel,
      getTransition,
      getVariants,
      getPress,
    ]
  );

  return (
    <UIMotionContext.Provider value={value}>
      {children}
    </UIMotionContext.Provider>
  );
};

UIMotionProvider.displayName = "UIMotionProvider";