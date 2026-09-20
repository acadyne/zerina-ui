// src/patterns/scaffold/adaptive-scaffold/routedAdaptiveScaffold.types.ts

import type {
  AdaptiveScaffoldProps,
} from "./adaptiveScaffold.types";

import type {
  NavigationLinkMeta,
  NavigationNode,
} from "../../navigation";


export interface RoutedAdaptiveScaffoldProps<
  TMeta extends NavigationLinkMeta =
    NavigationLinkMeta,
>
  extends Omit<
    AdaptiveScaffoldProps<TMeta>,
    | "items"
    | "activeId"
    | "onActiveIdChange"
  > {
  items:
    NavigationNode<TMeta>[];

  activeId?:
    string | null;

  navigate?:
    (
      href: string,
      item: NavigationNode<TMeta>
    ) => void;

  onItemChange?:
    (
      item: NavigationNode<TMeta>
    ) => void;
}
