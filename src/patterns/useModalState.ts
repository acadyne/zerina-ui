// src/layout/ui/patterns/useModalState.ts
import React from "react";
import {
  closeModalState,
  getModalTarget,
  isModalOpenState,
  openModalState,
  type ModalState,
} from "./state";

export interface UseModalStateResult<TTarget> {
  state: ModalState<TTarget>;
  isOpen: boolean;
  target: TTarget | null;
  open: (target: TTarget) => void;
  close: () => void;
  setState: React.Dispatch<React.SetStateAction<ModalState<TTarget>>>;
}

export function useModalState<TTarget>(
  initialState: ModalState<TTarget> = closeModalState<TTarget>()
): UseModalStateResult<TTarget> {
  const [state, setState] = React.useState<ModalState<TTarget>>(initialState);

  const open = React.useCallback((target: TTarget) => {
    setState(openModalState(target));
  }, []);

  const close = React.useCallback(() => {
    setState(closeModalState<TTarget>());
  }, []);

  const isOpen = state.isOpen;
  const target = React.useMemo(() => getModalTarget(state), [state]);

  return React.useMemo(
    () => ({
      state,
      isOpen,
      target,
      open,
      close,
      setState,
    }),
    [state, isOpen, target, open, close]
  );
}

export function assertModalOpen<TTarget>(
  state: ModalState<TTarget>
): asserts state is Extract<ModalState<TTarget>, { isOpen: true }> {
  if (!isModalOpenState(state)) {
    throw new Error("Expected modal state to be open.");
  }
}