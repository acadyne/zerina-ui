import React from "react";

import {
    AdaptiveScaffold,
} from "./AdaptiveScaffold";

import type {
    RoutedAdaptiveScaffoldProps,
} from "./routedAdaptiveScaffold.types";

import type {
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


                const path =
                    typeof item.meta === "object" &&
                    item.meta !== null &&
                    "path" in item.meta
                        ? String(item.meta.path)
                        : undefined;


                if (path) {
                    navigate?.(
                        path,
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