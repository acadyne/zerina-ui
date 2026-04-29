import React from "react";
import { Box, type BoxProps } from "../../primitives/layout";

function cssSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export interface AppShellContentProps extends BoxProps<"main"> {
  children?: React.ReactNode;
  isMobile?: boolean;
  headerHeight?: number | string;
  mobileBarHeight?: number;
  sidebarWidth?: number | string;
}

export function AppShellContent({
  children,
  isMobile = false,
  headerHeight = 64,
  mobileBarHeight = 68,
  sidebarWidth = 0,
  style,
  ...rest
}: AppShellContentProps) {
  const resolvedHeaderHeight = cssSize(headerHeight);
  const resolvedSidebarWidth = cssSize(sidebarWidth);

  return (
    <Box
      as="main"
      {...rest}
      style={{
        minWidth: 0,
        minHeight: 0,
        height: isMobile
          ? `calc(100dvh - ${resolvedHeaderHeight} - ${mobileBarHeight}px - env(safe-area-inset-bottom))`
          : `calc(100dvh - ${resolvedHeaderHeight})`,
        marginLeft: isMobile ? 0 : resolvedSidebarWidth,
        padding: isMobile ? 0 : "0.85rem",
        overflow: "hidden",
        transition:
          "margin-left var(--ui-duration-slow) var(--ui-ease-emphasized), padding var(--ui-duration-normal) var(--ui-ease-standard)",
        boxSizing: "border-box",
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