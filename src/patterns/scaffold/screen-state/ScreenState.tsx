// src/patterns/scaffold/screen-state/ScreenState.tsx
import React from "react";
import {
  Alert,
  EmptyState,
  LoadingState,
} from "../../../components/feedback";
import {
  cx,
  getSlotProps,
  getSlotStyle,
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
} from "./screenState.types";
import {
  createScreenStateContext,
  getScreenStateErrorMessage,
  resolveScreenStateStatus,
} from "./screenState.utils";

interface ResolvedSlotProps {
  className?: string;
  style?: React.CSSProperties;
  rest: Omit<SlotElementProps, "className" | "style">;
}

function resolveSlotProps(
  slotProps: ScreenStateSlotProps | undefined,
  slot: ScreenStateSlot
): ResolvedSlotProps {
  const { className, style, ...rest } = getSlotProps(slotProps, slot);

  return {
    className,
    style,
    rest,
  };
}

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
      contentStyle,

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

    const rootSlot = resolveSlotProps(slotProps, "root");
    const stateSlot = resolveSlotProps(slotProps, resolvedStatus);

    const {
      className: screenContentClassName,
      style: screenContentStyle,
      contentStyle: screenContentContentStyle,
      ...screenContentRest
    } = screenContentProps ?? {};

    if (resolvedStatus === "success") {
      const successNode = renderSuccessProp
        ? renderSuccessProp(context)
        : renderSuccess({ children, context });

      const shouldWrapSuccess =
        Boolean(className) ||
        Boolean(style) ||
        Object.keys(rest).length > 0 ||
        Boolean(getSlotStyle(styles, "root")) ||
        Boolean(getSlotStyle(styles, "success")) ||
        Boolean(slotProps?.root) ||
        Boolean(slotProps?.success);

      if (!shouldWrapSuccess) {
        return <>{successNode}</>;
      }

      return (
        <Box
          ref={ref}
          className={cx(className, rootSlot.className, stateSlot.className)}
          data-ui-screen-state=""
          data-ui-screen-state-status="success"
          data-ui-screen-state-success=""
          {...rootSlot.rest}
          {...stateSlot.rest}
          {...rest}
          style={{
            width: "100%",
            minWidth: 0,
            minHeight: 0,
            ...getSlotStyle(styles, "root"),
            ...rootSlot.style,
            ...style,
            ...getSlotStyle(styles, "success"),
            ...stateSlot.style,
          }}
        >
          {successNode}
        </Box>
      );
    }

    const retryAction =
      errorAction ??
      (onRetry ? (
        <Button size="sm" variant="outline" onClick={() => void onRetry()}>
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

    return (
      <ScreenContent
        ref={ref}
        padded={padded}
        padding={padding}
        centered={centered}
        fill={fill}
        scrollable={scrollable}
        className={cx(className, screenContentClassName, rootSlot.className)}
        contentStyle={{
          ...contentStyle,
          ...screenContentContentStyle,
        }}
        data-ui-screen-state=""
        data-ui-screen-state-status={resolvedStatus}
        {...screenContentRest}
        {...rootSlot.rest}
        {...rest}
        style={{
          ...getSlotStyle(styles, "root"),
          ...rootSlot.style,
          ...style,
          ...screenContentStyle,
        }}
      >
        <Box
          className={stateSlot.className}
          data-ui-screen-state-panel=""
          data-ui-screen-state-panel-status={resolvedStatus}
          data-ui-screen-state-loading={
            resolvedStatus === "loading" || undefined
          }
          data-ui-screen-state-empty={resolvedStatus === "empty" || undefined}
          data-ui-screen-state-error={resolvedStatus === "error" || undefined}
          {...stateSlot.rest}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 0,
            ...getSlotStyle(styles, resolvedStatus),
            ...stateSlot.style,
          }}
        >
          {stateNode}
        </Box>
      </ScreenContent>
    );
  }
);

ScreenState.displayName = "ScreenState";