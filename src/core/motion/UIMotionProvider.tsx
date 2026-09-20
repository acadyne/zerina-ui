// src/core/motion/UIMotionProvider.tsx
import React from "react";
import { useIsomorphicLayoutEffect } from "../react/useIsomorphicLayoutEffect";
import { useControllableValue } from "../react/useControllableValue";
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
import {
  getMotionCSSProjection,
  UI_MOTION_POLICY_CSS_VARIABLES,
  type UIMotionPolicyCSSVariable,
} from "./motion.tokens";
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

/*
 * Coordina un único owner de motion por Document.
 * El símbolo impide que un cleanup obsoleto libere un owner más reciente.
 */
const motionDocumentOwners =
  new WeakMap<Document, symbol>();

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

type MotionStyleSnapshot = {
  exists: boolean;
  value: string;
  priority: string;
};

type MotionStyleSnapshots =
  Map<
    UIMotionPolicyCSSVariable,
    MotionStyleSnapshot
  >;

function hasInlineStyleProperty(
  style: CSSStyleDeclaration,
  property: string
): boolean {
  for (
    let index = 0;
    index < style.length;
    index += 1
  ) {
    if (style.item(index) === property) {
      return true;
    }
  }

  return false;
}

function readMotionStyleSnapshot(
  root: HTMLElement,
  property: UIMotionPolicyCSSVariable
): MotionStyleSnapshot {
  return {
    exists:
      hasInlineStyleProperty(
        root.style,
        property
      ),

    value:
      root.style.getPropertyValue(
        property
      ),

    priority:
      root.style.getPropertyPriority(
        property
      ),
  };
}

function readMotionStyleSnapshots(
  root: HTMLElement
): MotionStyleSnapshots {
  return new Map(
    UI_MOTION_POLICY_CSS_VARIABLES.map(
      (property) => [
        property,
        readMotionStyleSnapshot(
          root,
          property
        ),
      ] as const
    )
  );
}

function motionStyleSnapshotsMatch(
  left: MotionStyleSnapshot,
  right: MotionStyleSnapshot
): boolean {
  return (
    left.exists === right.exists &&
    left.value === right.value &&
    left.priority === right.priority
  );
}

function restoreMotionStyleSnapshot(
  root: HTMLElement,
  property: UIMotionPolicyCSSVariable,
  snapshot: MotionStyleSnapshot
): void {
  if (!snapshot.exists) {
    root.style.removeProperty(
      property
    );

    return;
  }

  root.style.setProperty(
    property,
    snapshot.value,
    snapshot.priority
  );
}

function writeMotionCSSProjection(
  root: HTMLElement
): void {
  const projection =
    getMotionCSSProjection();

  for (
    const property of
    UI_MOTION_POLICY_CSS_VARIABLES
  ) {
    root.style.setProperty(
      property,
      projection[property]
    );
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

  const previousStylesRef =
    React.useRef<MotionStyleSnapshots | null>(null);

  const writtenStylesRef =
    React.useRef<MotionStyleSnapshots | null>(null);

  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
    false
  );

  const {
    value:
      currentLevel,

    setUncontrolledValue:
      setInternalLevel,
  } =
    useControllableValue<UIMotionLevel>({
      value:
        level,

      defaultValue:
        defaultLevel,
    });

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
      setInternalLevel(
        nextLevel
      );

      onLevelChange?.(
        nextLevel
      );
    },
    [
      onLevelChange,
      setInternalLevel,
    ]
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

    previousStylesRef.current =
      readMotionStyleSnapshots(root);

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

      const previousStyles =
        previousStylesRef.current;

      const writtenStyles =
        writtenStylesRef.current;

      if (
        previousStyles &&
        writtenStyles
      ) {
        for (
          const property of
          UI_MOTION_POLICY_CSS_VARIABLES
        ) {
          const previous =
            previousStyles.get(
              property
            );

          const written =
            writtenStyles.get(
              property
            );

          if (
            !previous ||
            !written
          ) {
            continue;
          }

          const current =
            readMotionStyleSnapshot(
              ownedRoot,
              property
            );

          if (
            !motionStyleSnapshotsMatch(
              current,
              written
            )
          ) {
            continue;
          }

          restoreMotionStyleSnapshot(
            ownedRoot,
            property,
            previous
          );
        }
      }

      motionDocumentOwners.delete(
        ownedDocument
      );

      ownedDocumentRef.current = null;
      previousAttributesRef.current = null;
      writtenAttributesRef.current = null;
      previousStylesRef.current = null;
      writtenStylesRef.current = null;
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

    const root =
      ownedDocument.documentElement;

    writeMotionDocumentAttributes(
      root,
      values
    );

    writeMotionCSSProjection(
      root
    );

    writtenAttributesRef.current =
      values;

    writtenStylesRef.current =
      readMotionStyleSnapshots(
        root
      );
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
