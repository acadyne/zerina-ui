import React from "react";

import {
  useControllableValue,
} from "../../../core/react/useControllableValue";

import type {
  UIPressEvent,
} from "../../../core/interaction";


export type NavigationSelectionReason =
  | "change"
  | "reselect";

export interface NavigationSelectionContext {
  value: string;
  previousValue: string | null;
  reason: NavigationSelectionReason;
}

export interface UseNavigationSelectionOptions {
  value?: string | null;
  defaultValue?: string | null;

  onValueChange?: (
    value: string,
    event: UIPressEvent<HTMLButtonElement>,
    context: NavigationSelectionContext,
  ) => void;
}

export interface NavigationSelectionState {
  currentValue: string | null;

  setValue: (
    value: string,
    event: UIPressEvent<HTMLButtonElement>,
  ) => void;
}

/**
 * Ownership único del estado de selección para familias de navegación.
 *
 * BottomNavigation y NavigationRail comparten exactamente este contrato:
 * - controlled cuando `value !== undefined`;
 * - `change` actualiza estado interno;
 * - `reselect` notifica sin reescribir estado;
 * - el callback recibe valor previo y razón.
 */
export function useNavigationSelection({
  value,
  defaultValue = null,
  onValueChange,
}: UseNavigationSelectionOptions): NavigationSelectionState {
  const {
    value:
      currentValue,

    setUncontrolledValue:
      setInternalValue,
  } =
    useControllableValue<
      string | null
    >({
      value:
        value === undefined
          ? undefined
          : value ?? null,

      defaultValue,
    });

  const setValue =
    React.useCallback(
      (
        nextValue: string,
        event: UIPressEvent<HTMLButtonElement>,
      ): void => {
        const reason:
          NavigationSelectionReason =
          currentValue === nextValue
            ? "reselect"
            : "change";

        if (
          reason === "change"
        ) {
          setInternalValue(
            nextValue,
          );
        }

        onValueChange?.(
          nextValue,
          event,
          {
            value: nextValue,
            previousValue:
              currentValue,
            reason,
          },
        );
      },
      [
        currentValue,
        onValueChange,
        setInternalValue,
      ],
    );

  return {
    currentValue,
    setValue,
  };
}
