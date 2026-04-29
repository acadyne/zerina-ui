// src/layout/ui/patterns/useConfirmModal.ts
import React from "react";
import { useModalState, type UseModalStateResult } from "./useModalState";
import type { ModalState } from "./state";

export interface UseConfirmModalResult<TTarget>
  extends UseModalStateResult<TTarget> {
  confirm: (target: TTarget) => void;
  cancel: () => void;
}

export function useConfirmModal<TTarget>(
  initialState?: ModalState<TTarget>
): UseConfirmModalResult<TTarget> {
  const modal = useModalState<TTarget>(initialState);

  const confirm = React.useCallback(
    (target: TTarget) => {
      modal.open(target);
    },
    [modal.open]
  );

  const cancel = React.useCallback(() => {
    modal.close();
  }, [modal.close]);

  return React.useMemo(
    () => ({
      ...modal,
      confirm,
      cancel,
    }),
    [modal, confirm, cancel]
  );
}