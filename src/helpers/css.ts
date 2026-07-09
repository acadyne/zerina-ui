// src/helpers/css.ts
import React from "react";

export function cx(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function cssVar(name: string, fallback?: string): string {
  const normalized = name.startsWith("--") ? name : `--${name}`;

  return fallback
    ? `var(${normalized}, ${fallback})`
    : `var(${normalized})`;
}

export function px(value?: number | string): string | number | undefined {
  if (value === undefined || value === null) return undefined;

  return typeof value === "number" ? `${value}px` : value;
}

export function mergeStyles(
  ...styles: Array<React.CSSProperties | undefined>
): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

export function omitUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

export type SlotDataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type SlotAriaAttributes = {
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

export type SlotElementProps = React.HTMLAttributes<HTMLElement> &
  SlotDataAttributes &
  SlotAriaAttributes;

export type SlotStyleMap<TSlot extends string> = Partial<
  Record<TSlot, React.CSSProperties>
>;

export type SlotPropsMap<TSlot extends string> = Partial<
  Record<TSlot, SlotElementProps>
>;

export function getSlotStyle<TSlot extends string>(
  styles: SlotStyleMap<TSlot> | undefined,
  slot: TSlot
): React.CSSProperties | undefined {
  return styles?.[slot];
}

export function getSlotProps<TSlot extends string>(
  slotProps: SlotPropsMap<TSlot> | undefined,
  slot: TSlot
): SlotElementProps {
  return slotProps?.[slot] ?? {};
}