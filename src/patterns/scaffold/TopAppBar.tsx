// src/patterns/scaffold/TopAppBar.tsx
import React from "react";
import { Box, Flex } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";

export type TopAppBarSize = "sm" | "md" | "lg";
export type TopAppBarVariant = "solid" | "transparent" | "blur";

export interface TopAppBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;

  leading?: React.ReactNode;
  actions?: React.ReactNode;

  /**
   * Zona central custom.
   * Si se define, reemplaza title/subtitle.
   */
  center?: React.ReactNode;

  size?: TopAppBarSize;
  variant?: TopAppBarVariant;

  /**
   * Aplica safe-area-top directamente sobre la barra.
   */
  safeAreaTop?: boolean;

  /**
   * Mantiene la barra pegada arriba dentro de su scroll/container.
   */
  sticky?: boolean;

  /**
   * Centra visualmente title/subtitle ignorando el ancho desigual
   * entre leading y actions.
   */
  centerTitle?: boolean;

  className?: string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

const TOP_APP_BAR_SIZE_MAP: Record<
  TopAppBarSize,
  {
    minHeight: number;
    paddingInline: string;
    titleSize: "sm" | "md" | "lg";
    subtitleSize: "xs" | "sm";
  }
> = {
  sm: {
    minHeight: 48,
    paddingInline: "0.65rem",
    titleSize: "sm",
    subtitleSize: "xs",
  },
  md: {
    minHeight: 56,
    paddingInline: "0.85rem",
    titleSize: "md",
    subtitleSize: "xs",
  },
  lg: {
    minHeight: 68,
    paddingInline: "1rem",
    titleSize: "lg",
    subtitleSize: "sm",
  },
};

function getVariantStyles(
  variant: TopAppBarVariant
): Pick<
  React.CSSProperties,
  "background" | "borderBottom" | "backdropFilter" | "WebkitBackdropFilter"
> {
  if (variant === "transparent") {
    return {
      background: "transparent",
      borderBottom: "1px solid transparent",
    };
  }

  if (variant === "blur") {
    return {
      background: "color-mix(in srgb, var(--ui-surface) 88%, transparent)",
      borderBottom: "1px solid var(--ui-border)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    };
  }

  return {
    background: "var(--ui-surface)",
    borderBottom: "1px solid var(--ui-border)",
  };
}

export function TopAppBar({
  title,
  subtitle,
  leading,
  actions,
  center,

  size = "md",
  variant = "blur",
  safeAreaTop = false,
  sticky = false,
  centerTitle = false,

  className = "",
  style,
  contentStyle,
  ...rest
}: TopAppBarProps) {
  const sizeStyles = TOP_APP_BAR_SIZE_MAP[size];

  const titleContent = center ?? (
    <Box
      style={{
        minWidth: 0,
        textAlign: centerTitle ? "center" : "left",
      }}
    >
      {title ? (
        <Typography
          as="div"
          size={sizeStyles.titleSize}
          weight={800}
          leading={1.2}
          style={{
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "var(--ui-text)",
          }}
        >
          {title}
        </Typography>
      ) : null}

      {subtitle ? (
        <Typography
          as="div"
          size={sizeStyles.subtitleSize}
          color="var(--ui-text-muted)"
          leading={1.25}
          style={{
            marginTop: "0.12rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );

  return (
    <Box
      as="header"
      className={className}
      data-ui-top-app-bar=""
      data-ui-top-app-bar-size={size}
      data-ui-top-app-bar-variant={variant}
      {...rest}
      style={{
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : undefined,
        zIndex: sticky ? 20 : undefined,
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        paddingTop: safeAreaTop ? "var(--safe-top-offset)" : undefined,
        ...getVariantStyles(variant),
        color: "var(--ui-text)",
        ...style,
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap="0.75rem"
        style={{
          position: "relative",
          minWidth: 0,
          minHeight: sizeStyles.minHeight,
          paddingInline: sizeStyles.paddingInline,
          boxSizing: "border-box",
          ...contentStyle,
        }}
      >
        <Flex
          align="center"
          gap="0.55rem"
          style={{
            minWidth: 0,
            flex: centerTitle ? "0 0 auto" : "1 1 0",
            maxWidth: centerTitle ? "34%" : undefined,
            position: "relative",
            zIndex: 2,
          }}
        >
          {leading ? (
            <Box
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {leading}
            </Box>
          ) : null}

          {!centerTitle ? titleContent : null}
        </Flex>

        {centerTitle ? (
          <Box
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(52vw, 420px)",
              minWidth: 0,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <Box
              style={{
                minWidth: 0,
                pointerEvents: "auto",
              }}
            >
              {titleContent}
            </Box>
          </Box>
        ) : null}

        <Flex
          align="center"
          justify="flex-end"
          gap="0.35rem"
          style={{
            minWidth: 0,
            flex: centerTitle ? "0 0 auto" : "0 0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          {actions}
        </Flex>
      </Flex>
    </Box>
  );
}

TopAppBar.displayName = "TopAppBar";