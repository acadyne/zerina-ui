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
  if (value === undefined || value === null) {
    return undefined;
  }

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

export type RecipeVariantValue = string | number;

export type RecipeVariantSelection = Record<
  string,
  RecipeVariantValue | undefined
>;

export type SlotRecipeVariantMap<
  TSlot extends string,
  TVariants extends RecipeVariantSelection,
> = {
  [TVariant in keyof TVariants]?: Partial<
    Record<
      Extract<TVariants[TVariant], RecipeVariantValue>,
      SlotStyleMap<TSlot>
    >
  >;
};

export interface SlotRecipeConfig<
  TSlot extends string,
  TVariants extends RecipeVariantSelection,
  TState extends object,
> {
  base?: SlotStyleMap<TSlot>;

  variants?: SlotRecipeVariantMap<TSlot, TVariants>;

  resolve?: (
    input: TVariants & TState
  ) => SlotStyleMap<TSlot> | undefined;
}

export type SlotRecipe<
  TSlot extends string,
  TVariants extends RecipeVariantSelection,
  TState extends object,
> = (
  input: TVariants & TState
) => SlotStyleMap<TSlot>;

export function mergeSlotStyles<TSlot extends string>(
  ...maps: Array<SlotStyleMap<TSlot> | undefined>
): SlotStyleMap<TSlot> {
  const result: SlotStyleMap<TSlot> = {};

  for (const map of maps) {
    if (!map) {
      continue;
    }

    for (const slot of Object.keys(map) as TSlot[]) {
      result[slot] = mergeStyles(
        result[slot],
        map[slot]
      );
    }
  }

  return result;
}

export function defineSlotRecipe<
  TSlot extends string,
  TVariants extends RecipeVariantSelection,
  TState extends object = Record<never, never>,
>({
  base,
  variants,
  resolve,
}: SlotRecipeConfig<
  TSlot,
  TVariants,
  TState
>): SlotRecipe<TSlot, TVariants, TState> {
  return (input) => {
    const selectedVariantStyles = Object.entries(input).reduce<
      SlotStyleMap<TSlot>
    >((acc, [variantName, selectedValue]) => {
      if (
        selectedValue === undefined ||
        typeof selectedValue === "boolean"
      ) {
        return acc;
      }

      const variantMap =
        variants?.[variantName as keyof TVariants];

      const selectedStyles =
        variantMap?.[
          selectedValue as Extract<
            TVariants[keyof TVariants],
            RecipeVariantValue
          >
        ];

      return mergeSlotStyles(
        acc,
        selectedStyles
      );
    }, {});

    return mergeSlotStyles(
      base,
      selectedVariantStyles,
      resolve?.(input)
    );
  };
}

export interface ResolvedSlotProps {
  className?: string;
  style?: React.CSSProperties;
  rest: Omit<SlotElementProps, "className" | "style">;
}

export interface ResolveSlotOptions<TSlot extends string> {
  slot: TSlot;
  styles?: SlotStyleMap<TSlot>;
  slotProps?: SlotPropsMap<TSlot>;

  className?: string;
  style?: React.CSSProperties;

  baseStyle?: React.CSSProperties;
  baseProps?: SlotElementProps;
}

export interface ResolveLayeredSlotOptions<
  TSlot extends string,
> {
  slots: TSlot[];

  contextStyles?: SlotStyleMap<TSlot>;
  contextSlotProps?: SlotPropsMap<TSlot>;

  styles?: SlotStyleMap<TSlot>;
  slotProps?: SlotPropsMap<TSlot>;

  className?: string;
  style?: React.CSSProperties;

  baseStyle?: React.CSSProperties;
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
  const resolvedBaseProps =
    splitSlotProps(baseProps);

  const resolvedUserProps =
    splitSlotProps(
      getSlotProps(slotProps, slot)
    );

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
    rest: Omit<
      SlotElementProps,
      "className" | "style"
    >;
  }>(
    (acc, slot) => {
      const resolved =
        splitSlotProps(
          getSlotProps(slotProps, slot)
        );

      return {
        className: cx(
          acc.className,
          resolved.className
        ),

        style: mergeStyles(
          acc.style,
          getSlotStyle(styles, slot),
          resolved.style
        ),

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

  const resolvedBaseProps =
    splitSlotProps(baseProps);

  return {
    ...resolvedBaseProps.rest,
    ...merged.rest,

    className: cx(
      resolvedBaseProps.className,
      className,
      merged.className
    ),

    style: mergeStyles(
      baseStyle,
      resolvedBaseProps.style,
      merged.style,
      style
    ),
  };
}

export function resolveLayeredSlot<
  TSlot extends string,
>({
  slots,

  contextStyles,
  contextSlotProps,

  styles,
  slotProps,

  className,
  style,

  baseStyle,
  baseProps,
}: ResolveLayeredSlotOptions<TSlot>): SlotElementProps {
  const contextSlot =
    resolveMergedSlot({
      slots,
      styles: contextStyles,
      slotProps: contextSlotProps,
      baseStyle,
      baseProps,
    });

  const localSlot =
    resolveMergedSlot({
      slots,
      styles,
      slotProps,
    });

  return {
    ...contextSlot,
    ...localSlot,

    className: cx(
      contextSlot.className,
      className,
      localSlot.className
    ),

    style: mergeStyles(
      contextSlot.style,
      localSlot.style,
      style
    ),
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