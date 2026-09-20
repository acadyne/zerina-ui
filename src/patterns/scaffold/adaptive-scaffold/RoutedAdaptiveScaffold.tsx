// src/patterns/scaffold/adaptive-scaffold/RoutedAdaptiveScaffold.tsx
import React from "react";

import type {
  NavigationLinkMeta,
  NavigationNode,
} from "../../navigation";

import {
  AdaptiveScaffold,
} from "./AdaptiveScaffold";

import type {
  RoutedAdaptiveScaffoldProps,
} from "./routedAdaptiveScaffold.types";


function RoutedAdaptiveScaffoldImpl<
  TMeta extends NavigationLinkMeta =
    NavigationLinkMeta,
>(
  {
    items,
    activeId,
    navigate,
    onItemChange,
    ...props
  }: RoutedAdaptiveScaffoldProps<TMeta>,
  ref:
    React.ForwardedRef<HTMLDivElement>
) {
  const handleChange =
    React.useCallback(
      (
        _id: string,
        item:
          NavigationNode<TMeta>
      ) => {
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
        navigate,
        onItemChange,
      ]
    );

  return (
    <AdaptiveScaffold<TMeta>
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


type RoutedAdaptiveScaffoldComponent =
  <
    TMeta extends NavigationLinkMeta =
      NavigationLinkMeta,
  >(
    props:
      RoutedAdaptiveScaffoldProps<TMeta> &
      React.RefAttributes<HTMLDivElement>
  ) =>
    React.ReactElement |
    null;


const RoutedAdaptiveScaffoldWithRef =
  React.forwardRef(
    RoutedAdaptiveScaffoldImpl,
  ) as unknown as
    RoutedAdaptiveScaffoldComponent & {
      displayName?:
        string;
    };


RoutedAdaptiveScaffoldWithRef.displayName =
  "RoutedAdaptiveScaffold";


export const RoutedAdaptiveScaffold =
  RoutedAdaptiveScaffoldWithRef;
