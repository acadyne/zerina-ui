// src/layout/ui/patterns/state.ts

export type ModalClosedState = {
  isOpen: false;
};

export type ModalOpenState<TTarget> = {
  isOpen: true;
  target: TTarget;
};

export type ModalState<TTarget> = ModalClosedState | ModalOpenState<TTarget>;

export function closeModalState<TTarget>(): ModalState<TTarget> {
  return { isOpen: false };
}

export function openModalState<TTarget>(target: TTarget): ModalState<TTarget> {
  return {
    isOpen: true,
    target,
  };
}

export function isModalOpenState<TTarget>(
  state: ModalState<TTarget>
): state is ModalOpenState<TTarget> {
  return state.isOpen;
}

export function getModalTarget<TTarget>(
  state: ModalState<TTarget>
): TTarget | null {
  return state.isOpen ? state.target : null;
}