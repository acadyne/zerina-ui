// src/patterns/app-shell/useAppShellState.ts
import React from "react";
import { useOptionalUIViewport } from "../../core/viewport";
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

  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (
    id: string | null
  ) => void;
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

  activeId: string | null;
  setActiveId: (
    id: string | null
  ) => void;
}

function resolveIsMobile(options: {
  mobileMode: AppShellMobileMode;
  viewportIsMobile: boolean;
}): boolean {
  const { mobileMode, viewportIsMobile } = options;

  if (mobileMode === "mobile") return true;
  if (mobileMode === "desktop") return false;

  return viewportIsMobile;
}

export function useAppShellState(
  options: UseAppShellStateOptions = {}
): UseAppShellStateResult {
  const viewport = useOptionalUIViewport();

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

    activeId: controlledActiveId,
    defaultActiveId = null,
    onActiveIdChange,
  } = options;

  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed);

  const [internalMobileMode, setInternalMobileMode] =
    React.useState<AppShellMobileMode>(defaultMobileMode);

  const [internalOpenRouteIds, setInternalOpenRouteIds] =
    React.useState<string[]>(defaultOpenRouteIds);

  const [internalActiveId, setInternalActiveId] =
    React.useState<string | null>(
      defaultActiveId
    );

  const collapsed = controlledCollapsed ?? internalCollapsed;
  const mobileMode = controlledMobileMode ?? internalMobileMode;
  const openRouteIds = controlledOpenRouteIds ?? internalOpenRouteIds;
  const activeId =
    controlledActiveId ??
    internalActiveId;

  const isMobile = resolveIsMobile({
    mobileMode,
    viewportIsMobile: Boolean(viewport?.isMobile),
  });

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

  const setActiveId = React.useCallback(
    (
      next: string | null
    ) => {
      if (controlledActiveId === undefined) {
        setInternalActiveId(next);
      }

      onActiveIdChange?.(next);
    },
    [
      controlledActiveId,
      onActiveIdChange,
    ]
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

    activeId,
    setActiveId,
  };
}