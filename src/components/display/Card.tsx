// src/components/display/Card.tsx
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Box, Flex } from "../../primitives/layout";
import { useOptionalUIMotion } from "../../core/motion";

export interface CardProps
  extends Omit<HTMLMotionProps<"div">, "children" | "ref" | "style"> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  p?: React.CSSProperties["padding"];
  rounded?: React.CSSProperties["borderRadius"];
  shadow?: React.CSSProperties["boxShadow"];
  bordered?: boolean;
  interactive?: boolean;

  loading?: boolean;
  loadingFallback?: React.ReactNode;
  loadingLines?: number;
  loadingAnimated?: boolean;
}

function CardLoadingContent({
  lines = 3,
  animated = true,
}: {
  lines?: number;
  animated?: boolean;
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

  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        width: "100%",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          minWidth: 0,
        }}
      >
        <div
          style={{
            ...blockBase,
            width: 42,
            height: 42,
            minWidth: 42,
            borderRadius: "var(--ui-radius-full)",
          }}
        >
          {animated ? <div style={shimmerStyle} /> : null}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              ...blockBase,
              height: 10,
              width: "72%",
              borderRadius: "var(--ui-radius-sm)",
            }}
          >
            {animated ? <div style={shimmerStyle} /> : null}
          </div>

          <div
            style={{
              ...blockBase,
              height: 10,
              width: "48%",
              borderRadius: "var(--ui-radius-sm)",
            }}
          >
            {animated ? <div style={shimmerStyle} /> : null}
          </div>
        </div>
      </div>

      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          style={{
            ...blockBase,
            height: 10,
            width: index === lines - 1 ? "72%" : "100%",
            borderRadius: "var(--ui-radius-sm)",
          }}
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
      interactive = false,
      loading = false,
      loadingFallback,
      loadingLines = 3,
      loadingAnimated = true,
      tabIndex,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onMouseDown,
      onMouseUp,
      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();
    const pressMotion = motionState.getPressMotion(motionState.effectiveLevel);

    return (
      <motion.div
        ref={ref}
        className={className}
        tabIndex={interactive ? tabIndex ?? 0 : tabIndex}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        whileTap={interactive && pressMotion ? pressMotion : undefined}
        transition={motionState.getTransition(
          motionState.effectiveLevel,
          "press"
        )}
        style={{
          padding: p,
          borderRadius: rounded,
          boxShadow: shadow,
          minWidth: 0,
          background: "var(--ui-surface)",
          color: "var(--ui-text)",
          border: bordered
            ? "1px solid var(--ui-border)"
            : "1px solid transparent",
          transition:
            "box-shadow var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), background var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard)",
          cursor: interactive && !loading ? "pointer" : undefined,
          outline: "none",
          pointerEvents: loading ? "none" : undefined,
          ...style,
        }}
        onMouseEnter={(event) => {
          if (interactive && !loading) {
            event.currentTarget.style.borderColor = "var(--ui-border-strong)";
            event.currentTarget.style.boxShadow = "var(--ui-shadow-md)";
          }

          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          if (interactive && !loading) {
            event.currentTarget.style.borderColor = bordered
              ? "var(--ui-border)"
              : "transparent";
            event.currentTarget.style.boxShadow = String(shadow);
          }

          onMouseLeave?.(event);
        }}
        onFocus={(event) => {
          if (interactive && !loading) {
            event.currentTarget.style.boxShadow =
              "0 0 0 3px var(--ui-focus-ring)";
          }

          onFocus?.(event);
        }}
        onBlur={(event) => {
          if (interactive && !loading) {
            event.currentTarget.style.boxShadow = String(shadow);
          }

          onBlur?.(event);
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        {...rest}
      >
        {loading ? (
          loadingFallback ?? (
            <CardLoadingContent
              lines={loadingLines}
              animated={loadingAnimated}
            />
          )
        ) : (
          children
        )}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  p?: React.CSSProperties["padding"];
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ children, className = "", style, p = "1rem", ...rest }, ref) => {
    return (
      <Box
        ref={ref as any}
        className={className}
        p={p}
        style={{
          borderBottom: "1px solid var(--ui-border)",
          ...style,
        }}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardBody = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ children, className = "", style, p = "1rem", ...rest }, ref) => {
    return (
      <Box
        ref={ref as any}
        className={className}
        p={p}
        style={style}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);

CardBody.displayName = "CardBody";

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ children, className = "", style, p = "1rem", ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        className={className}
        p={p}
        justify="flex-end"
        align="center"
        wrap="wrap"
        style={{
          borderTop: "1px solid var(--ui-border)",
          gap: "0.75rem",
          ...style,
        }}
        {...rest}
      >
        {children}
      </Flex>
    );
  }
);

CardFooter.displayName = "CardFooter";