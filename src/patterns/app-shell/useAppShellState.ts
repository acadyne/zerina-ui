import React from "react";
import { useOptionalUILayout } from "../../core/layout";
import type { AppShellMobileMode } from "./AppShell.types";

export interface UseAppShellStateOptions {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;

  mobileMode?: AppShellMobileMode;
  defaultMobileMode?: AppShellMobileMode;
  onMobileModeChange?: (mode: AppShellMobileMode) => void;

  openRouteIds?: string[];
  defaultOpenRouteIds?: string[];
  onOpenRouteIdsChange?: (ids: string[]) => void;

  activeRouteId?: string | null;
  defaultActiveRouteId?: string | null;
  onActiveRouteIdChange?: (id: string | null) => void;
}

export interface UseAppShellStateResult {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;

  mobileMode: AppShellMobileMode;
  setMobileMode: (mode: AppShellMobileMode) => void;
  toggleMobileMode: () => void;

  isMobile: boolean;

  openRouteIds: string[];
  setOpenRouteIds: (ids: string[]) => void;
  toggleOpenRouteId: (id: string) => void;

  activeRouteId: string | null;
  setActiveRouteId: (id: string | null) => void;
}

export function useAppShellState(
  options: UseAppShellStateOptions = {}
): UseAppShellStateResult {
  const layout = useOptionalUILayout();

  const {
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onCollapsedChange,

    mobileMode: controlledMobileMode,
    defaultMobileMode = "auto",
    onMobileModeChange,

    openRouteIds: controlledOpenRouteIds,
    defaultOpenRouteIds = [],
    onOpenRouteIdsChange,

    activeRouteId: controlledActiveRouteId,
    defaultActiveRouteId = null,
    onActiveRouteIdChange,
  } = options;

  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed);

  const [internalMobileMode, setInternalMobileMode] =
    React.useState<AppShellMobileMode>(defaultMobileMode);

  const [internalOpenRouteIds, setInternalOpenRouteIds] =
    React.useState<string[]>(defaultOpenRouteIds);

  const [internalActiveRouteId, setInternalActiveRouteId] =
    React.useState<string | null>(defaultActiveRouteId);

  const collapsed = controlledCollapsed ?? internalCollapsed;
  const mobileMode = controlledMobileMode ?? internalMobileMode;
  const openRouteIds = controlledOpenRouteIds ?? internalOpenRouteIds;
  const activeRouteId = controlledActiveRouteId ?? internalActiveRouteId;

  const isMobile =
    mobileMode === "mobile"
      ? true
      : mobileMode === "desktop"
        ? false
        : Boolean(layout?.isMobile);

  const setCollapsed = React.useCallback(
    (next: boolean) => {
      if (controlledCollapsed === undefined) {
        setInternalCollapsed(next);
      }

      onCollapsedChange?.(next);
    },
    [controlledCollapsed, onCollapsedChange]
  );

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const setMobileMode = React.useCallback(
    (next: AppShellMobileMode) => {
      if (controlledMobileMode === undefined) {
        setInternalMobileMode(next);
      }

      onMobileModeChange?.(next);
    },
    [controlledMobileMode, onMobileModeChange]
  );

  const toggleMobileMode = React.useCallback(() => {
    setMobileMode(isMobile ? "desktop" : "mobile");
  }, [isMobile, setMobileMode]);

  const setOpenRouteIds = React.useCallback(
    (next: string[]) => {
      if (controlledOpenRouteIds === undefined) {
        setInternalOpenRouteIds(next);
      }

      onOpenRouteIdsChange?.(next);
    },
    [controlledOpenRouteIds, onOpenRouteIdsChange]
  );

  const toggleOpenRouteId = React.useCallback(
    (id: string) => {
      const next = openRouteIds.includes(id)
        ? openRouteIds.filter((item) => item !== id)
        : [...openRouteIds, id];

      setOpenRouteIds(next);
    },
    [openRouteIds, setOpenRouteIds]
  );

  const setActiveRouteId = React.useCallback(
    (next: string | null) => {
      if (controlledActiveRouteId === undefined) {
        setInternalActiveRouteId(next);
      }

      onActiveRouteIdChange?.(next);
    },
    [controlledActiveRouteId, onActiveRouteIdChange]
  );

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed,

    mobileMode,
    setMobileMode,
    toggleMobileMode,

    isMobile,

    openRouteIds,
    setOpenRouteIds,
    toggleOpenRouteId,

    activeRouteId,
    setActiveRouteId,
  };
}