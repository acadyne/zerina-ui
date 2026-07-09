// src/patterns/scaffold/screen-state/screenState.utils.tsx
import React from "react";
import type {
  ScreenStateRenderContext,
  ScreenStateStatus,
} from "./screenState.types";

export function resolveScreenStateStatus({
  status,
  loading,
  error,
  empty,
}: {
  status?: ScreenStateStatus;
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
}): ScreenStateStatus {
  if (status) return status;
  if (loading) return "loading";
  if (error) return "error";
  if (empty) return "empty";

  return "success";
}

export function getScreenStateErrorMessage(error: unknown): React.ReactNode {
  if (!error) return undefined;

  if (React.isValidElement(error)) {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "number" || typeof error === "boolean") {
    return String(error);
  }

  return "Ocurrió un error inesperado.";
}

export function createScreenStateContext({
  status,
  loading,
  empty,
  error,
  retry,
}: {
  status: ScreenStateStatus;
  loading?: boolean;
  empty?: boolean;
  error?: unknown;
  retry?: () => void | Promise<void>;
}): ScreenStateRenderContext {
  return {
    status,
    loading: Boolean(loading),
    empty: Boolean(empty),
    error,
    retry,
  };
}