// src/components/navigation-menu/navigationMenu.utils.ts
import type {
  NavigationMenuItemId,
} from "./navigationMenu.types";

export function createNavigationMenuOpenPath(
  values?: readonly NavigationMenuItemId[]
): NavigationMenuItemId[] {
  return values ? [...values] : [];
}

export function setNavigationMenuOpenItemAtDepth(
  openPath: readonly NavigationMenuItemId[],
  depth: number,
  itemId: NavigationMenuItemId
): NavigationMenuItemId[] {
  const safeDepth = Math.max(0, depth);
  const nextPath = openPath.slice(0, safeDepth);

  nextPath[safeDepth] = itemId;

  return nextPath;
}

export function closeNavigationMenuFromDepth(
  openPath: readonly NavigationMenuItemId[],
  depth: number
): NavigationMenuItemId[] {
  const safeDepth = Math.max(0, depth);

  return openPath.slice(0, safeDepth);
}

export function closeNavigationMenuAfterDepth(
  openPath: readonly NavigationMenuItemId[],
  depth: number
): NavigationMenuItemId[] {
  const safeDepth = Math.max(0, depth);

  return openPath.slice(0, safeDepth + 1);
}

export function getNavigationMenuErrorMessage(
  error: unknown,
  fallback = "No se pudieron cargar las opciones."
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "string" &&
    error.trim()
  ) {
    return error;
  }

  return fallback;
}