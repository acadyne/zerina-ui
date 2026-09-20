// src/patterns/index.ts

export type {
  ModalClosedState,
  ModalOpenState,
  ModalState,
} from "./state";

export { useModalState } from "./useModalState";
export type { UseModalStateResult } from "./useModalState";

export * from "./useConfirmModal";
export * from "./useFormDialogState";

export * from "./ConfirmDialog";
export * from "./FormDialog";
export * from "./ActionDialog";
export * from "./TargetFormDialog";

export type {
  TargetDialogRender,
  TargetDialogRenderProps,
} from "./shared/targetDialogContract";
export * from "./settings";
export * from "./actions";
export type {
  NavigationActiveBehavior,
  NavigationContentMeta,
  NavigationLinkMeta,
  NavigationNode,
  NavigationNodeId,
  NavigationPresentation,
  NavigationSide,
} from "./navigation/navigation.types";

export {
  NavigationPresenter,
} from "./navigation/NavigationPresenter";

export type {
  NavigationPresenterBottomProps,
  NavigationPresenterDrawerProps,
  NavigationPresenterListProps,
  NavigationPresenterProps,
  NavigationPresenterRailProps,
} from "./navigation/NavigationPresenter";

export type {
  NavigationCompactPolicy,
  NavigationCompactPresentation,
} from "./navigation/navigationProjection";
export * from "./navigation-stack";
export * from "./drawer-navigation";
export * from "./command";
export * from "./scaffold";
