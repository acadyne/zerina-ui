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

function mergeStyleMaps<TSlot extends string>(
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
  const variantNames = Object.keys(
    variants ?? {}
  ) as Array<Extract<keyof TVariants, string>>;

  return (input) => {
    let result = mergeStyleMaps(base);

    for (const variantName of variantNames) {
      const selectedValue = input[variantName];

      if (
        typeof selectedValue !== "string" &&
        typeof selectedValue !== "number"
      ) {
        continue;
      }

      const variantMap = variants?.[variantName] as
        | Partial<
            Record<
              RecipeVariantValue,
              SlotStyleMap<TSlot>
            >
          >
        | undefined;

      result = mergeStyleMaps(
        result,
        variantMap?.[selectedValue]
      );
    }

    return mergeStyleMaps(
      result,
      resolve?.(input)
    );
  };
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
  slots: readonly TSlot[];

  contextStyles?: SlotStyleMap<TSlot>;
  contextSlotProps?: SlotPropsMap<TSlot>;

  styles?: SlotStyleMap<TSlot>;
  slotProps?: SlotPropsMap<TSlot>;

  className?: string;
  style?: React.CSSProperties;

  baseStyle?: React.CSSProperties;
  baseProps?: SlotElementProps;
}

type SlotRestProps = Omit<
  SlotElementProps,
  "className" | "style"
>;

interface SeparatedSlotElementProps {
  className?: string;
  style?: React.CSSProperties;
  rest: SlotRestProps;
}

interface SlotLayer<TSlot extends string> {
  styles?: SlotStyleMap<TSlot>;
  slotProps?: SlotPropsMap<TSlot>;
}

interface ResolvedSlotLayer {
  className?: string;
  style: React.CSSProperties;
  rest: SlotRestProps;
}

interface ResolveSlotsOptions<TSlot extends string> {
  slots: readonly TSlot[];
  layers: readonly SlotLayer<TSlot>[];

  className?: string;
  style?: React.CSSProperties;

  baseStyle?: React.CSSProperties;
  baseProps?: SlotElementProps;
}

function separateSlotElementProps(
  props: SlotElementProps | undefined
): SeparatedSlotElementProps {
  const {
    className,
    style,
    ...rest
  } = props ?? {};

  return {
    className,
    style,
    rest,
  };
}

function mergeDefinedSlotProperties(
  ...sources: Array<SlotRestProps | undefined>
): SlotRestProps {
  const result: SlotRestProps = {};
  const resultRecord =
    result as unknown as Record<string, unknown>;

  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const [key, value] of Object.entries(source)) {
      if (value !== undefined) {
        resultRecord[key] = value;
      }
    }
  }

  return result;
}

function resolveSlotLayer<TSlot extends string>(
  slots: readonly TSlot[],
  layer: SlotLayer<TSlot>
): ResolvedSlotLayer {
  const declaredStyles: React.CSSProperties[] = [];

  for (const slot of slots) {
    const slotStyle = layer.styles?.[slot];

    if (slotStyle) {
      declaredStyles.push(slotStyle);
    }
  }

  let className: string | undefined;
  let rest: SlotRestProps = {};

  const propStyles: React.CSSProperties[] = [];

  for (const slot of slots) {
    const separated = separateSlotElementProps(
      layer.slotProps?.[slot]
    );

    className = cx(
      className,
      separated.className
    );

    if (separated.style) {
      propStyles.push(separated.style);
    }

    rest = mergeDefinedSlotProperties(
      rest,
      separated.rest
    );
  }

  return {
    className,

    style: mergeStyles(
      ...declaredStyles,
      ...propStyles
    ),

    rest,
  };
}

function resolveSlots<TSlot extends string>({
  slots,
  layers,

  className: directClassName,
  style: directStyle,

  baseStyle,
  baseProps,
}: ResolveSlotsOptions<TSlot>): SlotElementProps {
  const separatedBase =
    separateSlotElementProps(baseProps);

  let resolvedClassName =
    separatedBase.className;

  let resolvedStyle = mergeStyles(
    baseStyle,
    separatedBase.style
  );

  let resolvedRest =
    mergeDefinedSlotProperties(
      separatedBase.rest
    );

  for (const layer of layers) {
    const resolvedLayer =
      resolveSlotLayer(
        slots,
        layer
      );

    resolvedClassName = cx(
      resolvedClassName,
      resolvedLayer.className
    );

    resolvedStyle = mergeStyles(
      resolvedStyle,
      resolvedLayer.style
    );

    resolvedRest =
      mergeDefinedSlotProperties(
        resolvedRest,
        resolvedLayer.rest
      );
  }

  return {
    ...resolvedRest,

    className: cx(
      resolvedClassName,
      directClassName
    ),

    style: mergeStyles(
      resolvedStyle,
      directStyle
    ),
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
  return resolveSlots({
    slots: [slot],

    layers: [
      {
        styles,
        slotProps,
      },
    ],

    className,
    style,

    baseStyle,
    baseProps,
  });
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
  slots: readonly TSlot[];

  styles?: SlotStyleMap<TSlot>;
  slotProps?: SlotPropsMap<TSlot>;

  className?: string;
  style?: React.CSSProperties;

  baseStyle?: React.CSSProperties;
  baseProps?: SlotElementProps;
}): SlotElementProps {
  return resolveSlots({
    slots,

    layers: [
      {
        styles,
        slotProps,
      },
    ],

    className,
    style,

    baseStyle,
    baseProps,
  });
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
  return resolveSlots({
    slots,

    layers: [
      {
        styles: contextStyles,
        slotProps: contextSlotProps,
      },
      {
        styles,
        slotProps,
      },
    ],

    className,
    style,

    baseStyle,
    baseProps,
  });
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
