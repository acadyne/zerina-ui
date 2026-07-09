// src/primitives/navigation/BottomNavigation.tsx
import React from "react";
import { Pressable } from "../forms";
import { Box } from "../layout";
import { Typography } from "../typography";

export type BottomNavigationPosition = "fixed" | "sticky" | "static";

export type BottomNavigationVariant = "plain" | "surface" | "floating";

export type BottomNavigationLabelBehavior = "always" | "active" | "never";

export type BottomNavigationIndicator = "background" | "pill" | "dot" | "none";

export type BottomNavigationDensity = "compact" | "comfortable";

export interface BottomNavigationContextValue {
  value: string | null;
  setValue: (value: string, event: React.MouseEvent<HTMLElement>) => void;
  labelBehavior: BottomNavigationLabelBehavior;
  indicator: BottomNavigationIndicator;
  density: BottomNavigationDensity;
}

const BottomNavigationContext =
  React.createContext<BottomNavigationContextValue | null>(null);

export interface BottomNavigationProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "onChange" | "defaultValue"
  > {
  children?: React.ReactNode;

  value?: string | null;
  defaultValue?: string | null;

  onValueChange?: (
    value: string,
    event: React.MouseEvent<HTMLElement>
  ) => void;

  height?: number | string;
  position?: BottomNavigationPosition;
  safeArea?: boolean;
  translucent?: boolean;

  /**
   * plain:
   *   Barra simple, pegada al borde.
   *
   * surface:
   *   Barra con superficie y borde superior.
   *
   * floating:
   *   Barra tipo cápsula, con margen lateral e inferior.
   */
  variant?: BottomNavigationVariant;

  /**
   * always:
   *   Siempre muestra labels.
   *
   * active:
   *   Solo muestra label del item activo.
   *
   * never:
   *   Solo muestra iconos.
   */
  labelBehavior?: BottomNavigationLabelBehavior;

  /**
   * background:
   *   Fondo rectangular suave en el item activo.
   *
   * pill:
   *   Cápsula más marcada para el item activo.
   *
   * dot:
   *   Punto inferior para el item activo.
   *
   * none:
   *   Sin indicador visual extra.
   */
  indicator?: BottomNavigationIndicator;

  density?: BottomNavigationDensity;

  className?: string;
  style?: React.CSSProperties;
  listStyle?: React.CSSProperties;
}

export interface BottomNavigationItemProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "onClick" | "onSelect" | "value"
  > {
  value: string;

  children?: React.ReactNode;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;

  disabled?: boolean;

  /**
   * true:
   *   Actualiza el value activo del BottomNavigation.
   *
   * false:
   *   Ejecuta onSelect, pero no cambia el value.
   *   Útil para abrir menús, sheets o flyouts.
   */
  selectable?: boolean;

  ariaLabel?: string;

  onSelect?: (
    value: string,
    event: React.MouseEvent<HTMLElement>
  ) => void;

  className?: string;
  style?: React.CSSProperties;
}

type BottomNavigationComponent = React.ForwardRefExoticComponent<
  BottomNavigationProps & React.RefAttributes<HTMLElement>
> & {
  Item: React.ForwardRefExoticComponent<
    BottomNavigationItemProps & React.RefAttributes<HTMLButtonElement>
  >;
};

const DENSITY_MAP: Record<
  BottomNavigationDensity,
  {
    defaultHeight: number;
    listPaddingTop: string;
    listPaddingRight: string;
    listPaddingBottom: string;
    listPaddingLeft: string;
    itemPaddingTop: string;
    itemPaddingRight: string;
    itemPaddingBottom: string;
    itemPaddingLeft: string;
    iconSize: string;
    gap: string;
  }
> = {
  compact: {
    defaultHeight: 58,
    listPaddingTop: "0.3rem",
    listPaddingRight: "0.35rem",
    listPaddingBottom: "0.3rem",
    listPaddingLeft: "0.35rem",
    itemPaddingTop: "0.2rem",
    itemPaddingRight: "0.2rem",
    itemPaddingBottom: "0.2rem",
    itemPaddingLeft: "0.2rem",
    iconSize: "1.05rem",
    gap: "0.12rem",
  },
  comfortable: {
    defaultHeight: 68,
    listPaddingTop: "0.4rem",
    listPaddingRight: "0.45rem",
    listPaddingBottom: "0.4rem",
    listPaddingLeft: "0.45rem",
    itemPaddingTop: "0.25rem",
    itemPaddingRight: "0.25rem",
    itemPaddingBottom: "0.25rem",
    itemPaddingLeft: "0.25rem",
    iconSize: "1.15rem",
    gap: "0.2rem",
  },
};

function cssSize(value: number | string): number | string {
  return typeof value === "number" ? `${value}px` : value;
}

function getRootPositionStyle(
  position: BottomNavigationPosition
): React.CSSProperties {
  if (position === "fixed") {
    return {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1400,
    };
  }

  if (position === "sticky") {
    return {
      position: "sticky",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
    };
  }

  return {
    position: "relative",
  };
}

function getRootSurfaceStyles({
  variant,
  translucent,
}: {
  variant: BottomNavigationVariant;
  translucent: boolean;
}): React.CSSProperties {
  if (variant === "plain") {
    return {
      background: "transparent",
      borderTop: "1px solid transparent",
      backdropFilter: undefined,
      WebkitBackdropFilter: undefined,
    };
  }

  if (variant === "floating") {
    return {
      background: "transparent",
      borderTop: "1px solid transparent",
      backdropFilter: undefined,
      WebkitBackdropFilter: undefined,
    };
  }

  return {
    background: translucent
      ? "color-mix(in srgb, var(--ui-surface) 92%, transparent)"
      : "var(--ui-surface)",
    borderTop: "1px solid var(--ui-border)",
    backdropFilter: translucent ? "blur(14px)" : undefined,
    WebkitBackdropFilter: translucent ? "blur(14px)" : undefined,
  };
}

function getListSurfaceStyles({
  variant,
  translucent,
}: {
  variant: BottomNavigationVariant;
  translucent: boolean;
}): React.CSSProperties {
  if (variant !== "floating") {
    return {};
  }

  return {
    marginTop: "0.45rem",
    marginRight: "0.65rem",
    marginBottom: "0.45rem",
    marginLeft: "0.65rem",
    borderRadius: "9999px",
    border: "1px solid var(--ui-border)",
    background: translucent
      ? "color-mix(in srgb, var(--ui-surface) 88%, transparent)"
      : "var(--ui-surface)",
    boxShadow: "var(--ui-shadow-lg)",
    backdropFilter: translucent ? "blur(16px)" : undefined,
    WebkitBackdropFilter: translucent ? "blur(16px)" : undefined,
  };
}

function getItemBackground({
  active,
  indicator,
}: {
  active: boolean;
  indicator: BottomNavigationIndicator;
}): string {
  if (!active) return "transparent";
  if (indicator === "none" || indicator === "dot") return "transparent";

  return "color-mix(in srgb, var(--ui-primary) 16%, transparent)";
}

function getItemBorderColor({
  active,
  indicator,
}: {
  active: boolean;
  indicator: BottomNavigationIndicator;
}): string {
  if (!active) return "transparent";

  if (indicator === "pill") {
    return "color-mix(in srgb, var(--ui-primary) 32%, transparent)";
  }

  return "transparent";
}

const BottomNavigationRoot = React.forwardRef<
  HTMLElement,
  BottomNavigationProps
>(
  (
    {
      children,
      value,
      defaultValue = null,
      onValueChange,
      height,
      position = "fixed",
      safeArea = true,
      translucent = true,
      variant = "surface",
      labelBehavior = "always",
      indicator = "background",
      density = "comfortable",
      className = "",
      style,
      listStyle,
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const densityStyles = DENSITY_MAP[density];
    const resolvedHeight = height ?? densityStyles.defaultHeight;

    const [internalValue, setInternalValue] =
      React.useState<string | null>(defaultValue);

    const currentValue = isControlled ? value ?? null : internalValue;

    const setValue = React.useCallback(
      (nextValue: string, event: React.MouseEvent<HTMLElement>) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue, event);
      },
      [isControlled, onValueChange]
    );

    const contextValue = React.useMemo<BottomNavigationContextValue>(
      () => ({
        value: currentValue,
        setValue,
        labelBehavior,
        indicator,
        density,
      }),
      [currentValue, setValue, labelBehavior, indicator, density]
    );

    return (
      <BottomNavigationContext.Provider value={contextValue}>
        <Box
          as="nav"
          ref={ref as React.Ref<Element>}
          className={className}
          aria-label={rest["aria-label"] ?? "Navegación inferior"}
          data-ui-bottom-navigation=""
          data-ui-bottom-navigation-variant={variant}
          data-ui-bottom-navigation-density={density}
          data-ui-bottom-navigation-indicator={indicator}
          data-ui-bottom-navigation-label-behavior={labelBehavior}
          {...rest}
          style={{
            ...getRootPositionStyle(position),
            minWidth: 0,
            paddingBottom: safeArea
              ? "env(safe-area-inset-bottom, 0px)"
              : undefined,
            boxSizing: "border-box",
            ...getRootSurfaceStyles({ variant, translucent }),
            ...style,
          }}
        >
          <Box
            role="tablist"
            style={{
              height: cssSize(resolvedHeight),
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              gap: "0.25rem",
              paddingTop: densityStyles.listPaddingTop,
              paddingRight: densityStyles.listPaddingRight,
              paddingBottom: densityStyles.listPaddingBottom,
              paddingLeft: densityStyles.listPaddingLeft,
              boxSizing: "border-box",
              ...getListSurfaceStyles({ variant, translucent }),
              ...listStyle,
            }}
          >
            {children}
          </Box>
        </Box>
      </BottomNavigationContext.Provider>
    );
  }
);

BottomNavigationRoot.displayName = "BottomNavigation";

const BottomNavigationItem = React.forwardRef<
  HTMLButtonElement,
  BottomNavigationItemProps
>(
  (
    {
      value,
      children,
      label,
      icon,
      badge,
      disabled = false,
      selectable = true,
      ariaLabel,
      onSelect,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const ctx = React.useContext(BottomNavigationContext);

    if (!ctx) {
      throw new Error(
        "BottomNavigation.Item must be used inside <BottomNavigation />"
      );
    }

    const active = ctx.value === value;
    const itemLabel = children ?? label;
    const densityStyles = DENSITY_MAP[ctx.density];

    const showLabel =
      Boolean(itemLabel) &&
      (ctx.labelBehavior === "always" ||
        (ctx.labelBehavior === "active" && active));

    return (
      <Pressable
        as="button"
        ref={ref as React.Ref<HTMLElement>}
        type="button"
        disabled={disabled}
        className={className}
        role="tab"
        aria-selected={active}
        aria-label={ariaLabel}
        data-active={active || undefined}
        data-ui-bottom-navigation-item=""
        data-ui-bottom-navigation-item-active={active || undefined}
        onPress={(event) => {
          if (selectable) {
            ctx.setValue(value, event);
          }

          onSelect?.(value, event);
        }}
        style={{
          flex: "1 1 0",
          minWidth: 0,
          height: "100%",
          position: "relative",
          border: "1px solid",
          borderColor: getItemBorderColor({
            active,
            indicator: ctx.indicator,
          }),
          borderRadius:
            ctx.indicator === "pill" ? "9999px" : "var(--ui-radius-lg)",
          background: getItemBackground({
            active,
            indicator: ctx.indicator,
          }),
          color: active ? "var(--ui-text)" : "var(--ui-text-muted)",
          opacity: disabled ? "var(--ui-state-disabled-opacity, 0.62)" : 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: densityStyles.gap,
          paddingTop: densityStyles.itemPaddingTop,
          paddingRight: densityStyles.itemPaddingRight,
          paddingBottom: densityStyles.itemPaddingBottom,
          paddingLeft: densityStyles.itemPaddingLeft,
          textAlign: "center",
          overflow: "hidden",
          transition:
            "background var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), color var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard)",
          ...style,
        }}
        {...rest}
      >
        <Box
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
            lineHeight: 1,
            transform: active ? "translateY(-1px)" : undefined,
            transition:
              "transform var(--ui-duration-normal) var(--ui-ease-standard)",
          }}
        >
          {icon ? (
            <Box
              aria-hidden="true"
              style={{
                fontSize: densityStyles.iconSize,
                lineHeight: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
          ) : null}

          {badge ? (
            <Box
              style={{
                position: "absolute",
                top: "-0.5rem",
                right: "-0.7rem",
                minWidth: 0,
                pointerEvents: "none",
              }}
            >
              {badge}
            </Box>
          ) : null}
        </Box>

        {showLabel ? (
          <Typography
            as="span"
            size="xs"
            weight={active ? 800 : 700}
            style={{
              maxWidth: "100%",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "inherit",
              lineHeight: 1.2,
            }}
          >
            {itemLabel}
          </Typography>
        ) : null}

        {ctx.indicator === "dot" && active ? (
          <Box
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "0.22rem",
              width: 4,
              height: 4,
              borderRadius: "9999px",
              transform: "translateX(-50%)",
              background: "var(--ui-primary)",
            }}
          />
        ) : null}
      </Pressable>
    );
  }
);

BottomNavigationItem.displayName = "BottomNavigation.Item";

export const BottomNavigation = Object.assign(BottomNavigationRoot, {
  Item: BottomNavigationItem,
}) as BottomNavigationComponent;

export { BottomNavigationItem };