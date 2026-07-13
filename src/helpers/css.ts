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

export function cssSize(value: number | string): string {
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

export interface ResolvedSlotProps {
  className?: string;
  style?: React.CSSProperties;
  rest: Omit<SlotElementProps, "className" | "style">;
}

export interface ResolveSlotOptions<TSlot extends string> {
  slot: TSlot;
  styles?: SlotStyleMap<TSlot>;
  slotProps?: SlotPropsMap<TSlot>;

  /**
   * className directo del componente.
   * Normalmente solo se usa para root.
   */
  className?: string;

  /**
   * style directo del componente.
   * Normalmente solo se usa para root.
   */
  style?: React.CSSProperties;

  /**
   * Estilos base internos del componente.
   */
  baseStyle?: React.CSSProperties;

  /**
   * Props base internas del componente.
   */
  baseProps?: SlotElementProps;
}

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

export function splitSlotProps(
  props: SlotElementProps | undefined
): ResolvedSlotProps {
  const { className, style, ...rest } = props ?? {};

  return {
    className,
    style,
    rest,
  };
}

export function resolveSlot<TSlot extends string>({
  slot,
  styles,
  slotProps,
  className,
  style,
  baseStyle,
  baseProps,
}: ResolveSlotOptions<TSlot>): SlotElementProps {
  const resolvedBaseProps = splitSlotProps(baseProps);
  const resolvedUserProps = splitSlotProps(getSlotProps(slotProps, slot));

  return {
    ...resolvedBaseProps.rest,
    ...resolvedUserProps.rest,
    className: cx(
      resolvedBaseProps.className,
      className,
      resolvedUserProps.className
    ),
    style: mergeStyles(
      baseStyle,
      getSlotStyle(styles, slot),
      resolvedBaseProps.style,
      resolvedUserProps.style,
      style
    ),
  };
}

export function resolveMergedSlot<TSlot extends string>({
  slots,
  styles,
  slotProps,
  className,
  style,
  baseStyle,
  baseProps,
}: {
  slots: TSlot[];
  styles?: SlotStyleMap<TSlot>;
  slotProps?: SlotPropsMap<TSlot>;
  className?: string;
  style?: React.CSSProperties;
  baseStyle?: React.CSSProperties;
  baseProps?: SlotElementProps;
}): SlotElementProps {
  const merged = slots.reduce<{
    className?: string;
    style?: React.CSSProperties;
    rest: Omit<SlotElementProps, "className" | "style">;
  }>(
    (acc, slot) => {
      const resolved = splitSlotProps(getSlotProps(slotProps, slot));

      return {
        className: cx(acc.className, resolved.className),
        style: mergeStyles(acc.style, getSlotStyle(styles, slot), resolved.style),
        rest: {
          ...acc.rest,
          ...resolved.rest,
        },
      };
    },
    {
      className: undefined,
      style: undefined,
      rest: {},
    }
  );

  const resolvedBaseProps = splitSlotProps(baseProps);

  return {
    ...resolvedBaseProps.rest,
    ...merged.rest,
    className: cx(resolvedBaseProps.className, className, merged.className),
    style: mergeStyles(baseStyle, resolvedBaseProps.style, merged.style, style),
  };
}

type MotionSlotCollision =
  | "onAnimationStart"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd";

export type MotionSlotProps = Omit<
  SlotElementProps,
  MotionSlotCollision
>;

export function toMotionSlotProps(
  slot: SlotElementProps | undefined
): MotionSlotProps {
  const {
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    ...motionSlotProps
  } = slot ?? {};

  return motionSlotProps;
}