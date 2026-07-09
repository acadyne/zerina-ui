// src/primitives/layout/List.tsx
import React from "react";
import { Box, type BoxProps } from "./Box";
import { Stack } from "./Stack";
import { Pressable } from "../forms/Pressable";

export type ListDensity = "compact" | "comfortable" | "spacious";

export type ListVariant = "plain" | "surface" | "outlined";

export interface ListContextValue {
  density: ListDensity;
  variant: ListVariant;
  divided: boolean;
}

const ListContext = React.createContext<ListContextValue>({
  density: "comfortable",
  variant: "plain",
  divided: false,
});

export interface ListProps extends BoxProps<"div"> {
  children?: React.ReactNode;

  /**
   * Densidad visual de los items.
   */
  density?: ListDensity;

  /**
   * Estilo del contenedor.
   */
  variant?: ListVariant;

  /**
   * Espacio entre items.
   */
  spacing?: React.CSSProperties["gap"];

  /**
   * Añade separadores sutiles entre items.
   */
  divided?: boolean;
}

export interface ListSectionProps extends BoxProps<"section"> {
  children?: React.ReactNode;

  /**
   * Etiqueta visual de la sección.
   *
   * Usamos label en lugar de title para no colisionar con el atributo HTML title.
   */
  label?: React.ReactNode;

  description?: React.ReactNode;
}

export interface ListItemProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "title" | "onClick"
  > {
  children?: React.ReactNode;

  title?: React.ReactNode;
  description?: React.ReactNode;

  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  value?: React.ReactNode;

  selected?: boolean;
  disabled?: boolean;

  showChevron?: boolean;

  onPress?: (event: React.MouseEvent<HTMLElement>) => void;
  onLongPress?: (event: React.PointerEvent<HTMLElement>) => void;

  className?: string;
  style?: React.CSSProperties;
}

type ListComponent = React.ForwardRefExoticComponent<
  ListProps & React.RefAttributes<HTMLDivElement>
> & {
  Section: React.ForwardRefExoticComponent<
    ListSectionProps & React.RefAttributes<HTMLElement>
  >;
  Item: React.ForwardRefExoticComponent<
    ListItemProps & React.RefAttributes<HTMLDivElement>
  >;
};

function getListVariantStyle(variant: ListVariant): React.CSSProperties {
  if (variant === "surface") {
    return {
      background: "var(--ui-surface)",
      borderRadius: "var(--ui-radius-lg)",
    };
  }

  if (variant === "outlined") {
    return {
      background: "var(--ui-surface)",
      border: "1px solid var(--ui-border)",
      borderRadius: "var(--ui-radius-lg)",
    };
  }

  return {};
}

function getItemPadding(density: ListDensity): React.CSSProperties {
  if (density === "compact") {
    return {
      padding: "0.55rem 0.65rem",
      minHeight: "2.25rem",
    };
  }

  if (density === "spacious") {
    return {
      padding: "0.95rem 1rem",
      minHeight: "3.5rem",
    };
  }

  return {
    padding: "0.75rem 0.85rem",
    minHeight: "2.75rem",
  };
}

function getItemBackground(options: {
  selected: boolean;
  pressed?: boolean;
  hovered?: boolean;
}): string {
  const { selected, pressed, hovered } = options;

  if (pressed) {
    return "var(--ui-surface-3)";
  }

  if (selected) {
    return "color-mix(in srgb, var(--ui-primary) 12%, var(--ui-surface))";
  }

  if (hovered) {
    return "var(--ui-surface-hover)";
  }

  return "transparent";
}

const ListRoot = React.forwardRef<HTMLDivElement, ListProps>(
  (
    {
      children,
      density = "comfortable",
      variant = "plain",
      spacing = variant === "plain" ? "0.5rem" : 0,
      divided = false,
      style,
      ...rest
    },
    ref
  ) => {
    const value = React.useMemo<ListContextValue>(
      () => ({
        density,
        variant,
        divided,
      }),
      [density, variant, divided]
    );

    return (
      <ListContext.Provider value={value}>
        <Box
          ref={ref}
          role="list"
          {...rest}
          style={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            ...getListVariantStyle(variant),
            ...style,
          }}
        >
          <Stack spacing={spacing}>{children}</Stack>
        </Box>
      </ListContext.Provider>
    );
  }
);

ListRoot.displayName = "List";

const ListSection = React.forwardRef<HTMLElement, ListSectionProps>(
  ({ children, label, description, style, ...rest }, ref) => {
    return (
      <Box
        as="section"
        ref={ref}
        {...rest}
        style={{
          minWidth: 0,
          boxSizing: "border-box",
          ...style,
        }}
      >
        {label || description ? (
          <Box
            style={{
              marginBottom: "0.45rem",
              paddingInline: "0.25rem",
              minWidth: 0,
            }}
          >
            {label ? (
              <Box
                style={{
                  fontSize: "var(--ui-font-size-xs)",
                  fontWeight: "var(--ui-font-weight-bold)",
                  color: "var(--ui-text-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Box>
            ) : null}

            {description ? (
              <Box
                style={{
                  marginTop: "0.2rem",
                  fontSize: "var(--ui-font-size-xs)",
                  color: "var(--ui-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                {description}
              </Box>
            ) : null}
          </Box>
        ) : null}

        <Stack spacing="0.5rem">{children}</Stack>
      </Box>
    );
  }
);

ListSection.displayName = "List.Section";

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      children,
      title,
      description,
      leading,
      trailing,
      value,
      selected = false,
      disabled = false,
      showChevron = false,
      onPress,
      onLongPress,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const { density, divided } = React.useContext(ListContext);
    const interactive = Boolean(onPress || onLongPress);

    const content = (
      <>
        {leading ? (
          <Box
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--ui-text-muted)",
              lineHeight: 1,
            }}
          >
            {leading}
          </Box>
        ) : null}

        <Box
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.18rem",
          }}
        >
          {children ?? (
            <>
              {title ? (
                <Box
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "var(--ui-font-size-sm)",
                    fontWeight: "var(--ui-font-weight-medium)",
                    color: disabled
                      ? "var(--ui-text-muted)"
                      : "var(--ui-text)",
                  }}
                >
                  {title}
                </Box>
              ) : null}

              {description ? (
                <Box
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "var(--ui-font-size-xs)",
                    color: "var(--ui-text-muted)",
                    lineHeight: 1.35,
                  }}
                >
                  {description}
                </Box>
              ) : null}
            </>
          )}
        </Box>

        {value ? (
          <Box
            style={{
              flexShrink: 0,
              maxWidth: "40%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "var(--ui-font-size-sm)",
              color: "var(--ui-text-muted)",
            }}
          >
            {value}
          </Box>
        ) : null}

        {trailing ? (
          <Box
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--ui-text-muted)",
              lineHeight: 1,
            }}
          >
            {trailing}
          </Box>
        ) : null}

        {showChevron ? (
          <Box
            aria-hidden="true"
            style={{
              flexShrink: 0,
              color: "var(--ui-text-muted)",
              fontSize: "1.15rem",
              lineHeight: 1,
            }}
          >
            ›
          </Box>
        ) : null}
      </>
    );

    const baseStyle: React.CSSProperties = {
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.75rem",
      borderRadius: "var(--ui-radius-md)",
      borderBottom: divided ? "1px solid var(--ui-border)" : undefined,
      opacity: disabled ? 0.62 : undefined,
      ...getItemPadding(density),
      ...style,
    };

    return (
      <Box
        ref={ref as any}
        role="listitem"
        className={className}
        data-selected={selected || undefined}
        data-disabled={disabled || undefined}
        {...rest}
        style={{
          minWidth: 0,
        }}
      >
        {interactive ? (
          <Pressable
            as="div"
            disabled={disabled}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              ...baseStyle,
              cursor: disabled ? "not-allowed" : "pointer",
              color: "var(--ui-text)",
              background: getItemBackground({ selected }),
            }}
          >
            {({ pressed, hovered }) => (
              <Box
                style={{
                  width: "100%",
                  minWidth: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  background: getItemBackground({
                    selected,
                    pressed,
                    hovered,
                  }),
                }}
              >
                {content}
              </Box>
            )}
          </Pressable>
        ) : (
          <Box
            style={{
              ...baseStyle,
              background: getItemBackground({ selected }),
            }}
          >
            {content}
          </Box>
        )}
      </Box>
    );
  }
);

ListItem.displayName = "List.Item";

export const List = Object.assign(ListRoot, {
  Section: ListSection,
  Item: ListItem,
}) as ListComponent;

export { ListSection, ListItem };