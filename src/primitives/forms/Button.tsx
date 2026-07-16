// src/primitives/forms/Button.tsx
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { usePress, type UIPressEvent } from "../../core/interaction";
import { composeEventHandlers } from "../../core/interaction/events/composeEventHandlers";
import {
  getSpinnerTransition,
  getSpinnerVariants,
  shouldAnimateSpinner,
  useOptionalUIMotion,
} from "../../core/motion";
import {
  type SizeProps,
  type SpaceProps,
  getSizeStyles,
  getSpacingStyles,
} from "../../helpers";
import {
  defineSlotRecipe,
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonColorScheme = "primary" | "secondary" | "danger";

export type ButtonSlot =
  | "root"
  | "spinner"
  | "content"
  | "leftIcon"
  | "rightIcon";

export type ButtonStyles = SlotStyleMap<ButtonSlot>;

export type ButtonSlotProps = SlotPropsMap<ButtonSlot>;

export interface ButtonProps
  extends Omit<
    HTMLMotionProps<"button">,
    | "children"
    | "color"
    | "onClick"
    | "ref"
    | "size"
    | "style"
    | "whileTap"
  >,
  SizeProps,
  SpaceProps {
  children?: React.ReactNode;

  colorScheme?: ButtonColorScheme;
  variant?: ButtonVariant;
  size?: ButtonSize;

  isLoading?: boolean;
  loadingText?: React.ReactNode;

  rounded?: React.CSSProperties["borderRadius"];
  fullWidth?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  onPress?: (event: UIPressEvent<HTMLElement>) => void;

  style?: React.CSSProperties;

  styles?: ButtonStyles;
  slotProps?: ButtonSlotProps;
}

const sizeStyles: Record<
  ButtonSize,
  {
    minHeight: React.CSSProperties["minHeight"];
    paddingY: string;
    paddingX: string;
  }
> = {
  sm: {
    minHeight: "var(--ui-control-h-sm)",
    paddingY: "0.45rem",
    paddingX: "0.8rem",
  },
  md: {
    minHeight: "var(--ui-control-h-md)",
    paddingY: "0.6rem",
    paddingX: "0.95rem",
  },
  lg: {
    minHeight: "var(--ui-control-h-lg)",
    paddingY: "0.75rem",
    paddingX: "1.1rem",
  },
};

const schemeMap = {
  primary: {
    solidBg: "var(--ui-primary)",
    solidHover: "var(--ui-primary-hover)",
    solidText: "var(--ui-primary-contrast)",

    outlineText: "var(--ui-primary)",
    outlineBorder:
      "color-mix(in srgb, var(--ui-primary) 42%, var(--ui-border))",
    outlineHover:
      "color-mix(in srgb, var(--ui-primary) 10%, transparent)",

    ghostText: "var(--ui-primary)",
    ghostHover:
      "color-mix(in srgb, var(--ui-primary) 10%, transparent)",
  },

  secondary: {
    solidBg: "var(--ui-secondary)",
    solidHover: "var(--ui-secondary-hover)",
    solidText: "var(--ui-secondary-contrast)",

    outlineText: "var(--ui-secondary)",
    outlineBorder:
      "color-mix(in srgb, var(--ui-secondary) 42%, var(--ui-border))",
    outlineHover:
      "color-mix(in srgb, var(--ui-secondary) 10%, transparent)",

    ghostText: "var(--ui-secondary)",
    ghostHover:
      "color-mix(in srgb, var(--ui-secondary) 10%, transparent)",
  },

  danger: {
    solidBg: "var(--ui-danger)",
    solidHover: "var(--ui-danger-hover)",
    solidText: "var(--ui-danger-contrast)",

    outlineText: "var(--ui-danger)",
    outlineBorder:
      "color-mix(in srgb, var(--ui-danger) 42%, var(--ui-border))",
    outlineHover:
      "color-mix(in srgb, var(--ui-danger) 10%, transparent)",

    ghostText: "var(--ui-danger)",
    ghostHover:
      "color-mix(in srgb, var(--ui-danger) 10%, transparent)",
  },
} as const;

function getVariantStyles(
  colorScheme: ButtonColorScheme,
  variant: ButtonVariant
): {
  background: string;
  color: string;
  border: string;
  hoverBackground: string;
  activeBackground: string;
  shadow: string;
  hoverShadow: string;
} {
  const scheme = schemeMap[colorScheme];

  if (variant === "outline") {
    return {
      background: "transparent",
      color: scheme.outlineText,
      border: `1px solid ${scheme.outlineBorder}`,
      hoverBackground: scheme.outlineHover,
      activeBackground: scheme.outlineHover,
      shadow: "none",
      hoverShadow: "var(--ui-shadow-action-outline-hover)",
    };
  }

  if (variant === "ghost") {
    return {
      background: "transparent",
      color: scheme.ghostText,
      border: "1px solid transparent",
      hoverBackground: scheme.ghostHover,
      activeBackground: scheme.ghostHover,
      shadow: "none",
      hoverShadow: "var(--ui-shadow-action-subtle-hover)",
    };
  }

  return {
    background: scheme.solidBg,
    color: scheme.solidText,
    border: "1px solid transparent",
    hoverBackground: scheme.solidHover,
    activeBackground: scheme.solidHover,
    shadow: "var(--ui-shadow-action)",
    hoverShadow: "var(--ui-shadow-action-hover)",
  };
}

type ButtonRecipeVariants = {
  variant: ButtonVariant;
  size: ButtonSize;
  colorScheme: ButtonColorScheme;
};

type ButtonRecipeState = {
  hovered: boolean;
  pressed: boolean;
  focusVisible: boolean;
  disabled: boolean;
};

const buttonRecipe = defineSlotRecipe<
  ButtonSlot,
  ButtonRecipeVariants,
  ButtonRecipeState
>({
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.55rem",

      lineHeight: 1.1,
      fontWeight: 700,
      letterSpacing: "0.2px",

      touchAction: "manipulation",
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",

      whiteSpace: "nowrap",
      verticalAlign: "middle",

      outline: "none",

      transition:
        "background var(--ui-duration-normal) var(--ui-ease-standard), " +
        "border-color var(--ui-duration-normal) var(--ui-ease-standard), " +
        "color var(--ui-duration-normal) var(--ui-ease-standard), " +
        "opacity var(--ui-duration-normal) var(--ui-ease-standard), " +
        "box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
    },

    spinner: {
      width: 16,
      height: 16,
      borderRadius: "var(--ui-radius-full)",
      borderTopColor: "transparent",
      flexShrink: 0,
    },

    content: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 0,
    },

    leftIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      lineHeight: 1,
    },

    rightIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      lineHeight: 1,
    },
  },

  variants: {
    size: {
      sm: {
        root: {
          minHeight: "var(--ui-control-h-sm)",
          fontSize: "var(--ui-font-size-sm)",
          paddingBlock: "0.45rem",
          paddingInline: "0.8rem",
          borderRadius: "var(--ui-radius-sm)",
        },
      },

      md: {
        root: {
          minHeight: "var(--ui-control-h-md)",
          fontSize: "var(--ui-font-size-md)",
          paddingBlock: "0.6rem",
          paddingInline: "0.95rem",
          borderRadius: "var(--ui-radius-md)",
        },
      },

      lg: {
        root: {
          minHeight: "var(--ui-control-h-lg)",
          fontSize: "var(--ui-font-size-lg)",
          paddingBlock: "0.75rem",
          paddingInline: "1.1rem",
          borderRadius: "var(--ui-radius-lg)",
        },
      },
    },
  },

  resolve: ({
    variant,
    colorScheme,
    hovered,
    pressed,
    focusVisible,
    disabled,
  }) => {
    const variantStyle = getVariantStyles(colorScheme, variant);

    const shadow =
      hovered && !disabled
        ? variantStyle.hoverShadow
        : variantStyle.shadow;

    return {
      root: {
        opacity: disabled
          ? "var(--ui-state-disabled-opacity)"
          : 1,

        cursor: disabled ? "not-allowed" : "pointer",

        boxShadow: focusVisible
          ? `0 0 0 3px var(--ui-focus-ring), ${shadow}`
          : shadow,

        background:
          pressed && !disabled
            ? variantStyle.activeBackground
            : hovered && !disabled
              ? variantStyle.hoverBackground
              : variantStyle.background,

        color: variantStyle.color,
        border: variantStyle.border,
      },
    };
  },
});

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      colorScheme = "primary",
      variant = "solid",
      size = "md",
      isLoading = false,
      loadingText = "Cargando...",
      disabled = false,
      type = "button",
      className = "",
      style,

      w,
      h,
      minW,
      maxW,
      minH,
      maxH,

      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,

      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,

      rounded,
      fullWidth = false,

      leftIcon,
      rightIcon,

      onPress,

      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,

      onFocus,
      onBlur,

      onKeyDown,
      onKeyUp,

      styles,
      slotProps,

      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();

    const isDisabled = disabled || isLoading;
    const sizeStyle = sizeStyles[size];
    const rootSlotProps = slotProps?.root;

    const {
      onPointerEnter: slotOnPointerEnter,
      onPointerLeave: slotOnPointerLeave,
      onPointerDown: slotOnPointerDown,
      onPointerUp: slotOnPointerUp,
      onPointerCancel: slotOnPointerCancel,
      onLostPointerCapture: slotOnLostPointerCapture,
      onFocus: slotOnFocus,
      onBlur: slotOnBlur,
      onKeyDown: slotOnKeyDown,
      onKeyUp: slotOnKeyUp,
      onClick: slotOnClick,
    } = rootSlotProps ?? {};

    const press = usePress<HTMLButtonElement>({
      disabled: isDisabled,
      nativeInteractive: true,
      onPress,

      onPointerEnter: composeEventHandlers(
        onPointerEnter,
        slotOnPointerEnter
      ),

      onPointerLeave: composeEventHandlers(
        onPointerLeave,
        slotOnPointerLeave,
        {
          checkDefaultPrevented: false,
        }
      ),

      onPointerDown: composeEventHandlers(
        onPointerDown,
        slotOnPointerDown
      ),

      onPointerUp: composeEventHandlers(
        onPointerUp,
        slotOnPointerUp,
        {
          checkDefaultPrevented: false,
        }
      ),

      onPointerCancel: composeEventHandlers(
        onPointerCancel,
        slotOnPointerCancel,
        {
          checkDefaultPrevented: false,
        }
      ),

      onLostPointerCapture: composeEventHandlers(
        onLostPointerCapture,
        slotOnLostPointerCapture,
        {
          checkDefaultPrevented: false,
        }
      ),

      onFocus: composeEventHandlers(
        onFocus,
        slotOnFocus
      ),

      onBlur: composeEventHandlers(
        onBlur,
        slotOnBlur,
        {
          checkDefaultPrevented: false,
        }
      ),

      onKeyDown: composeEventHandlers(
        onKeyDown,
        slotOnKeyDown
      ),

      onKeyUp: composeEventHandlers(
        onKeyUp,
        slotOnKeyUp
      ),

      onClick: slotOnClick,
    });

    const pressMotion = press.state.pressed
      ? motionState.getPressMotion(motionState.effectiveLevel)
      : undefined;

    const spinnerAnimated =
      shouldAnimateSpinner(
        motionState.effectiveLevel
      );

    const recipeStyles = buttonRecipe({
      variant,
      size,
      colorScheme,
      hovered: press.state.hovered,
      pressed: press.state.pressed,
      focusVisible: press.state.focusVisible,
      disabled: isDisabled,
    });

    const spinnerColor =
      variant === "solid"
        ? "color-mix(in srgb, currentColor 78%, transparent)"
        : "currentColor";

    const rootSlot = resolveSlot<ButtonSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-button": "",
        "data-ui-button-variant": variant,
        "data-ui-button-color-scheme": colorScheme,
        "data-ui-button-size": size,
        "data-ui-button-loading": isLoading || undefined,
        "data-disabled": isDisabled || undefined,
        "data-hovered": press.state.hovered || undefined,
        "data-pressed": press.state.pressed || undefined,
        "data-focused": press.state.focused || undefined,
        "data-focus-visible": press.state.focusVisible || undefined,
      },
      baseStyle: {
        ...recipeStyles.root,

        ...getSizeStyles({
          w,
          h,
          minW,
          maxW,
          minH: minH ?? sizeStyle.minHeight,
          maxH,
        }),

        ...getSpacingStyles({
          p,
          px: px ?? sizeStyle.paddingX,
          py: py ?? sizeStyle.paddingY,
          pt,
          pb,
          pl,
          pr,
          m,
          mx,
          my,
          mt,
          mb,
          ml,
          mr,
        }),

        width: fullWidth ? "100%" : w,
        minWidth: fullWidth ? 0 : minW,

        borderRadius:
          rounded ?? recipeStyles.root?.borderRadius,
      },
    });

    const spinnerSlot = resolveSlot<ButtonSlot>({
      slot: "spinner",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
        "data-ui-spinner": "true",
        "data-animated":
          spinnerAnimated ||
          undefined,
      },
      baseStyle: {
        ...recipeStyles.spinner,
        border: `2px solid ${spinnerColor}`,
      },
    });

    const contentSlot = resolveSlot<ButtonSlot>({
      slot: "content",
      styles,
      slotProps,
      baseStyle: {
        ...recipeStyles.content,
        opacity: isLoading ? 0.95 : undefined,
      },
    });

    const leftIconSlot = resolveSlot<ButtonSlot>({
      slot: "leftIcon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: recipeStyles.leftIcon,
    });

    const rightIconSlot = resolveSlot<ButtonSlot>({
      slot: "rightIcon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: recipeStyles.rightIcon,
    });

    return (
      <motion.button
        {...rest}
        {...toMotionSlotProps(rootSlot)}
        {...press.pressProps}
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        animate={pressMotion}
        transition={motionState.getTransition(
          motionState.effectiveLevel,
          "press"
        )}
      >
        {isLoading ? (
          <>
            <motion.span
              {...toMotionSlotProps(
                spinnerSlot
              )}
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

            <span {...contentSlot}>
              {loadingText}
            </span>
          </>
        ) : (
          <>
            {leftIcon ? (
              <span {...leftIconSlot}>{leftIcon}</span>
            ) : null}

            <span {...contentSlot}>{children}</span>

            {rightIcon ? (
              <span {...rightIconSlot}>{rightIcon}</span>
            ) : null}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";