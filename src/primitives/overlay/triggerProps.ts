import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";

type CancellableEvent = {
  readonly defaultPrevented: boolean;
};

type CancellableHandler = (
  event: CancellableEvent
) => void;

function isEventHandlerName(
  name: string
): boolean {
  return /^on[A-Z]/.test(name);
}

function isStyleObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/*
 * Un trigger asChild conserva las props del hijo y después aplica el slot.
 * Los handlers se componen en ese mismo orden para que preventDefault()
 * pueda detener tanto la siguiente capa pública como la conducta interna.
 */
export function mergeTriggerProps<
  TChildProps extends object,
  TSlotProps extends object,
>(
  childProps: TChildProps,
  slotProps: TSlotProps
): TChildProps & TSlotProps {
  const merged = {
    ...childProps,
    ...slotProps,
  } as TChildProps & TSlotProps;

  const childRecord =
    childProps as Record<
      string,
      unknown
    >;

  const slotRecord =
    slotProps as Record<
      string,
      unknown
    >;

  const mergedRecord =
    merged as Record<
      string,
      unknown
    >;

  for (
    const [
      name,
      slotValue,
    ] of Object.entries(
      slotRecord
    )
  ) {
    const childValue =
      childRecord[name];

    if (
      !isEventHandlerName(name) ||
      typeof childValue !==
        "function" ||
      typeof slotValue !==
        "function"
    ) {
      continue;
    }

    mergedRecord[name] =
      composeEventHandlers(
        childValue as CancellableHandler,
        slotValue as CancellableHandler
      );
  }

  const className = [
    typeof childRecord.className ===
    "string"
      ? childRecord.className
      : undefined,

    typeof slotRecord.className ===
    "string"
      ? slotRecord.className
      : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  if (className) {
    mergedRecord.className =
      className;
  }

  const childStyle =
    isStyleObject(
      childRecord.style
    )
      ? childRecord.style
      : undefined;

  const slotStyle =
    isStyleObject(
      slotRecord.style
    )
      ? slotRecord.style
      : undefined;

  if (
    childStyle ||
    slotStyle
  ) {
    mergedRecord.style = {
      ...childStyle,
      ...slotStyle,
    };
  }

  return merged;
}
