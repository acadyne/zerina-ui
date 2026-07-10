// src/patterns/scaffold/screen-state/screenState.types.ts
import React from "react";
import type { EmptyStateProps } from "../../../components/feedback/EmptyState";
import type {
  LoadingStateProps,
  LoadingStateVariant,
} from "../../../components/feedback/LoadingState";
import type { AlertProps } from "../../../components/feedback/Alert";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../../helpers/css";
import type {
  ScreenContentPadding,
  ScreenContentProps,
} from "../ScreenContent";

export type ScreenStateStatus = "loading" | "error" | "empty" | "success";

export type ScreenStateSlot =
  | "root"
  | "content"
  | "panel"
  | "loading"
  | "empty"
  | "error"
  | "success";

export type ScreenStateStyles = SlotStyleMap<ScreenStateSlot>;

export type ScreenStateSlotProps = SlotPropsMap<ScreenStateSlot>;

export interface ScreenStateRenderContext {
  status: ScreenStateStatus;
  loading: boolean;
  empty: boolean;
  error: unknown;
  retry?: () => void | Promise<void>;
}

export type ScreenStateRenderFn = (
  context: ScreenStateRenderContext
) => React.ReactNode;

export interface ScreenStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  children?: React.ReactNode | ScreenStateRenderFn;

  /**
   * Estado explícito.
   * Si se define, tiene prioridad sobre loading/error/empty.
   */
  status?: ScreenStateStatus;

  loading?: boolean;
  error?: unknown;
  empty?: boolean;

  onRetry?: () => void | Promise<void>;

  /**
   * Layout del estado.
   * El contenido success se retorna directo salvo que root/success necesiten
   * styles o slotProps.
   */
  padded?: boolean;
  padding?: ScreenContentPadding;
  centered?: boolean;
  fill?: boolean;
  scrollable?: boolean;

  screenContentProps?: Omit<
    ScreenContentProps,
    "children" | "padded" | "padding" | "centered" | "fill" | "scrollable"
  >;

  loadingTitle?: React.ReactNode;
  loadingDescription?: React.ReactNode;
  loadingLabel?: React.ReactNode;
  loadingVariant?: LoadingStateVariant;
  loadingRows?: number;
  loadingColumns?: number;
  loadingLines?: number;
  loadingStateProps?: Omit<
    LoadingStateProps,
    | "children"
    | "loading"
    | "label"
    | "variant"
    | "rows"
    | "columns"
    | "lines"
  >;

  emptyIcon?: React.ReactNode;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyActionLabel?: React.ReactNode;
  emptyAction?: React.ReactNode;
  emptyStateProps?: Omit<
    EmptyStateProps,
    | "icon"
    | "title"
    | "description"
    | "actionLabel"
    | "onAction"
    | "action"
  >;

  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  errorActionLabel?: React.ReactNode;
  errorAction?: React.ReactNode;
  errorVariant?: AlertProps["variant"];
  errorAlertProps?: Omit<
    AlertProps,
    "title" | "description" | "variant" | "action"
  >;

  renderLoading?: ScreenStateRenderFn;
  renderEmpty?: ScreenStateRenderFn;
  renderError?: ScreenStateRenderFn;
  renderSuccess?: ScreenStateRenderFn;

  className?: string;
  style?: React.CSSProperties;

  styles?: ScreenStateStyles;
  slotProps?: ScreenStateSlotProps;
}