// src/patterns/app-shell/AppShellContent.tsx
import React from "react";
import { Box, type BoxProps } from "../../primitives/layout";
import type { AppShellViewport } from "./AppShell.types";

function cssSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export interface AppShellContentProps extends BoxProps<"main"> {
  children?: React.ReactNode;
  viewport?: AppShellViewport;
  isMobile?: boolean;
  headerHeight?: number | string;
  mobileBarHeight?: number;
  sidebarWidth?: number | string;
}

export function AppShellContent({
  children,
  viewport = "window",
  isMobile = false,
  headerHeight = 64,
  mobileBarHeight = 68,
  sidebarWidth = 0,
  style,
  ...rest
}: AppShellContentProps) {
  const isContained = viewport === "contained";

  const resolvedHeaderHeight = cssSize(headerHeight);
  const resolvedSidebarWidth = cssSize(sidebarWidth);

  return (
    <Box
      as="main"
      {...rest}
      style={{
        minWidth: 0,
        minHeight: 0,
        boxSizing: "border-box",
        overflow: "hidden",

        position: isContained ? "absolute" : undefined,
        top: isContained ? resolvedHeaderHeight : undefined,
        left: isContained
          ? isMobile
            ? 0
            : resolvedSidebarWidth
          : undefined,
        right: isContained ? 0 : undefined,
        bottom: isContained
          ? isMobile
            ? `calc(${mobileBarHeight}px + env(safe-area-inset-bottom))`
            : 0
          : undefined,

        height: isContained
          ? undefined
          : isMobile
            ? `calc(100dvh - ${resolvedHeaderHeight} - ${mobileBarHeight}px - env(safe-area-inset-bottom))`
            : `calc(100dvh - ${resolvedHeaderHeight})`,

        marginLeft: isContained ? 0 : isMobile ? 0 : resolvedSidebarWidth,
        padding: isMobile ? 0 : "0.85rem",

        transition:
          "left var(--ui-duration-slow) var(--ui-ease-emphasized), margin-left var(--ui-duration-slow) var(--ui-ease-emphasized), padding var(--ui-duration-normal) var(--ui-ease-standard)",
        ...style,
      }}
    >
      <Box
        style={{
          width: "100%",
          height: "100%",
          minHeight: 0,
          minWidth: 0,
          overflow: "auto",
          borderRadius: isMobile ? 0 : "var(--ui-radius-xl)",
          border: isMobile ? "none" : "1px solid var(--ui-border)",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface-2) 54%, transparent), var(--ui-surface))",
          boxShadow: isMobile ? "none" : "var(--ui-shadow-sm)",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

AppShellContent.displayName = "AppShellContent";