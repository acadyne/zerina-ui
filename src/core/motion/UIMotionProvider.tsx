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
  getProgressIndeterminateTransition,
  shouldAnimateProgressIndeterminate,
} from "./motion.presets";
import { resolveEffectiveMotionLevel } from "./motion.utils";

const MOTION_DOCUMENT_ATTRIBUTES = [
  "data-ui-motion",
  "data-ui-motion-effective",
  "data-ui-reduced-motion",
] as const;

type MotionDocumentAttribute =
  (typeof MOTION_DOCUMENT_ATTRIBUTES)[number];

type MotionDocumentAttributeValues = Record<
  MotionDocumentAttribute,
  string | null
>;

const motionDocumentOwners =
  new WeakMap<Document, symbol>();

const useIsomorphicLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect;

function readMotionDocumentAttributes(
  root: HTMLElement
): MotionDocumentAttributeValues {
  return {
    "data-ui-motion":
      root.getAttribute("data-ui-motion"),
    "data-ui-motion-effective":
      root.getAttribute("data-ui-motion-effective"),
    "data-ui-reduced-motion":
      root.getAttribute("data-ui-reduced-motion"),
  };
}

function writeMotionDocumentAttributes(
  root: HTMLElement,
  values: MotionDocumentAttributeValues
): void {
  for (const attribute of MOTION_DOCUMENT_ATTRIBUTES) {
    const value = values[attribute];

    if (value === null) {
      root.removeAttribute(attribute);
      continue;
    }

    root.setAttribute(attribute, value);
  }
}

export interface UIMotionContextValue extends UIMotionState {
  setLevel: (level: UIMotionLevel) => void;
  getTransition: typeof getMotionTransition;
  getVariants: typeof getMotionPresetVariants;
  getPressMotion: typeof getPressMotion;
  getProgressIndeterminateTransition: typeof getProgressIndeterminateTransition;
  shouldAnimateProgressIndeterminate: typeof shouldAnimateProgressIndeterminate;
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

export const UIMotionProvider: React.FC<UIMotionProviderProps> = ({
  children,
  level,
  defaultLevel = "subtle",
  onLevelChange,
  respectReducedMotion = true,
}) => {
  const parentMotionContext =
    React.useContext(UIMotionContext);

  if (parentMotionContext) {
    throw new Error(
      "UIMotionProvider cannot be nested because it owns the global document motion state."
    );
  }

  const [documentOwner] =
    React.useState(() => Symbol("UIMotionProvider"));

  const ownedDocumentRef =
    React.useRef<Document | null>(null);

  const previousAttributesRef =
    React.useRef<MotionDocumentAttributeValues | null>(null);

  const writtenAttributesRef =
    React.useRef<MotionDocumentAttributeValues | null>(null);

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
      resolveEffectiveMotionLevel({
        level: currentLevel,
        prefersReducedMotion,
        respectReducedMotion,
      }),
    [
      currentLevel,
      prefersReducedMotion,
      respectReducedMotion,
    ]
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

  const getProgressTransition = React.useCallback(
    (motionLevel: UIMotionLevel) =>
      getProgressIndeterminateTransition(motionLevel),
    []
  );

  const getShouldAnimateProgress = React.useCallback(
    (motionLevel: UIMotionLevel) =>
      shouldAnimateProgressIndeterminate(motionLevel),
    []
  );

  useIsomorphicLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const activeOwner =
      motionDocumentOwners.get(document);

    if (
      activeOwner &&
      activeOwner !== documentOwner
    ) {
      throw new Error(
        "Only one UIMotionProvider can own the global document motion state."
      );
    }

    const root = document.documentElement;

    motionDocumentOwners.set(
      document,
      documentOwner
    );

    ownedDocumentRef.current = document;
    previousAttributesRef.current =
      readMotionDocumentAttributes(root);

    return () => {
      const ownedDocument =
        ownedDocumentRef.current;

      if (
        !ownedDocument ||
        motionDocumentOwners.get(ownedDocument) !==
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
          MOTION_DOCUMENT_ATTRIBUTES
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

      motionDocumentOwners.delete(
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
      motionDocumentOwners.get(ownedDocument) !==
        documentOwner
    ) {
      return;
    }

    const values: MotionDocumentAttributeValues = {
      "data-ui-motion": currentLevel,
      "data-ui-motion-effective": effectiveLevel,
      "data-ui-reduced-motion":
        prefersReducedMotion ? "true" : "false",
    };

    writeMotionDocumentAttributes(
      ownedDocument.documentElement,
      values
    );

    writtenAttributesRef.current = values;
  }, [
    documentOwner,
    currentLevel,
    effectiveLevel,
    prefersReducedMotion,
  ]);

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
      getProgressIndeterminateTransition: getProgressTransition,
      shouldAnimateProgressIndeterminate: getShouldAnimateProgress,
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
      getProgressTransition,
      getShouldAnimateProgress,
    ]
  );

  return (
    <UIMotionContext.Provider value={value}>
      {children}
    </UIMotionContext.Provider>
  );
};

UIMotionProvider.displayName = "UIMotionProvider";
