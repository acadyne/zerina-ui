// src/patterns/app-shell/index.ts

export { AppShell } from "./AppShell";
export type { AppShellProps } from "./AppShell";

export { AppShellHeader } from "./AppShellHeader";
export type { AppShellHeaderProps } from "./AppShellHeader";

export { AppShellSidebar } from "./AppShellSidebar";
export type { AppShellSidebarProps } from "./AppShellSidebar";

export { AppShellMobileBar } from "./AppShellMobileBar";
export type { AppShellMobileBarProps } from "./AppShellMobileBar";

export { AppShellContent } from "./AppShellContent";
export type { AppShellContentProps } from "./AppShellContent";

export * from "./AppShell.types";

export { useAppShellState } from "./useAppShellState";
export type {
  UseAppShellStateOptions,
  UseAppShellStateResult,
} from "./useAppShellState";

export * from "./AppShellRouteUtils";

export { UncontrolledAppShell } from "./UncontrolledAppShell";
export type { UncontrolledAppShellProps } from "./UncontrolledAppShell";

export { RoutedAppShell } from "./RoutedAppShell";
export type { RoutedAppShellProps } from "./RoutedAppShell";