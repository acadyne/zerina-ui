// src/core/viewport/UIViewportProvider.tsx
import React from "react";
import { useMediaQuery } from "../layout";
import {
  type UIDensity,
  type UIDensityMode,
  type UIInputKind,
  type UIOrientation,
  type UIViewportInfo,
} from "./viewport.types";

export interface UIViewportProviderProps {
  children: React.ReactNode;

  /**
   * Density controlada.
   *
   * auto:
   *   Resuelve automáticamente según input y dimensiones.
   *
   * compact:
   *   UI más densa, útil para mobile landscape o pantallas pequeñas.
   *
   * comfortable:
   *   Valor base recomendado.
   *
   * spacious:
   *   UI más aireada, útil para desktop/tablet amplio.
   */
  densityMode?: UIDensityMode;

  /**
   * Density inicial cuando densityMode no está controlado.
   */
  defaultDensityMode?: UIDensityMode;

  /**
   * width < narrowBreakpoint => isNarrow.
   */
  narrowBreakpoint?: number;

  /**
   * width >= wideBreakpoint => isWide.
   */
  wideBreakpoint?: number;

  /**
   * height < shortBreakpoint => isShort.
   */
  shortBreakpoint?: number;

  /**
   * height >= tallBreakpoint => isTall.
   */
  tallBreakpoint?: number;

  /**
   * Evita leer window/matchMedia durante el primer render.
   *
   * Útil para SSR/Next.js.
   * En Vite/Tauri/CSR normalmente puede quedarse en false.
   */
  ssrSafe?: boolean;
}

type ViewportSize = {
  width: number;
  height: number;
};

const DEFAULT_NARROW_BREAKPOINT = 480;
const DEFAULT_WIDE_BREAKPOINT = 1024;
const DEFAULT_SHORT_BREAKPOINT = 500;
const DEFAULT_TALL_BREAKPOINT = 800;

const UIViewportContext = React.createContext<UIViewportInfo | null>(null);

function getViewportSize(): ViewportSize {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function resolveOrientation(width: number, height: number): UIOrientation {
  if (width <= 0 || height <= 0) {
    return "portrait";
  }

  return height > width ? "portrait" : "landscape";
}

function resolveInputKind(options: {
  isAnyCoarse: boolean;
  isAnyFine: boolean;
  isPrimaryCoarse: boolean;
  isPrimaryFine: boolean;
  hasHover: boolean;
}): UIInputKind {
  const {
    isAnyCoarse,
    isAnyFine,
    isPrimaryCoarse,
    isPrimaryFine,
    hasHover,
  } = options;

  if (isAnyCoarse && isAnyFine) {
    return "hybrid";
  }

  if (isPrimaryCoarse || isAnyCoarse) {
    return "touch";
  }

  if (isPrimaryFine && hasHover) {
    return "mouse";
  }

  if (isPrimaryFine && !hasHover) {
    return "pen";
  }

  return "unknown";
}

function resolveDensity(options: {
  densityMode: UIDensityMode;
  inputKind: UIInputKind;
  width: number;
  height: number;
  isShort: boolean;
  isNarrow: boolean;
  isWide: boolean;
}): UIDensity {
  const { densityMode, inputKind, width, height, isShort, isNarrow, isWide } =
    options;

  if (densityMode !== "auto") {
    return densityMode;
  }

  if (width <= 0 || height <= 0) {
    return "comfortable";
  }

  if (isShort || isNarrow) {
    return "compact";
  }

  if (inputKind === "touch") {
    return "compact";
  }

  if (inputKind === "hybrid") {
    return "comfortable";
  }

  if (isWide && height >= DEFAULT_TALL_BREAKPOINT) {
    return "spacious";
  }

  return "comfortable";
}

export const UIViewportProvider: React.FC<UIViewportProviderProps> = ({
  children,
  densityMode,
  defaultDensityMode = "auto",
  narrowBreakpoint = DEFAULT_NARROW_BREAKPOINT,
  wideBreakpoint = DEFAULT_WIDE_BREAKPOINT,
  shortBreakpoint = DEFAULT_SHORT_BREAKPOINT,
  tallBreakpoint = DEFAULT_TALL_BREAKPOINT,
  ssrSafe = false,
}) => {
  const [viewportSize, setViewportSize] = React.useState<ViewportSize>(() => {
    if (ssrSafe) {
      return {
        width: 0,
        height: 0,
      };
    }

    return getViewportSize();
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setViewportSize(getViewportSize());
    };

    update();

    window.addEventListener("resize", update);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", update);
    }

    return () => {
      window.removeEventListener("resize", update);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", update);
      }
    };
  }, []);

  const initializeWithValue = !ssrSafe;

  const isAnyCoarse = useMediaQuery("(any-pointer: coarse)", false, {
    initializeWithValue,
  });

  const isAnyFine = useMediaQuery("(any-pointer: fine)", false, {
    initializeWithValue,
  });

  const isPrimaryCoarse = useMediaQuery("(pointer: coarse)", false, {
    initializeWithValue,
  });

  const isPrimaryFine = useMediaQuery("(pointer: fine)", false, {
    initializeWithValue,
  });

  const hasHover = useMediaQuery("(hover: hover)", false, {
    initializeWithValue,
  });

  const resolvedDensityMode = densityMode ?? defaultDensityMode;

  const value = React.useMemo<UIViewportInfo>(() => {
    const { width, height } = viewportSize;

    const aspectRatio = height > 0 ? width / height : 0;

    const orientation = resolveOrientation(width, height);
    const isPortrait = orientation === "portrait";
    const isLandscape = orientation === "landscape";

    const isNarrow = width > 0 && width < narrowBreakpoint;
    const isWide = width >= wideBreakpoint;

    const isShort = height > 0 && height < shortBreakpoint;
    const isTall = height >= tallBreakpoint;

    const inputKind = resolveInputKind({
      isAnyCoarse,
      isAnyFine,
      isPrimaryCoarse,
      isPrimaryFine,
      hasHover,
    });

    const isTouch = inputKind === "touch" || inputKind === "hybrid";

    const density = resolveDensity({
      densityMode: resolvedDensityMode,
      inputKind,
      width,
      height,
      isShort,
      isNarrow,
      isWide,
    });

    return {
      width,
      height,
      aspectRatio,

      orientation,
      isPortrait,
      isLandscape,

      isNarrow,
      isWide,
      isShort,
      isTall,

      inputKind,
      isTouch,
      hasHover,

      densityMode: resolvedDensityMode,
      density,
    };
  }, [
    viewportSize,
    narrowBreakpoint,
    wideBreakpoint,
    shortBreakpoint,
    tallBreakpoint,
    isAnyCoarse,
    isAnyFine,
    isPrimaryCoarse,
    isPrimaryFine,
    hasHover,
    resolvedDensityMode,
  ]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    root.setAttribute("data-ui-orientation", value.orientation);
    root.setAttribute("data-ui-density", value.density);
    root.setAttribute("data-ui-density-mode", value.densityMode);
    root.setAttribute("data-ui-input", value.inputKind);
  }, [value.orientation, value.density, value.densityMode, value.inputKind]);

  return (
    <UIViewportContext.Provider value={value}>
      {children}
    </UIViewportContext.Provider>
  );
};

UIViewportProvider.displayName = "UIViewportProvider";

export function useUIViewport(): UIViewportInfo {
  const ctx = React.useContext(UIViewportContext);

  if (!ctx) {
    throw new Error(
      "useUIViewport must be used inside <UIViewportProvider />"
    );
  }

  return ctx;
}

export function useOptionalUIViewport(): UIViewportInfo | null {
  return React.useContext(UIViewportContext);
}