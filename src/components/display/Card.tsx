// src/components/display/Card.tsx
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  type UIPressEvent,
} from "../../core/interaction";

import {
  usePressSlotBridge,
  type PressSlotEventHandlers,
} from "../../core/interaction/press/usePressSlotBridge";
import {
  shouldAnimateContinuousMotion,
  useOptionalUIMotion,
} from "../../core/motion";
import {
  interactiveStateRecipe,
  surfaceRecipe,
} from "../../theme/recipes";

import {
  resolveContextualSlot,
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type CardSlot =
  | "root"
  | "loading"
  | "loadingMedia"
  | "loadingContent"
  | "loadingLine"
  | "header"
  | "body"
  | "footer";

export type CardStyles = SlotStyleMap<CardSlot>;

export type CardSlotProps = SlotPropsMap<CardSlot>;

type CardContextValue = {
  styles?: CardStyles;
  slotProps?: CardSlotProps;
};

const CardContext = React.createContext<CardContextValue | null>(null);

function useOptionalCardContext() {
  return React.useContext(CardContext);
}

export interface CardProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "children"
    | "onClick"
    | "ref"
    | "style"
    | "initial"
    | "animate"
    | "exit"
    | "variants"
    | "transition"
    | "custom"
    | "whileTap"
    | "whileHover"
    | "whileFocus"
    | "whileDrag"
    | "whileInView"
  > {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  p?: React.CSSProperties["padding"];
  rounded?: React.CSSProperties["borderRadius"];
  shadow?: React.CSSProperties["boxShadow"];
  bordered?: boolean;

  loading?: boolean;
  loadingFallback?: React.ReactNode;
  loadingLines?: number;
  loadingAnimated?: boolean;

  onPress?: (event: UIPressEvent<HTMLDivElement>) => void;

  styles?: CardStyles;
  slotProps?: CardSlotProps;
}

function CardLoadingContent({
  lines = 3,
  animated = true,
  styles,
  slotProps,
}: {
  lines?: number;
  animated?: boolean;
  styles?: CardStyles;
  slotProps?: CardSlotProps;
}) {
  const shimmerStyle: React.CSSProperties = animated
    ? {
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(90deg, transparent, var(--ui-skeleton-highlight), transparent)",
      animation:
        "ui-skeleton-shimmer var(--ui-skeleton-duration) infinite",
    }
    : {};

  const blockBase: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    background: "var(--ui-skeleton-bg)",
  };

  const loadingSlot = resolveContextualSlot<CardSlot>({
    slot: "loading",
    styles,
    slotProps,
    baseProps: {
      "aria-hidden": true,
      "data-ui-card-loading": "",
    },
    baseStyle: {
      display: "flex",
      flexDirection: "column",
      gap: "0.85rem",
      width: "100%",
      minWidth: 0,
    },
  });

  const loadingMediaSlot = resolveSlot<CardSlot>({
    slot: "loadingMedia",
    styles,
    slotProps,
    baseStyle: {
      ...blockBase,
      width: 42,
      height: 42,
      minWidth: 42,
      borderRadius: "var(--ui-radius-full)",
    },
  });

  const loadingContentSlot = resolveSlot<CardSlot>({
    slot: "loadingContent",
    styles,
    slotProps,
    baseStyle: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
  });

  return (
    <div {...loadingSlot}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          minWidth: 0,
        }}
      >
        <div {...loadingMediaSlot}>
          {animated ? <div style={shimmerStyle} /> : null}
        </div>

        <div {...loadingContentSlot}>
          <div
            {...resolveSlot<CardSlot>({
              slot: "loadingLine",
              styles,
              slotProps,
              baseProps: {
                "data-ui-card-loading-line": "",
                "data-ui-card-loading-line-index": 0,
              },
              baseStyle: {
                ...blockBase,
                height: 10,
                width: "72%",
                borderRadius: "var(--ui-radius-sm)",
              },
            })}
          >
            {animated ? <div style={shimmerStyle} /> : null}
          </div>

          <div
            {...resolveSlot<CardSlot>({
              slot: "loadingLine",
              styles,
              slotProps,
              baseProps: {
                "data-ui-card-loading-line": "",
                "data-ui-card-loading-line-index": 1,
              },
              baseStyle: {
                ...blockBase,
                height: 10,
                width: "48%",
                borderRadius: "var(--ui-radius-sm)",
              },
            })}
          >
            {animated ? <div style={shimmerStyle} /> : null}
          </div>
        </div>
      </div>

      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          {...resolveSlot<CardSlot>({
            slot: "loadingLine",
            styles,
            slotProps,
            baseProps: {
              "data-ui-card-loading-line": "",
              "data-ui-card-loading-line-index": index + 2,
            },
            baseStyle: {
              ...blockBase,
              height: 10,
              width: index === lines - 1 ? "72%" : "100%",
              borderRadius: "var(--ui-radius-sm)",
            },
          })}
        >
          {animated ? <div style={shimmerStyle} /> : null}
        </div>
      ))}
    </div>
  );
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = "",
      style,
      p,
      rounded,
      shadow,
      bordered = true,
      loading = false,
      loadingFallback,
      loadingLines = 3,
      loadingAnimated = true,

      tabIndex,
      role,
      onPress,

      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,

      onFocus,
      onBlur,

      onKeyDown,
      onKeyUp,

      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();

    const animateLoading =
      loadingAnimated &&
      shouldAnimateContinuousMotion(
        motionState.effectiveLevel
      );

    const rootSlotProps =
      slotProps?.root;

    const isInteractive =
      onPress !==
      undefined;

    const isDisabled =
      isInteractive &&
      loading;

    const pressDisabled =
      !isInteractive ||
      isDisabled;


    const press =
      usePressSlotBridge<HTMLDivElement>({
        disabled:
          pressDisabled,

        nativeInteractive:
          false,

        onPress,

        publicHandlers: {
          onPointerEnter,
          onPointerLeave,
          onPointerDown,
          onPointerUp,
          onPointerCancel,
          onLostPointerCapture,

          onFocus,
          onBlur,

          onKeyDown,
          onKeyUp,
        },

        slotHandlers:
          rootSlotProps as
            | PressSlotEventHandlers<HTMLDivElement>
            | undefined,
      });

    const pressMotion = press.state.pressed
      ? motionState.getPressMotion(motionState.effectiveLevel)
      : undefined;

    const surface =
      surfaceRecipe({
        role: "surface",
        elevation: 1,
        shape: "lg",
        border: bordered
          ? "subtle"
          : "none",
      });

    const interaction =
      interactiveStateRecipe({
        tone:
          "neutral",

        emphasis:
          "surface",

        elevation:
          1,

        hoverElevation:
          3,

        pressedElevation:
          2,
      });


    const rootSlot = resolveSlot<CardSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-card": "",
        "data-ui-card-interactive": isInteractive || undefined,
        "data-ui-interactive": isInteractive || undefined,
        "data-ui-interactive-target": isInteractive || undefined,
        "data-ui-card-loading": loading || undefined,
        "data-ui-card-loading-animated":
          loading && animateLoading
            ? true
            : undefined,
        "data-disabled": isDisabled || undefined,
        "data-hovered": press.state.hovered || undefined,
        "data-pressed": press.state.pressed || undefined,
        "data-focused": press.state.focused || undefined,
        "data-focus-visible":
          press.state.focusVisible || undefined,
      },
      baseStyle: {
        ...(
          isInteractive
            ? interaction
            : surface
        ),

        ...(
          isInteractive
            ? {
                "--ui-interactive-border-color":
                  bordered
                    ? interaction[
                        "--ui-interactive-border-color"
                      ]
                    : "transparent",
              }
            : {}
        ),

        padding: p,

        borderWidth:
          isInteractive
            ? 1
            : undefined,

        borderStyle:
          isInteractive
            ? "solid"
            : undefined,

        borderRadius:
          rounded ??
          surface.borderRadius,

        boxShadow:
          shadow ??
          (
            isInteractive
              ? undefined
              : surface.boxShadow
          ),
      },
    });

    const contextValue = React.useMemo<CardContextValue>(
      () => ({
        styles,
        slotProps,
      }),
      [styles, slotProps]
    );

    return (
      <CardContext.Provider value={contextValue}>
        <motion.div
          {...rest}
          {...toMotionSlotProps(rootSlot)}
          {...press.pressProps}
          ref={ref}
          role={isInteractive ? role ?? "button" : role}
          tabIndex={
            isInteractive
              ? loading
                ? -1
                : tabIndex ?? 0
              : tabIndex
          }
          aria-disabled={isDisabled || undefined}
          aria-busy={loading || undefined}
          animate={
            pressMotion ?? {
              scale: 1,
              y: 0,
            }
          }
          transition={motionState.getTransition(
            motionState.effectiveLevel,
            "press"
          )}
        >
          {loading ? (
            loadingFallback ?? (
              <CardLoadingContent
                lines={loadingLines}
                animated={animateLoading}
                styles={styles}
                slotProps={slotProps}
              />
            )
          ) : (
            children
          )}
        </motion.div>
      </CardContext.Provider>
    );
  }
);

Card.displayName = "Card";

export interface CardSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  p?: React.CSSProperties["padding"];

  styles?: CardStyles;
  slotProps?: CardSlotProps;
}

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  CardSectionProps
>(
  (
    {
      children,
      className = "",
      style,
      p = "1rem",
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useOptionalCardContext();

    const headerSlot = resolveContextualSlot<CardSlot>({
      slot: "header",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,
      className,
      style,
      baseStyle: {
        padding: p,
        borderBottom: "1px solid var(--ui-border)",
      },
    });

    return (
      <div {...headerSlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardBody = React.forwardRef<
  HTMLDivElement,
  CardSectionProps
>(
  (
    {
      children,
      className = "",
      style,
      p = "1rem",
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useOptionalCardContext();

    const bodySlot = resolveContextualSlot<CardSlot>({
      slot: "body",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,
      className,
      style,
      baseStyle: {
        padding: p,
        minWidth: 0,
      },
    });

    return (
      <div {...bodySlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  CardSectionProps
>(
  (
    {
      children,
      className = "",
      style,
      p = "1rem",
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useOptionalCardContext();

    const footerSlot = resolveContextualSlot<CardSlot>({
      slot: "footer",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,
      className,
      style,
      baseStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        padding: p,
        borderTop: "1px solid var(--ui-border)",
        gap: "0.75rem",
      },
    });

    return (
      <div {...footerSlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";