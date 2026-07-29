import {
  createContext,
  useContext,
  useEffect,
  useId,
} from "react";

import type {
  FieldState,
} from "./field-semantics";


export type InputAdornmentPosition =
  | "start"
  | "end";


export interface InputGroupDescendantState {
  focused: boolean;
  focusVisible: boolean;
}


export interface InputGroupContextValue
  extends FieldState {
  updateDescendantState: (
    id: string,
    state: InputGroupDescendantState
  ) => void;

  removeDescendantState: (
    id: string
  ) => void;

  registerAdornment: (
    id: string,
    position: InputAdornmentPosition,
    node: HTMLDivElement
  ) => () => void;

  getAdornmentOffset: (
    id: string
  ) => number;

  startAdornmentWidth: number;
  endAdornmentWidth: number;
}


/**
 * Contexto canónico de InputGroup.
 *
 * Propaga la semántica restrictiva y coordina
 * la estructura visual del grupo:
 *
 * - descendientes enfocados;
 * - focus-visible agregado;
 * - adornments dinámicos;
 * - medidas e insets.
 */
export const InputGroupContext =
  createContext<
    InputGroupContextValue | null
  >(null);


export function useInputGroupContext():
  InputGroupContextValue | null {
  return useContext(
    InputGroupContext
  );
}


export function useInputGroupDescendantState({
  focused,
  focusVisible,
}: InputGroupDescendantState):
  InputGroupContextValue | null {
  const context =
    useInputGroupContext();

  const descendantId =
    useId();

  const updateDescendantState =
    context?.updateDescendantState;

  const removeDescendantState =
    context?.removeDescendantState;


  useEffect(() => {
    updateDescendantState?.(
      descendantId,
      {
        focused,
        focusVisible,
      }
    );
  }, [
    descendantId,
    focusVisible,
    focused,
    updateDescendantState,
  ]);


  useEffect(() => {
    return () => {
      removeDescendantState?.(
        descendantId
      );
    };
  }, [
    descendantId,
    removeDescendantState,
  ]);


  return context;
}
