// src/core/viewport/UIViewportProvider.tsx
import React from "react";
import { useIsomorphicLayoutEffect } from "../react/useIsomorphicLayoutEffect";
import { useMediaQuery, useViewportSize } from "../dom";
import {
  type UIDensity,
  type UIDensityMode,
  type UIInputKind,
  type UIOrientation,
  type UIViewportBreakpoints,
  type UIViewportInfo,
  type UIViewportMode,
} from "./viewport.types";

import {
  DEFAULT_UI_VIEWPORT_BREAKPOINTS,
  resolveUIViewportKind,
} from "./viewport.utils";

const VIEWPORT_DOCUMENT_ATTRIBUTES = [
  "data-ui-viewport",
  "data-ui-viewport-mode",
  "data-ui-orientation",
  "data-ui-density",
  "data-ui-density-mode",
  "data-ui-input",
] as const;

type ViewportDocumentAttribute =
  (typeof VIEWPORT_DOCUMENT_ATTRIBUTES)[number];

type ViewportDocumentAttributeValues = Record<
  ViewportDocumentAttribute,
  string | null
>;

const viewportDocumentOwners =
  new WeakMap<Document, symbol>();

function readViewportDocumentAttributes(
  root: HTMLElement
): ViewportDocumentAttributeValues {
  return {
    "data-ui-viewport":
      root.getAttribute("data-ui-viewport"),
    "data-ui-viewport-mode":
      root.getAttribute("data-ui-viewport-mode"),
    "data-ui-orientation":
      root.getAttribute("data-ui-orientation"),
    "data-ui-density":
      root.getAttribute("data-ui-density"),
    "data-ui-density-mode":
      root.getAttribute("data-ui-density-mode"),
    "data-ui-input":
      root.getAttribute("data-ui-input"),
  };
}

function writeViewportDocumentAttributes(
  root: HTMLElement,
  values: ViewportDocumentAttributeValues
): void {
  for (
    const attribute of
    VIEWPORT_DOCUMENT_ATTRIBUTES
  ) {
    const value = values[attribute];

    if (value === null) {
      root.removeAttribute(attribute);
      continue;
    }

    root.setAttribute(attribute, value);
  }
}

type SetViewportModeAction =
  | UIViewportMode
  | ((prevMode: UIViewportMode) => UIViewportMode);

export interface UIViewportContextValue extends UIViewportInfo {
  setMode: (action: SetViewportModeAction) => void;
  setAutoMode: () => void;
  setMobileMode: () => void;
  setTabletMode: () => void;
  setDesktopMode: () => void;
}

export interface UIViewportProviderProps {
  children: React.ReactNode;

  /**
   * Modo responsive controlado.
   *
   * auto:
   *   Resuelve mobile/tablet/desktop usando breakpoints.
   *
   * mobile/tablet/desktop:
   *   Fuerza el modo efectivo.
   */
  mode?: UIViewportMode;

  /**
   * Modo inicial cuando mode no está controlado.
   */
  defaultMode?: UIViewportMode;

  /**
   * Se dispara cuando cambia el modo configurado.
   */
  onModeChange?: (mode: UIViewportMode) => void;

  /**
   * Breakpoints oficiales para resolver kind.
   *
   * width < tablet => mobile
   * width >= tablet && width < desktop => tablet
   * width >= desktop => desktop
   */
  breakpoints?: Partial<UIViewportBreakpoints>;

  /**
   * Density controlada.
   */
  densityMode?: UIDensityMode;

  /**
   * Density inicial cuando densityMode no está controlado.
   */
  defaultDensityMode?: UIDensityMode;

  /**
   * width < narrowBreakpoint => isNarrow.
   *
   * Señal auxiliar. No decide mobile/tablet/desktop.
   */
  narrowBreakpoint?: number;

  /**
   * width >= wideBreakpoint => isWide.
   *
   * Señal auxiliar. No decide mobile/tablet/desktop.
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
   */
  ssrSafe?: boolean;
}

const DEFAULT_NARROW_BREAKPOINT = 480;
const DEFAULT_WIDE_BREAKPOINT = 1024;
const DEFAULT_SHORT_BREAKPOINT = 500;
const DEFAULT_TALL_BREAKPOINT = 800;

const UIViewportContext =
  React.createContext<UIViewportContextValue | null>(null);

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
  mode,
  defaultMode = "auto",
  onModeChange,
  breakpoints,
  densityMode,
  defaultDensityMode = "auto",
  narrowBreakpoint = DEFAULT_NARROW_BREAKPOINT,
  wideBreakpoint = DEFAULT_WIDE_BREAKPOINT,
  shortBreakpoint = DEFAULT_SHORT_BREAKPOINT,
  tallBreakpoint = DEFAULT_TALL_BREAKPOINT,
  ssrSafe = false,
}) => {
  const parentViewportContext =
    React.useContext(UIViewportContext);

  if (parentViewportContext) {
    throw new Error(
      "UIViewportProvider cannot be nested because it owns the global document viewport state."
    );
  }

  const [documentOwner] =
    React.useState(() => Symbol("UIViewportProvider"));

  const ownedDocumentRef =
    React.useRef<Document | null>(null);

  const previousAttributesRef =
    React.useRef<ViewportDocumentAttributeValues | null>(null);

  const writtenAttributesRef =
    React.useRef<ViewportDocumentAttributeValues | null>(null);

  const isModeControlled = mode !== undefined;

  const [internalMode, setInternalMode] =
    React.useState<UIViewportMode>(defaultMode);

  const currentMode = isModeControlled ? mode : internalMode;

  const resolvedBreakpoints = React.useMemo<UIViewportBreakpoints>(
    () => ({
      ...DEFAULT_UI_VIEWPORT_BREAKPOINTS,
      ...breakpoints,
    }),
    [breakpoints]
  );

  const viewportSize = useViewportSize({ ssrSafe });

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

  const setMode = React.useCallback(
    (action: SetViewportModeAction) => {
      const nextMode =
        typeof action === "function" ? action(currentMode) : action;

      if (!isModeControlled) {
        setInternalMode(nextMode);
      }

      onModeChange?.(nextMode);
    },
    [currentMode, isModeControlled, onModeChange]
  );

  const setAutoMode = React.useCallback(() => {
    setMode("auto");
  }, [setMode]);

  const setMobileMode = React.useCallback(() => {
    setMode("mobile");
  }, [setMode]);

  const setTabletMode = React.useCallback(() => {
    setMode("tablet");
  }, [setMode]);

  const setDesktopMode = React.useCallback(() => {
    setMode("desktop");
  }, [setMode]);

  const value = React.useMemo<UIViewportContextValue>(() => {
    const { width, height } = viewportSize;

    const aspectRatio = height > 0 ? width / height : 0;

    const orientation = resolveOrientation(width, height);
    const isPortrait = orientation === "portrait";
    const isLandscape = orientation === "landscape";

    const kind = resolveUIViewportKind({
      mode: currentMode,
      width,
      breakpoints: resolvedBreakpoints,
    });

    const isMobile = kind === "mobile";
    const isTablet = kind === "tablet";
    const isDesktop = kind === "desktop";

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
      mode: currentMode,
      kind,

      isMobile,
      isTablet,
      isDesktop,

      breakpoints: resolvedBreakpoints,

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

      setMode,
      setAutoMode,
      setMobileMode,
      setTabletMode,
      setDesktopMode,
    };
  }, [
    viewportSize,
    currentMode,
    resolvedBreakpoints,
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
    setMode,
    setAutoMode,
    setMobileMode,
    setTabletMode,
    setDesktopMode,
  ]);

  useIsomorphicLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const activeOwner =
      viewportDocumentOwners.get(document);

    if (
      activeOwner &&
      activeOwner !== documentOwner
    ) {
      throw new Error(
        "Only one UIViewportProvider can own the global document viewport state."
      );
    }

    const root = document.documentElement;

    viewportDocumentOwners.set(
      document,
      documentOwner
    );

    ownedDocumentRef.current = document;
    previousAttributesRef.current =
      readViewportDocumentAttributes(root);

    return () => {
      const ownedDocument =
        ownedDocumentRef.current;

      if (
        !ownedDocument ||
        viewportDocumentOwners.get(ownedDocument) !==
          documentOwner
      ) {
        return;
      }

      const ownedRoot =
        ownedDocument.documentElement;

      const previousAttributes =
        previousAttributesRef.current;

      const writtenAttributes =
        writtenAttributesRef.current;

      if (
        previousAttributes &&
        writtenAttributes
      ) {
        for (
          const attribute of
          VIEWPORT_DOCUMENT_ATTRIBUTES
        ) {
          if (
            ownedRoot.getAttribute(attribute) !==
            writtenAttributes[attribute]
          ) {
            continue;
          }

          const previousValue =
            previousAttributes[attribute];

          if (previousValue === null) {
            ownedRoot.removeAttribute(attribute);
          } else {
            ownedRoot.setAttribute(
              attribute,
              previousValue
            );
          }
        }
      }

      viewportDocumentOwners.delete(
        ownedDocument
      );

      ownedDocumentRef.current = null;
      previousAttributesRef.current = null;
      writtenAttributesRef.current = null;
    };
  }, [documentOwner]);

  useIsomorphicLayoutEffect(() => {
    const ownedDocument =
      ownedDocumentRef.current;

    if (
      !ownedDocument ||
      viewportDocumentOwners.get(ownedDocument) !==
        documentOwner
    ) {
      return;
    }

    const values: ViewportDocumentAttributeValues = {
      "data-ui-viewport": value.kind,
      "data-ui-viewport-mode": value.mode,
      "data-ui-orientation": value.orientation,
      "data-ui-density": value.density,
      "data-ui-density-mode": value.densityMode,
      "data-ui-input": value.inputKind,
    };

    writeViewportDocumentAttributes(
      ownedDocument.documentElement,
      values
    );

    writtenAttributesRef.current = values;
  }, [
    documentOwner,
    value.kind,
    value.mode,
    value.orientation,
    value.density,
    value.densityMode,
    value.inputKind,
  ]);

  return (
    <UIViewportContext.Provider value={value}>
      {children}
    </UIViewportContext.Provider>
  );
};

UIViewportProvider.displayName = "UIViewportProvider";

export function useUIViewport(): UIViewportContextValue {
  const ctx = React.useContext(UIViewportContext);

  if (!ctx) {
    throw new Error(
      "useUIViewport must be used inside <UIViewportProvider />"
    );
  }

  return ctx;
}

export function useOptionalUIViewport(): UIViewportContextValue | null {
  return React.useContext(UIViewportContext);
}
