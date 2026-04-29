// src/layout/ui/patterns/useFormDialogState.ts
import React from "react";
import { useModalState, type UseModalStateResult } from "./useModalState";
import type { ModalState } from "./state";

export interface UseFormDialogStateResult<TTarget>
  extends UseModalStateResult<TTarget> {
  openFor: (target: TTarget) => void;
  reset: () => void;
}

export function useFormDialogState<TTarget>(
  initialState?: ModalState<TTarget>
): UseFormDialogStateResult<TTarget> {
  const modal = useModalState<TTarget>(initialState);

  const openFor = React.useCallback(
    (target: TTarget) => {
      modal.open(target);
    },
    [modal.open]
  );

  const reset = React.useCallback(() => {
    modal.close();
  }, [modal.close]);

  return React.useMemo(
    () => ({
      ...modal,
      openFor,
      reset,
    }),
    [modal, openFor, reset]
  );
}