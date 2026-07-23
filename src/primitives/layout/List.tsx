// src/primitives/layout/List.tsx
import React from "react";
import {
  Box,
  type BoxProps,
} from "./Box";
import {
  Pressable,
} from "../forms/Pressable";
import type {
  UIPressEvent,
} from "../../core/interaction";

export type ListDensity = "compact" | "comfortable" | "spacious";

export type ListVariant = "plain" | "surface" | "outlined";

export interface ListContextValue {
  density: ListDensity;

  spacing:
    React.CSSProperties["gap"];

  divided: boolean;
}

const ListContext =
  React.createContext<ListContextValue>({
    density: "comfortable",
    spacing: "0.5rem",
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

type ListItemSurfaceProps =
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    | "children"
    | "title"
    | "onClick"
  >;

interface ListItemBaseProps
  extends ListItemSurfaceProps {
  children?: React.ReactNode;

  title?: React.ReactNode;
  description?: React.ReactNode;

  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  value?: React.ReactNode;

  selected?: boolean;
  disabled?: boolean;

  showChevron?: boolean;
}

type StaticListItemProps =
  ListItemBaseProps & {
    onPress?: never;
    onLongPress?: never;
  };

type InteractiveListItemProps =
  ListItemBaseProps & {
    onPress: (
      event: UIPressEvent<HTMLElement>
    ) => void;

    onLongPress?: (
      event: UIPressEvent<HTMLElement>
    ) => void;
  };

export type ListItemProps =
  | StaticListItemProps
  | InteractiveListItemProps;

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

type ListItemStyle =
  React.CSSProperties & {
    "--ui-list-item-background"?:
      React.CSSProperties["background"];
  };

function hasRenderableNode(
  node: React.ReactNode
): boolean {
  return (
    node !== null &&
    node !== undefined
  );
}

const ListRoot =
  React.forwardRef<
    HTMLDivElement,
    ListProps
  >(
    (
      {
        children,
        density = "comfortable",
        variant = "plain",
        spacing =
          variant === "plain"
            ? "0.5rem"
            : 0,
        divided = false,
        style,
        ...rest
      },
      ref
    ) => {
      const contextValue =
        React.useMemo<ListContextValue>(
          () => ({
            density,
            spacing,
            divided,
          }),
          [
            density,
            spacing,
            divided,
          ]
        );

      return (
        <ListContext.Provider
          value={contextValue}
        >
          <Box
            {...rest}
            ref={ref}
            role="list"
            data-ui-list=""
            data-ui-list-items=""
            data-divided={
              divided ||
              undefined
            }
            style={{
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",

              display: "flex",
              flexDirection: "column",

              gap: spacing,

              ...getListVariantStyle(
                variant
              ),

              ...style,
            }}
          >
            {children}
          </Box>
        </ListContext.Provider>
      );
    }
  );

ListRoot.displayName = "List";

const ListSection =
  React.forwardRef<
    HTMLElement,
    ListSectionProps
  >(
    (
      {
        children,
        label,
        description,
        style,

        "aria-labelledby":
          ariaLabelledBy,

        "aria-describedby":
          ariaDescribedBy,

        ...rest
      },
      ref
    ) => {
      const {
        spacing,
        divided,
      } =
        React.useContext(
          ListContext
        );

      const generatedId =
        React.useId();

      const hasLabel =
        hasRenderableNode(label);

      const hasDescription =
        hasRenderableNode(
          description
        );

      const hasHeader =
        hasLabel ||
        hasDescription;

      const labelId =
        hasLabel
          ? `${generatedId}-label`
          : undefined;

      const descriptionId =
        hasDescription
          ? `${generatedId}-description`
          : undefined;

      return (
        <Box
          as="section"
          {...rest}
          ref={ref}
          role="listitem"
          data-ui-list-section=""
          aria-labelledby={
            ariaLabelledBy ??
            labelId
          }
          aria-describedby={
            ariaDescribedBy ??
            descriptionId
          }
          style={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",

            ...style,
          }}
        >
          {hasHeader ? (
            <Box
              as="header"
              style={{
                marginBottom:
                  "0.45rem",

                paddingInline:
                  "0.25rem",

                minWidth: 0,
              }}
            >
              {hasLabel ? (
                <Box
                  id={labelId}
                  style={{
                    fontSize:
                      "var(--ui-font-size-xs)",

                    fontWeight:
                      "var(--ui-font-weight-bold)",

                    color:
                      "var(--ui-text-muted)",

                    letterSpacing:
                      "0.06em",

                    textTransform:
                      "uppercase",
                  }}
                >
                  {label}
                </Box>
              ) : null}

              {hasDescription ? (
                <Box
                  id={
                    descriptionId
                  }
                  style={{
                    marginTop:
                      "0.2rem",

                    fontSize:
                      "var(--ui-font-size-xs)",

                    color:
                      "var(--ui-text-muted)",

                    lineHeight: 1.4,
                  }}
                >
                  {description}
                </Box>
              ) : null}
            </Box>
          ) : null}

          <Box
            role="list"
            data-ui-list-items=""
            data-divided={
              divided ||
              undefined
            }
            style={{
              width: "100%",
              minWidth: 0,

              display: "flex",
              flexDirection:
                "column",

              gap: spacing,
            }}
          >
            {children}
          </Box>
        </Box>
      );
    }
  );

ListSection.displayName =
  "List.Section";

const ListItem =
  React.forwardRef<
    HTMLDivElement,
    ListItemProps
  >(
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
      const { density } =
        React.useContext(
          ListContext
        );

      const interactive =
        onPress !== undefined;

      const {
        background,
        backgroundColor,
        ...consumerStyle
      } = style ?? {};

      const customBackground =
        background ??
        backgroundColor ??
        "transparent";

      const surfaceStyle:
        ListItemStyle = {
        width: "100%",
        minWidth: 0,
        minHeight: 0,

        boxSizing: "border-box",

        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",

        gap: "0.75rem",

        borderRadius:
          "var(--ui-radius-md)",

        color:
          "var(--ui-text)",

        opacity:
          disabled
            ? 0.62
            : undefined,

        cursor:
          interactive
            ? disabled
              ? "not-allowed"
              : "pointer"
            : undefined,

        ...getItemPadding(
          density
        ),

        ...consumerStyle,

        "--ui-list-item-background":
          customBackground,
      };

      const content = (
        <>
          {hasRenderableNode(
            leading
          ) ? (
            <Box
              style={{
                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexShrink: 0,

                color:
                  "var(--ui-text-muted)",

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
              flexDirection:
                "column",

              gap: "0.18rem",
            }}
          >
            {children ?? (
              <>
                {hasRenderableNode(
                  title
                ) ? (
                  <Box
                    style={{
                      minWidth: 0,

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",

                      fontSize:
                        "var(--ui-font-size-sm)",

                      fontWeight:
                        "var(--ui-font-weight-medium)",

                      color:
                        disabled
                          ? "var(--ui-text-muted)"
                          : "var(--ui-text)",
                    }}
                  >
                    {title}
                  </Box>
                ) : null}

                {hasRenderableNode(
                  description
                ) ? (
                  <Box
                    style={{
                      minWidth: 0,

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",

                      fontSize:
                        "var(--ui-font-size-xs)",

                      color:
                        "var(--ui-text-muted)",

                      lineHeight:
                        1.35,
                    }}
                  >
                    {description}
                  </Box>
                ) : null}
              </>
            )}
          </Box>

          {hasRenderableNode(
            value
          ) ? (
            <Box
              style={{
                flexShrink: 0,

                maxWidth: "40%",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",

                fontSize:
                  "var(--ui-font-size-sm)",

                color:
                  "var(--ui-text-muted)",
              }}
            >
              {value}
            </Box>
          ) : null}

          {hasRenderableNode(
            trailing
          ) ? (
            <Box
              style={{
                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexShrink: 0,

                color:
                  "var(--ui-text-muted)",

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

                color:
                  "var(--ui-text-muted)",

                fontSize:
                  "1.15rem",

                lineHeight: 1,
              }}
            >
              ›
            </Box>
          ) : null}
        </>
      );

      return (
        <Box
          role="listitem"
          data-ui-list-item-wrapper=""
          style={{
            width: "100%",
            minWidth: 0,
          }}
        >
          {interactive ? (
            <Pressable
              {...rest}
              ref={ref}
              as="div"
              disabled={disabled}
              onPress={onPress}
              onLongPress={
                onLongPress
              }
              className={
                className
              }
              data-ui-list-item=""
              data-selected={
                selected ||
                undefined
              }
              data-disabled={
                disabled ||
                undefined
              }
              style={
                surfaceStyle
              }
            >
              {content}
            </Pressable>
          ) : (
            <Box
              {...rest}
              ref={ref}
              className={
                className
              }
              data-ui-list-item=""
              data-selected={
                selected ||
                undefined
              }
              data-disabled={
                disabled ||
                undefined
              }
              style={
                surfaceStyle
              }
            >
              {content}
            </Box>
          )}
        </Box>
      );
    }
  );

ListItem.displayName =
  "List.Item";

export const List = Object.assign(ListRoot, {
  Section: ListSection,
  Item: ListItem,
}) as ListComponent;

export { ListSection, ListItem };