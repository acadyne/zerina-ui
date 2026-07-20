// src/patterns/scaffold/adaptive-scaffold/RoutedAdaptiveScaffold.tsx
import React from "react";

import {
    findNavigationNode,
} from "../../navigation";

import {
    AdaptiveScaffold,
} from "./AdaptiveScaffold";

import type {
    RoutedAdaptiveScaffoldProps,
} from "./routedAdaptiveScaffold.types";


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
                    findNavigationNode(
                        items,
                        id
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