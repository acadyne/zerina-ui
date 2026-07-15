// src/components/feedback/Spinner.tsx
import React from "react";
import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";
import {
  getSpinnerTransition,
  getSpinnerVariants,
  shouldAnimateSpinner,
  useOptionalUIMotion,
} from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type SpinnerSlot =
  "root";

export type SpinnerStyles =
  SlotStyleMap<SpinnerSlot>;

export type SpinnerSlotProps =
  SlotPropsMap<SpinnerSlot>;

export interface SpinnerProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "children"
    | "ref"
    | "style"
    | "className"
    | "initial"
    | "animate"
    | "exit"
    | "variants"
    | "transition"
  > {
  size?:
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | number;

  color?: string;
  thickness?: number;

  /**
   * Nombre accesible cuando el Spinner se usa de forma autónoma.
   *
   * @default "Cargando"
   */
  label?: string;

  /**
   * Elimina la semántica propia cuando otro contenedor
   * ya comunica el estado de carga.
   *
   * @default false
   */
  decorative?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: SpinnerStyles;
  slotProps?: SpinnerSlotProps;
}

const sizeMap:
  Record<
    Exclude<
      SpinnerProps["size"],
      number | undefined
    >,
    number
  > = {
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
};

export const Spinner =
  React.forwardRef<
    HTMLDivElement,
    SpinnerProps
  >(
    (
      {
        size = "md",
        color =
        "var(--ui-text)",
        thickness = 4,

        label = "Cargando",
        decorative = false,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const motionState =
        useOptionalUIMotion();

      const px =
        typeof size === "number"
          ? size
          : sizeMap[size];

      const animate =
        shouldAnimateSpinner(
          motionState.effectiveLevel
        );

      const rootSlot =
        resolveSlot<SpinnerSlot>({
          slot: "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-spinner":
              "true",

            "data-animated":
              animate ||
              undefined,

            role: decorative
              ? undefined
              : "status",

            "aria-label":
              decorative
                ? undefined
                : label,

            "aria-hidden":
              decorative
                ? true
                : undefined,
          },

          baseStyle: {
            width: px,
            height: px,

            minWidth: px,
            minHeight: px,

            border:
              `${thickness}px solid ${color}`,

            borderTopColor:
              "transparent",

            borderRadius:
              "50%",

            flexShrink: 0,
          },
        });

      return (
        <motion.div
          {...rest}
          {...toMotionSlotProps(
            rootSlot
          )}
          ref={ref}
          variants={
            getSpinnerVariants(
              motionState.effectiveLevel
            )
          }
          initial="initial"
          animate="animate"
          transition={
            getSpinnerTransition(
              motionState.effectiveLevel
            )
          }
        />
      );
    }
  );

Spinner.displayName =
  "Spinner";