// src/patterns/scaffold/screen-state/ScreenState.tsx
import React from "react";
import {
  Alert,
  EmptyState,
  LoadingState,
} from "../../../components/feedback";
import {
  cx,
  mergeStyles,
  resolveMergedSlot,
  resolveSlot,
  type SlotElementProps,
} from "../../../helpers/css";
import { Button } from "../../../primitives/forms";
import { Box, Stack } from "../../../primitives/layout";
import { Typography } from "../../../primitives/typography";
import { ScreenContent } from "../ScreenContent";
import type {
  ScreenStateProps,
  ScreenStateRenderContext,
  ScreenStateSlot,
  ScreenStateSlotProps,
  ScreenStateStyles,
} from "./screenState.types";
import {
  createScreenStateContext,
  getScreenStateErrorMessage,
  resolveScreenStateStatus,
} from "./screenState.utils";

function renderSuccess({
  children,
  context,
}: {
  children: ScreenStateProps["children"];
  context: ScreenStateRenderContext;
}) {
  if (typeof children === "function") {
    return children(context);
  }

  return children ?? null;
}

function resolveScreenStatePanelSlot({
  status,
  styles,
  slotProps,
}: {
  status: Exclude<ScreenStateRenderContext["status"], "success">;
  styles?: ScreenStateStyles;
  slotProps?: ScreenStateSlotProps;
}): SlotElementProps {
  return resolveMergedSlot<ScreenStateSlot>({
    slots: ["panel", status],
    styles,
    slotProps,
    baseProps: {
      "data-ui-screen-state-panel": "",
      "data-ui-screen-state-panel-status": status,
      "data-ui-screen-state-loading": status === "loading" || undefined,
      "data-ui-screen-state-empty": status === "empty" || undefined,
      "data-ui-screen-state-error": status === "error" || undefined,
    },
    baseStyle: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minWidth: 0,
    },
  });
}

export const ScreenState = React.forwardRef<HTMLDivElement, ScreenStateProps>(
  (
    {
      children,

      status,
      loading = false,
      error,
      empty = false,

      onRetry,

      padded = true,
      padding = "comfortable",
      centered = true,
      fill = true,
      scrollable = false,

      screenContentProps,

      loadingTitle = "Cargando",
      loadingDescription,
      loadingLabel,
      loadingVariant = "spinner",
      loadingRows,
      loadingColumns,
      loadingLines,
      loadingStateProps,

      emptyIcon = "∅",
      emptyTitle = "Sin resultados",
      emptyDescription = "No hay elementos para mostrar.",
      emptyActionLabel,
      emptyAction,
      emptyStateProps,

      errorTitle = "Algo salió mal",
      errorDescription,
      errorActionLabel = "Reintentar",
      errorAction,
      errorVariant = "danger",
      errorAlertProps,

      renderLoading,
      renderEmpty,
      renderError,
      renderSuccess: renderSuccessProp,

      className = "",
      style,

      styles,
      slotProps,

      ...rest
    },
    ref
  ) => {
    const resolvedStatus = resolveScreenStateStatus({
      status,
      loading,
      error,
      empty,
    });

    const context = React.useMemo(
      () =>
        createScreenStateContext({
          status: resolvedStatus,
          loading,
          empty,
          error,
          retry: onRetry,
        }),
      [empty, error, loading, onRetry, resolvedStatus]
    );

    const {
      className: screenContentClassName,
      style: screenContentStyle,
      styles: screenContentStyles,
      slotProps: screenContentSlotProps,
      ...screenContentRest
    } = screenContentProps ?? {};

    if (resolvedStatus === "success") {
      const successNode = renderSuccessProp
        ? renderSuccessProp(context)
        : renderSuccess({ children, context });

      const rootSlot = resolveSlot<ScreenStateSlot>({
        slot: "root",
        styles,
        slotProps,
        className,
        style,
        baseProps: {
          "data-ui-screen-state": "",
          "data-ui-screen-state-status": "success",
        },
        baseStyle: {
          width: "100%",
          minWidth: 0,
          minHeight: 0,
        },
      });

      const successSlot = resolveSlot<ScreenStateSlot>({
        slot: "success",
        styles,
        slotProps,
        baseProps: {
          "data-ui-screen-state-success": "",
        },
      });

      const shouldWrapSuccess =
        Boolean(rootSlot.className) ||
        Boolean(successSlot.className) ||
        Boolean(rootSlot.style && Object.keys(rootSlot.style).length > 0) ||
        Boolean(successSlot.style && Object.keys(successSlot.style).length > 0) ||
        Object.keys(rest).length > 0;

      if (!shouldWrapSuccess) {
        return <>{successNode}</>;
      }

      return (
        <Box
          ref={ref}
          {...rootSlot}
          {...successSlot}
          {...rest}
          className={cx(rootSlot.className, successSlot.className)}
          style={mergeStyles(rootSlot.style, successSlot.style)}
        >
          {successNode}
        </Box>
      );
    }

    const retryAction =
      errorAction ??
      (onRetry ? (
        <Button size="sm" variant="outline" onPress={() => void onRetry()}>
          {errorActionLabel}
        </Button>
      ) : null);

    const stateNode =
      resolvedStatus === "loading" ? (
        renderLoading ? (
          renderLoading(context)
        ) : (
          <Stack align="center" spacing="0.75rem">
            <LoadingState
              loading
              variant={loadingVariant}
              label={loadingLabel ?? loadingTitle}
              rows={loadingRows}
              columns={loadingColumns}
              lines={loadingLines}
              {...loadingStateProps}
            />

            {loadingDescription ? (
              <Typography
                size="sm"
                color="var(--ui-text-muted)"
                align="center"
                style={{
                  maxWidth: 520,
                  margin: 0,
                }}
              >
                {loadingDescription}
              </Typography>
            ) : null}
          </Stack>
        )
      ) : resolvedStatus === "error" ? (
        renderError ? (
          renderError(context)
        ) : (
          <Box
            style={{
              width: "min(100%, 560px)",
            }}
          >
            <Alert
              variant={errorVariant}
              title={errorTitle}
              description={
                errorDescription ?? getScreenStateErrorMessage(error)
              }
              action={retryAction}
              {...errorAlertProps}
            />
          </Box>
        )
      ) : renderEmpty ? (
        renderEmpty(context)
      ) : (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onRetry}
          action={emptyAction}
          {...emptyStateProps}
        />
      );

    const rootSlot = resolveSlot<ScreenStateSlot>({
      slot: "root",
      styles,
      slotProps,
      className: cx(className, screenContentClassName),
      style: mergeStyles(style, screenContentStyle),
      baseProps: {
        "data-ui-screen-state": "",
        "data-ui-screen-state-status": resolvedStatus,
      },
    });

    const contentSlot = resolveSlot<ScreenStateSlot>({
      slot: "content",
      styles,
      slotProps,
    });

    const panelSlot = resolveScreenStatePanelSlot({
      status: resolvedStatus,
      styles,
      slotProps,
    });

    return (
      <ScreenContent
        ref={ref}
        padded={padded}
        padding={padding}
        centered={centered}
        fill={fill}
        scrollable={scrollable}
        {...screenContentRest}
        {...rest}
        {...rootSlot}
        styles={{
          ...screenContentStyles,
          root: {
            ...screenContentStyles?.root,
            ...rootSlot.style,
          },
          content: {
            ...screenContentStyles?.content,
            ...contentSlot.style,
          },
        }}
        slotProps={{
          ...screenContentSlotProps,
          root: {
            ...screenContentSlotProps?.root,
            className: cx(
              screenContentSlotProps?.root?.className,
              rootSlot.className
            ),
          },
          content: {
            ...screenContentSlotProps?.content,
            className: cx(
              screenContentSlotProps?.content?.className,
              contentSlot.className
            ),
          },
        }}
      >
        <Box {...panelSlot}>{stateNode}</Box>
      </ScreenContent>
    );
  }
);

ScreenState.displayName = "ScreenState";