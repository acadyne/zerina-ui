import type {
    NavigationNode,
} from "../../navigation";

import type {
    AdaptiveScaffoldRoute,
} from "./routedAdaptiveScaffold.types";


export function normalizeAdaptiveRoutePath(
    path: string
): string {
    const value =
        path.trim();

    if (!value || value === "/") {
        return "/";
    }

    return value.startsWith("/")
        ? value.replace(/\/+$/, "")
        : `/${value}`.replace(/\/+$/, "");
}


export function routeToNavigationNode(
    route: AdaptiveScaffoldRoute
): NavigationNode {

    return {
        id:
            route.id ??
            normalizeAdaptiveRoutePath(route.path),

        label:
            route.label,

        icon:
            route.icon,

        badge:
            route.badge,

        disabled:
            route.disabled,

        children:
            route.children?.map(
                routeToNavigationNode
            ),

        meta: {
            route,
        },
    };
}


export function findRouteByPath(
    routes: AdaptiveScaffoldRoute[],
    path?: string
): AdaptiveScaffoldRoute | null {

    if (!path) {
        return null;
    }

    const target =
        normalizeAdaptiveRoutePath(path);

    for (const route of routes) {

        if (
            normalizeAdaptiveRoutePath(route.path) === target
        ) {
            return route;
        }

        const child =
            findRouteByPath(
                route.children ?? [],
                target
            );

        if (child) {
            return child;
        }
    }

    return null;
}

export function flattenAdaptiveRoutes(
    routes: AdaptiveScaffoldRoute[]
): AdaptiveScaffoldRoute[] {
    return routes.flatMap((route) => [
        route,
        ...(route.children
            ? flattenAdaptiveRoutes(route.children)
            : []),
    ]);
}

export function findRouteById(
    routes: AdaptiveScaffoldRoute[],
    id: string
): AdaptiveScaffoldRoute | null {
    return (
        flattenAdaptiveRoutes(routes)
            .find(
                (route) =>
                    (route.id ?? route.path) === id
            )
        ?? null
    );
}