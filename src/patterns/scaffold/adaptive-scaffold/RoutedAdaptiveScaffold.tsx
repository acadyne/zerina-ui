import React from "react";

import {
    AdaptiveScaffold,
} from "./AdaptiveScaffold";

import type {
    RoutedAdaptiveScaffoldProps,
} from "./routedAdaptiveScaffold.types";

import {
    findRouteById,
    findRouteByPath,
    routeToNavigationNode,
} from "./routedAdaptiveScaffold.utils";


export function RoutedAdaptiveScaffold({
    routes,

    activePath,

    navigate,

    onRouteChange,

    ...props

}: RoutedAdaptiveScaffoldProps) {

    const items =
        React.useMemo(
            () =>
                routes.map(
                    routeToNavigationNode
                ),
            [routes]
        );


    const activeRoute =
        React.useMemo(
            () =>
                findRouteByPath(
                    routes,
                    activePath
                ),
            [
                routes,
                activePath,
            ]
        );


    const activeId =
        activeRoute?.id ??
        activeRoute?.path ??
        null;


    const handleChange =
        React.useCallback(
            (
                id: string
            ) => {

                const route =
                    findRouteById(
                        routes,
                        id
                    );


                if (!route) {
                    return;
                }


                onRouteChange?.(
                    route
                );


                navigate?.(
                    route.path,
                    route
                );
            },
            [
                navigate,
                onRouteChange,
                routes,
            ]
        );


    return (
        <AdaptiveScaffold
            {...props}

            items={items}

            activeId={activeId}

            onActiveIdChange={
                handleChange
            }
        />
    );
}


RoutedAdaptiveScaffold.displayName =
    "RoutedAdaptiveScaffold";