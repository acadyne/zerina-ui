// src/patterns/scaffold/screen-state/ScreenState.tsx
import React from "react";
import {
  Alert,
  EmptyState,
  LoadingState,
} from "../../../components/feedback";
import { Button } from "../../../primitives/forms";
import { Box, Stack } from "../../../primitives/layout";
import { Typography } from "../../../primitives/typography";
import { ScreenContent } from "../ScreenContent";
import type {
  ScreenStateProps,
  ScreenStateRenderContext,
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

    if (resolvedStatus === "success") {
      if (renderSuccessProp) {
        return <>{renderSuccessProp(context)}</>;
      }

      return <>{renderSuccess({ children, context })}</>;
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
        className={className}
        contentStyle={contentStyle}
        data-ui-screen-state=""
        data-ui-screen-state-status={resolvedStatus}
        {...screenContentProps}
        {...rest}
        style={{
          ...style,
          ...screenContentProps?.style,
        }}
      >
        {stateNode}
      </ScreenContent>
    );
  }
);

ScreenState.displayName = "ScreenState";