// src/patterns/scaffold/adaptive-scaffold/routedAdaptiveScaffold.types.ts

import type {
    AdaptiveScaffoldProps,
} from "./adaptiveScaffold.types";

import type {
    NavigationLinkMeta,
    NavigationNode,
} from "../../navigation";


export interface RoutedAdaptiveScaffoldProps
    extends Omit<
        AdaptiveScaffoldProps,
        "items" | "activeId" | "onActiveIdChange"
    > {

    items: NavigationNode<NavigationLinkMeta>[];

    activeId?: string | null;

    navigate?: (
        href: string,
        item: NavigationNode<NavigationLinkMeta>
    ) => void;

    onItemChange?: (
        item: NavigationNode<NavigationLinkMeta>
    ) => void;
}