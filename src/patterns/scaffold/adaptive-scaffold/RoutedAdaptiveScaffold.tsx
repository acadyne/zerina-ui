// src/patterns/scaffold/adaptive-scaffold/RoutedAdaptiveScaffold.tsx
import React from "react";

import {
    AdaptiveScaffold,
} from "./AdaptiveScaffold";

import type {
    RoutedAdaptiveScaffoldProps,
} from "./routedAdaptiveScaffold.types";

import type {
    NavigationLinkMeta,
    NavigationNode,
} from "../../navigation";


export function RoutedAdaptiveScaffold({
    items,

    activeId,

    navigate,

    onItemChange,

    ...props

}: RoutedAdaptiveScaffoldProps) {

    const handleChange =
        React.useCallback(
            (
                id: string
            ) => {

                const item =
                    items.find(
                        (node) =>
                            node.id === id
                    );


                if (!item) {
                    return;
                }


                onItemChange?.(
                    item
                );


                const href =
                    item.meta?.href;


                if (href) {
                    navigate?.(
                        href,
                        item
                    );
                }
            },
            [
                items,
                navigate,
                onItemChange,
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