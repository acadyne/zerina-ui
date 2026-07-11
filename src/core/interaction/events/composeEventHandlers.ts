// src/core/interaction/events/composeEventHandlers.ts

export interface ComposeEventHandlersOptions {
  /**
   * Cuando es true, el handler interno no se ejecuta si el consumidor
   * llamó event.preventDefault().
   */
  checkDefaultPrevented?: boolean;
}

export function composeEventHandlers<
  TEvent extends {
    defaultPrevented: boolean;
  },
>(
  externalHandler:
    | ((event: TEvent) => void)
    | undefined,
  internalHandler:
    | ((event: TEvent) => void)
    | undefined,
  options: ComposeEventHandlersOptions = {}
): (event: TEvent) => void {
  const { checkDefaultPrevented = true } = options;

  return (event) => {
    externalHandler?.(event);

    if (checkDefaultPrevented && event.defaultPrevented) {
      return;
    }

    internalHandler?.(event);
  };
}