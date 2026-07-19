import React from "react";

import type {
    AdaptiveScaffoldProps,
} from "./adaptiveScaffold.types";


export interface AdaptiveScaffoldRoute {
    id?: string;

    path: string;

    label: React.ReactNode;

    icon?: React.ReactNode;

    badge?: React.ReactNode;

    disabled?: boolean;

    children?: AdaptiveScaffoldRoute[];

    meta?: Record<string, unknown>;
}


export interface RoutedAdaptiveScaffoldProps
    extends Omit<
        AdaptiveScaffoldProps,
        "items" | "activeId" | "onActiveIdChange"
    > {

    routes: AdaptiveScaffoldRoute[];

    activePath?: string;

    navigate?: (
        path: string,
        route: AdaptiveScaffoldRoute
    ) => void;

    onRouteChange?: (
        route: AdaptiveScaffoldRoute
    ) => void;
}