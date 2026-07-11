// src/components/data-table/hooks/useDataTableResponsiveMode.ts
import { useMemo } from "react";
import { useMediaQuery } from "../../../core/dom";
import {
  DEFAULT_UI_VIEWPORT_BREAKPOINTS,
  useOptionalUIViewport,
} from "../../../core/viewport";
import type { DataTableMobileMode } from "../dataTable.types";

export interface UseDataTableResponsiveModeOptions {
  mobileMode?: DataTableMobileMode;

  /**
   * Override local para DataTable.
   *
   * Si no se pasa, usa viewport.breakpoints.tablet.
   */
  mobileBreakpoint?: number;
}

export function useDataTableResponsiveMode({
  mobileMode = "inherit",
  mobileBreakpoint,
}: UseDataTableResponsiveModeOptions): boolean {
  const viewport = useOptionalUIViewport();

  const resolvedBreakpoint =
    mobileBreakpoint ??
    viewport?.breakpoints.tablet ??
    DEFAULT_UI_VIEWPORT_BREAKPOINTS.tablet;

  const query = useMemo(() => {
    return `(max-width: ${Math.max(0, resolvedBreakpoint - 0.02)}px)`;
  }, [resolvedBreakpoint]);

  const matchesMobile = useMediaQuery(query, mobileMode === "always");

  if (mobileMode === "always") return true;
  if (mobileMode === "never") return false;
  if (mobileMode === "auto") return matchesMobile;

  if (viewport) {
    return viewport.isMobile;
  }

  return matchesMobile;
}