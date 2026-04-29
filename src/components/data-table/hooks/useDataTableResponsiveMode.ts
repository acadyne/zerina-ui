// src/components/data-table/hooks/useDataTableResponsiveMode.ts
import { useMemo } from "react";
import { useMediaQuery, useOptionalUILayout } from "../../../core/layout";
import type { DataTableMobileMode } from "../dataTable.types";

export interface UseDataTableResponsiveModeOptions {
  mobileMode?: DataTableMobileMode;
  mobileBreakpoint?: number;
}

export function useDataTableResponsiveMode({
  mobileMode = "inherit",
  mobileBreakpoint,
}: UseDataTableResponsiveModeOptions): boolean {
  const layout = useOptionalUILayout();

  const resolvedBreakpoint =
    mobileBreakpoint ?? layout?.mobileBreakpoint ?? 720;

  const query = useMemo(() => {
    return `(max-width: ${Math.max(0, resolvedBreakpoint - 0.02)}px)`;
  }, [resolvedBreakpoint]);

  const matchesMobile = useMediaQuery(query, mobileMode === "always");

  if (mobileMode === "always") return true;
  if (mobileMode === "never") return false;
  if (mobileMode === "auto") return matchesMobile;

  if (layout) {
    return layout.isMobile;
  }

  return matchesMobile;
}