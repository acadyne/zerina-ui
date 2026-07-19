import type {
    AdaptiveScaffoldProps,
} from "./adaptiveScaffold.types";

import type {
    NavigationNode,
} from "../../navigation";


export interface RoutedAdaptiveScaffoldProps
    extends Omit<
        AdaptiveScaffoldProps,
        "items" | "activeId" | "onActiveIdChange"
    > {

    items: NavigationNode[];

    activeId?: string | null;

    navigate?: (
        path: string,
        item: NavigationNode
    ) => void;

    onItemChange?: (
        item: NavigationNode
    ) => void;
}