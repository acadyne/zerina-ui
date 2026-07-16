import React from "react";
import type {
  AppShellCommonProps,
  AppShellProcessedRoute,
  AppShellRouteRenderer,
} from "./AppShell.types";
import {
  findAppShellRouteById,
  findFirstRenderableRoute,
  processAppShellRoutes,
} from "./AppShellRouteUtils";
import { AppShell } from "./AppShell";

export interface UncontrolledAppShellProps extends AppShellCommonProps {
  defaultRouteId?: string;
  renderRoute?: AppShellRouteRenderer;
  fallback?: React.ReactNode;
}

function renderRouteContent(route: AppShellProcessedRoute): React.ReactNode {
  if (route.element) {
    return route.element;
  }

  if (route.component) {
    const Component = route.component;
    return <Component />;
  }

  return null;
}

export function UncontrolledAppShell({
  routes,
  defaultRouteId,
  renderRoute,
  fallback,
  activeRouteId: controlledActiveRouteId,
  ...rest
}: UncontrolledAppShellProps) {
  const processedRoutes = React.useMemo(
    () => processAppShellRoutes(routes),
    [routes]
  );

  const firstRoute = React.useMemo(
    () => findFirstRenderableRoute(processedRoutes),
    [processedRoutes]
  );

  const [internalActiveRouteId, setInternalActiveRouteId] = React.useState<
    string | null
  >(() => defaultRouteId ?? firstRoute?.id ?? null);

  React.useEffect(() => {
    if (controlledActiveRouteId !== undefined) {
      return;
    }

    const internalRoute =
      findAppShellRouteById(
        processedRoutes,
        internalActiveRouteId
      );

    const nextActiveRouteId =
      internalRoute?.id ??
      firstRoute?.id ??
      null;

    if (
      nextActiveRouteId !==
      internalActiveRouteId
    ) {
      setInternalActiveRouteId(
        nextActiveRouteId
      );
    }
  }, [
    controlledActiveRouteId,
    firstRoute?.id,
    internalActiveRouteId,
    processedRoutes,
  ]);

  const activeRouteId = controlledActiveRouteId ?? internalActiveRouteId;

  const activeRoute = React.useMemo(() => {
    return findAppShellRouteById(processedRoutes, activeRouteId) ?? firstRoute;
  }, [activeRouteId, firstRoute, processedRoutes]);

  const activePath = activeRoute?.path ?? "/";

  const handleNavigate = React.useCallback((route: AppShellProcessedRoute) => {
    if (!route.component && !route.element) return;
    setInternalActiveRouteId(route.id);
  }, []);

  const content = activeRoute
    ? renderRoute
      ? renderRoute({ route: activeRoute, activePath })
      : renderRouteContent(activeRoute)
    : fallback;

  return (
    <AppShell
      {...rest}
      routes={routes}
      activePath={activePath}
      activeRouteId={activeRoute?.id ?? null}
      onNavigate={handleNavigate}
    >
      {content ?? fallback ?? null}
    </AppShell>
  );
}

UncontrolledAppShell.displayName = "UncontrolledAppShell";