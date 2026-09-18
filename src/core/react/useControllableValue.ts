import React from "react";


export interface UseControllableValueOptions<
  TValue,
> {
  value:
    | TValue
    | undefined;

  defaultValue:
    | TValue
    | (() => TValue);
}


export interface ControllableValueState<
  TValue,
> {
  value:
    TValue;

  isControlled:
    boolean;

  setUncontrolledValue:
    React.Dispatch<
      React.SetStateAction<TValue>
    >;
}


/**
 * Owner mínimo de controlled/uncontrolled.
 *
 * Sólo decide de dónde sale el valor actual y si una escritura debe afectar
 * estado interno. No ejecuta callbacks de dominio ni normaliza valores.
 *
 * Esto preserva que cada consumidor decida su propio orden:
 *
 * internal commit -> callbacks / side effects
 *
 * Un valor controlado NO se copia al estado interno. Si un componente cambia
 * de controlled a uncontrolled, reaparece el último estado interno conocido,
 * que es exactamente la semántica previa de los consumidores migrados.
 */
export function useControllableValue<
  TValue,
>({
  value,
  defaultValue,
}: UseControllableValueOptions<TValue>):
  ControllableValueState<TValue> {
  const isControlled =
    value !== undefined;


  const [
    internalValue,
    setInternalValue,
  ] =
    React.useState<TValue>(
      defaultValue,
    );


  const currentValue =
    value !== undefined
      ? value
      : internalValue;


  const setUncontrolledValue =
    React.useCallback<
      React.Dispatch<
        React.SetStateAction<TValue>
      >
    >(
      (
        nextValue,
      ) => {
        if (
          isControlled
        ) {
          return;
        }

        setInternalValue(
          nextValue,
        );
      },
      [
        isControlled,
      ],
    );


  return {
    value:
      currentValue,

    isControlled,

    setUncontrolledValue,
  };
}
