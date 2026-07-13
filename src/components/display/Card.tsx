// src/components/display/Card.tsx
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { usePress, type UIPressEvent } from "../../core/interaction";
import { composeEventHandlers } from "../../core/interaction/events/composeEventHandlers";
import { useOptionalUIMotion } from "../../core/motion";
import {
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
    "children" | "onClick" | "ref" | "style" | "whileTap"
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
        "linear-gradient(90deg, transparent, var(--ui-skeleton-highlight, rgba(255,255,255,0.08)), transparent)",
      animation:
        "ui-skeleton-shimmer var(--ui-skeleton-duration, 1.2s) infinite",
    }
    : {};

  const blockBase: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    background: "var(--ui-skeleton-bg, var(--ui-surface-3))",
  };

  const loadingSlot = resolveSlot<CardSlot>({
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
      rounded = "var(--ui-radius-lg)",
      shadow = "var(--ui-shadow-sm)",
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
    const rootSlotProps = slotProps?.root;

    const {
      onPointerEnter: slotOnPointerEnter,
      onPointerLeave: slotOnPointerLeave,
      onPointerDown: slotOnPointerDown,
      onPointerUp: slotOnPointerUp,
      onPointerCancel: slotOnPointerCancel,
      onLostPointerCapture: slotOnLostPointerCapture,
      onFocus: slotOnFocus,
      onBlur: slotOnBlur,
      onKeyDown: slotOnKeyDown,
      onKeyUp: slotOnKeyUp,
      onClick: slotOnClick,
    } = rootSlotProps ?? {};

    const isInteractive = onPress !== undefined;
    const isDisabled = loading || !isInteractive;

    const press = usePress<HTMLDivElement>({
      disabled: isDisabled,
      nativeInteractive: false,
      onPress,

      onPointerEnter: composeEventHandlers(
        onPointerEnter,
        slotOnPointerEnter
      ),

      onPointerLeave: composeEventHandlers(
        onPointerLeave,
        slotOnPointerLeave,
        {
          checkDefaultPrevented: false,
        }
      ),

      onPointerDown: composeEventHandlers(
        onPointerDown,
        slotOnPointerDown
      ),

      onPointerUp: composeEventHandlers(
        onPointerUp,
        slotOnPointerUp,
        {
          checkDefaultPrevented: false,
        }
      ),

      onPointerCancel: composeEventHandlers(
        onPointerCancel,
        slotOnPointerCancel,
        {
          checkDefaultPrevented: false,
        }
      ),

      onLostPointerCapture: composeEventHandlers(
        onLostPointerCapture,
        slotOnLostPointerCapture,
        {
          checkDefaultPrevented: false,
        }
      ),

      onFocus: composeEventHandlers(
        onFocus,
        slotOnFocus
      ),

      onBlur: composeEventHandlers(
        onBlur,
        slotOnBlur,
        {
          checkDefaultPrevented: false,
        }
      ),

      onKeyDown: composeEventHandlers(
        onKeyDown,
        slotOnKeyDown
      ),

      onKeyUp: composeEventHandlers(
        onKeyUp,
        slotOnKeyUp
      ),

      onClick: slotOnClick,
    });

    const pressMotion = press.state.pressed
      ? motionState.getPressMotion(motionState.effectiveLevel)
      : undefined;

    const rootSlot = resolveSlot<CardSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-card": "",
        "data-ui-card-interactive": isInteractive || undefined,
        "data-ui-card-loading": loading || undefined,
        "data-ui-card-disabled":
          isInteractive && loading ? true : undefined,
        "data-ui-card-hovered": press.state.hovered || undefined,
        "data-ui-card-pressed": press.state.pressed || undefined,
        "data-ui-card-focused": press.state.focused || undefined,
        "data-ui-card-focus-visible":
          press.state.focusVisible || undefined,
      },
      baseStyle: {
        padding: p,
        borderRadius: rounded,

        boxShadow: press.state.focusVisible
          ? "0 0 0 3px var(--ui-focus-ring)"
          : press.state.hovered && !isDisabled
            ? "var(--ui-shadow-md)"
            : shadow,

        minWidth: 0,
        background: "var(--ui-surface)",
        color: "var(--ui-text)",

        border: bordered
          ? `1px solid ${press.state.hovered && !isDisabled
            ? "var(--ui-border-strong)"
            : "var(--ui-border)"
          }`
          : "1px solid transparent",

        transition:
          "box-shadow var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), background var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard)",

        cursor: isInteractive
          ? loading
            ? "not-allowed"
            : "pointer"
          : undefined,

        outline: "none",
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
          aria-disabled={isInteractive && loading ? true : undefined}
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
                animated={loadingAnimated}
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

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  p?: React.CSSProperties["padding"];

  styles?: CardStyles;
  slotProps?: CardSlotProps;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
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

    const headerSlot = resolveSlot<CardSlot>({
      slot: "header",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
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

export const CardBody = React.forwardRef<HTMLDivElement, CardSectionProps>(
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

    const bodySlot = resolveSlot<CardSlot>({
      slot: "body",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
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

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
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

    const footerSlot = resolveSlot<CardSlot>({
      slot: "footer",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
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