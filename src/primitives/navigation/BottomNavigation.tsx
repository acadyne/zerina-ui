// src/primitives/navigation/BottomNavigation.tsx
import React from "react";
import { Pressable } from "../forms";
import { Box } from "../layout";
import { Typography } from "../typography";

export type BottomNavigationPosition = "fixed" | "sticky" | "static";

export interface BottomNavigationContextValue {
  value: string | null;
  setValue: (value: string, event: React.MouseEvent<HTMLElement>) => void;
}

const BottomNavigationContext =
  React.createContext<BottomNavigationContextValue | null>(null);

export interface BottomNavigationProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "onChange" | "defaultValue"
  > {
  children?: React.ReactNode;

  /**
   * Valor controlado.
   */
  value?: string | null;

  /**
   * Valor inicial cuando no está controlado.
   */
  defaultValue?: string | null;

  /**
   * Se dispara cuando cambia el item activo.
   */
  onValueChange?: (
    value: string,
    event: React.MouseEvent<HTMLElement>
  ) => void;

  /**
   * Alto visual de la barra, sin contar safe-area.
   */
  height?: number | string;

  /**
   * Posición de la barra.
   */
  position?: BottomNavigationPosition;

  /**
   * Respeta safe-area inferior.
   */
  safeArea?: boolean;

  /**
   * Si está activo, añade blur/transparencia tipo mobile bar.
   */
  translucent?: boolean;

  className?: string;
  style?: React.CSSProperties;
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
   * aria-label opcional cuando el item no tiene texto visible.
   */
  ariaLabel?: string;

  /**
   * Callback adicional del item.
   */
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
      height = 68,
      position = "fixed",
      safeArea = true,
      translucent = true,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;

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
      }),
      [currentValue, setValue]
    );

    return (
      <BottomNavigationContext.Provider value={contextValue}>
        <Box
          as="nav"
          ref={ref as React.Ref<Element>}
          className={className}
          aria-label={rest["aria-label"] ?? "Navegación inferior"}
          {...rest}
          style={{
            ...getRootPositionStyle(position),
            minWidth: 0,
            paddingBottom: safeArea
              ? "env(safe-area-inset-bottom, 0px)"
              : undefined,
            background: translucent
              ? "color-mix(in srgb, var(--ui-surface) 92%, transparent)"
              : "var(--ui-surface)",
            borderTop: "1px solid var(--ui-border)",
            backdropFilter: translucent ? "blur(14px)" : undefined,
            WebkitBackdropFilter: translucent ? "blur(14px)" : undefined,
            boxSizing: "border-box",
            ...style,
          }}
        >
          <Box
            role="tablist"
            style={{
              height: cssSize(height),
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              gap: "0.25rem",
              padding: "0.4rem 0.45rem",
              boxSizing: "border-box",
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
        onPress={(event) => {
          ctx.setValue(value, event);
          onSelect?.(value, event);
        }}
        style={{
          flex: "1 1 0",
          minWidth: 0,
          height: "100%",
          border: "1px solid transparent",
          borderRadius: "var(--ui-radius-lg)",
          background: active
            ? "color-mix(in srgb, var(--ui-primary) 16%, transparent)"
            : "transparent",
          color: active ? "var(--ui-text)" : "var(--ui-text-muted)",
          opacity: disabled ? "var(--ui-state-disabled-opacity, 0.62)" : 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.2rem",
          padding: "0.25rem",
          textAlign: "center",
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
          }}
        >
          {icon ? (
            <Box
              aria-hidden="true"
              style={{
                fontSize: "1.15rem",
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
                top: "-0.45rem",
                right: "-0.65rem",
                minWidth: 0,
              }}
            >
              {badge}
            </Box>
          ) : null}
        </Box>

        {itemLabel ? (
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
            }}
          >
            {itemLabel}
          </Typography>
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