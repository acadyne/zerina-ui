import type {
  AppShellProcessedRoute,
  AppShellRoute,
  AppShellRouteId,
} from "./AppShell.types";

export function normalizeAppShellPath(path: string): string {
  const raw = String(path ?? "").trim();

  if (!raw || raw === "/") {
    return "/";
  }

  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  const withoutTrailing = withSlash.replace(/\/+$/, "");

  return withoutTrailing || "/";
}

function createRouteId(
  route: AppShellRoute,
  parentIds: string[],
  index: number
): AppShellRouteId {
  if (route.id) {
    return route.id;
  }

  const safePath = normalizeAppShellPath(route.path)
    .replace(/^\/+/, "")
    .replace(/[^\w-]+/g, "-");

  const safeName = String(route.name ?? "route")
    .trim()
    .toLowerCase()
    .replace(/[^\w-]+/g, "-");

  return [...parentIds, safePath || safeName || `route-${index}`]
    .filter(Boolean)
    .join("__");
}

export function processAppShellRoutes(
  routes: AppShellRoute[],
  parentIds: string[] = [],
  depth = 0
): AppShellProcessedRoute[] {
  return routes.map((route, index) => {
    const id = createRouteId(route, parentIds, index);
    const path = normalizeAppShellPath(route.path);

    const processed: AppShellProcessedRoute = {
      ...route,
      id,
      path,
      fullPath: path,
      depth,
      parentIds,
      subroutes: route.subroutes
        ? processAppShellRoutes(route.subroutes, [...parentIds, id], depth + 1)
        : undefined,
    };

    return processed;
  });
}

export function flattenAppShellRoutes(
  routes: AppShellProcessedRoute[]
): AppShellProcessedRoute[] {
  return routes.flatMap((route) => [
    route,
    ...(route.subroutes ? flattenAppShellRoutes(route.subroutes) : []),
  ]);
}

export function getAppShellRouteId(route: AppShellProcessedRoute): string {
  return route.id;
}

export function getAppShellRouteChildren(
  route: AppShellProcessedRoute
): AppShellProcessedRoute[] {
  return route.subroutes ?? [];
}

export function appShellRouteHasChildren(
  route: AppShellProcessedRoute
): boolean {
  return getAppShellRouteChildren(route).length > 0;
}

export function appShellRouteHasRenderableContent(
  route: AppShellProcessedRoute
): boolean {
  return Boolean(route.component || route.element);
}

export function isAppShellRouteSelectable(
  route: AppShellProcessedRoute
): boolean {
  if (route.disabled || route.readonly) {
    return false;
  }

  if (appShellRouteHasRenderableContent(route)) {
    return true;
  }

  return !appShellRouteHasChildren(route);
}

export function findFirstRenderableRoute(
  routes: AppShellProcessedRoute[]
): AppShellProcessedRoute | null {
  const flat = flattenAppShellRoutes(routes);

  return (
    flat.find((route) => {
      return appShellRouteHasRenderableContent(route) && !route.disabled;
    }) ?? null
  );
}

export function findAppShellRouteById(
  routes: AppShellProcessedRoute[],
  id: string | null | undefined
): AppShellProcessedRoute | null {
  if (!id) return null;

  const flat = flattenAppShellRoutes(routes);
  return flat.find((route) => route.id === id) ?? null;
}

export function findAppShellRouteByPath(
  routes: AppShellProcessedRoute[],
  path: string | null | undefined
): AppShellProcessedRoute | null {
  if (!path) return null;

  const normalized = normalizeAppShellPath(path);
  const flat = flattenAppShellRoutes(routes);

  return (
    flat.find((route) => normalizeAppShellPath(route.path) === normalized) ??
    null
  );
}

export function isAppShellRouteActive(
  currentPath: string | null | undefined,
  route: AppShellProcessedRoute
): boolean {
  if (!currentPath) return false;

  const current = normalizeAppShellPath(currentPath);
  const target = normalizeAppShellPath(route.path);

  if (current === target) {
    return true;
  }

  if (target === "/") {
    return false;
  }

  return current.startsWith(`${target}/`);
}

export interface AppShellRouteContainsActiveOptions {
  activeRouteId?: string | null;
  activePath?: string | null;
}

export function appShellRouteContainsActive(
  route: AppShellProcessedRoute,
  options: AppShellRouteContainsActiveOptions
): boolean {
  const { activeRouteId, activePath } = options;

  if (activeRouteId && route.id === activeRouteId) {
    return true;
  }

  if (activePath && isAppShellRouteActive(activePath, route)) {
    return true;
  }

  return getAppShellRouteChildren(route).some((child) =>
    appShellRouteContainsActive(child, options)
  );
}

export function getOpenRouteIdsForActiveRoute(
  routes: AppShellProcessedRoute[],
  options: AppShellRouteContainsActiveOptions
): string[] {
  const openIds = new Set<string>();

  function walk(list: AppShellProcessedRoute[]): boolean {
    for (const route of list) {
      const selfActive = appShellRouteContainsActive(route, options);
      const childActive = getAppShellRouteChildren(route).some((child) =>
        walk([child])
      );

      if ((selfActive || childActive) && appShellRouteHasChildren(route)) {
        openIds.add(route.id);
      }

      if (selfActive || childActive) {
        return true;
      }
    }

    return false;
  }

  walk(routes);

  return Array.from(openIds);
}

export function getOpenRouteIdsForPath(
  routes: AppShellProcessedRoute[],
  currentPath: string | null | undefined
): string[] {
  return getOpenRouteIdsForActiveRoute(routes, {
    activePath: currentPath,
  });
}

export function toggleRouteId(ids: string[], id: string): string[] {
  return ids.includes(id)
    ? ids.filter((item) => item !== id)
    : [...ids, id];
}