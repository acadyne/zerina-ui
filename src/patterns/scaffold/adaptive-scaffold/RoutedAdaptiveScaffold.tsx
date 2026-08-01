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


export const RoutedAdaptiveScaffold =
  React.forwardRef<
    HTMLDivElement,
    RoutedAdaptiveScaffoldProps
  >(
    (
      {
        items,

        activeId,

        navigate,

        onItemChange,

        ...props
      },
      ref
    ) => {
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

          ref={ref}

          items={items}

          activeId={activeId}

          onActiveIdChange={
            handleChange
          }
        />
      );
    }
  );

RoutedAdaptiveScaffold.displayName =
  "RoutedAdaptiveScaffold";
