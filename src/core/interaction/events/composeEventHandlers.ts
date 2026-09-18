export interface ComposeEventHandlersOptions {
  /**
   * Cuando es true, el handler interno no se ejecuta si el consumidor
   * llamó event.preventDefault().
   */
  checkDefaultPrevented?:
    boolean;
}


export type ComposableEventHandler<
  TEvent,
> =
  | ((
      event: TEvent,
    ) => void)
  | undefined;


/**
 * Compone una cadena ordenada de handlers.
 *
 * Cada capa observa el mismo evento como máximo una vez. Después de cada
 * callback se consulta defaultPrevented; si está activo, ninguna capa posterior
 * se ejecuta.
 *
 * stopPropagation conserva únicamente su semántica DOM y no corta esta cadena.
 */
export function composeEventHandlerChain<
  TEvent extends {
    readonly defaultPrevented:
      boolean;
  },
>(
  ...handlers:
    ComposableEventHandler<TEvent>[]
):
  | ((
      event: TEvent,
    ) => void)
  | undefined {
  const activeHandlers =
    handlers.filter(
      (
        handler,
      ): handler is (
        event: TEvent,
      ) => void =>
        typeof handler ===
        "function",
    );


  if (
    activeHandlers.length ===
    0
  ) {
    return undefined;
  }


  return (
    event:
      TEvent,
  ): void => {
    for (
      const handler of
      activeHandlers
    ) {
      handler(
        event,
      );

      if (
        event.defaultPrevented
      ) {
        return;
      }
    }
  };
}


export function composeEventHandlers<
  TEvent extends {
    defaultPrevented:
      boolean;
  },
>(
  externalHandler:
    | ((
        event: TEvent,
      ) => void)
    | undefined,

  internalHandler:
    | ((
        event: TEvent,
      ) => void)
    | undefined,

  options:
    ComposeEventHandlersOptions = {},
): (
  event: TEvent,
) => void {
  const {
    checkDefaultPrevented =
      true,
  } = options;


  if (
    checkDefaultPrevented
  ) {
    const composed =
      composeEventHandlerChain(
        externalHandler,
        internalHandler,
      );

    return (
      event:
        TEvent,
    ) => {
      composed?.(
        event,
      );
    };
  }


  return (
    event:
      TEvent,
  ) => {
    externalHandler?.(
      event,
    );

    internalHandler?.(
      event,
    );
  };
}
