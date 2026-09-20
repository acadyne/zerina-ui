// src/primitives/layout/List.tsx
import React from "react";

import {
  hasRenderableNode,
} from "../../core/react/nodePresence";
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
import {
  useOptionalUIMotion,
} from "../../core/motion";

import type {
  UIDensity,
} from "../../core/viewport";

import {
  interactiveStateRecipe,
  typographyRecipe,
  type InteractiveStateRecipeStyle,
} from "../../theme/recipes";

export type ListDensity =
  UIDensity;

export type ListVariant = "plain" | "surface" | "outlined";

export interface ListContextValue {
  density?: ListDensity;

  spacing:
    React.CSSProperties["gap"];

  divided: boolean;
}

const ListContext =
  React.createContext<ListContextValue>({
    spacing:
      "var(--ui-density-block-gap, var(--ui-space-sm))",

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

type ListDensityMetric =
  | "item-min-height"
  | "inline-gap"
  | "block-gap"
  | "content-padding";


function getListDensityVariable(
  density:
    ListDensity | undefined,

  metric:
    ListDensityMetric,
): string {
  const variable =
    density === undefined
      ? `--ui-density-${metric}`
      : `--ui-density-${density}-${metric}`;

  return `var(${variable})`;
}


function getItemPadding(
  density?:
    ListDensity,
): React.CSSProperties {
  return {
    paddingBlock:
      getListDensityVariable(
        density,
        "block-gap",
      ),

    paddingInline:
      getListDensityVariable(
        density,
        "content-padding",
      ),

    minHeight:
      getListDensityVariable(
        density,
        "item-min-height",
      ),
  };
}

type ListItemStyle =
  React.CSSProperties &
  InteractiveStateRecipeStyle & {
    "--ui-list-item-background"?:
      React.CSSProperties["background"];
  };


const ListRoot =
  React.forwardRef<
    HTMLDivElement,
    ListProps
  >(
    (
      {
        children,
        density,
        variant = "plain",
        spacing,
        divided = false,
        style,
        ...rest
      },
      ref
    ) => {
      const motionState =
        useOptionalUIMotion();

      const resolvedSpacing =
        spacing ??
        (
          variant ===
          "plain"
            ? getListDensityVariable(
                density,
                "block-gap",
              )
            : 0
        );

      const contextValue =
        React.useMemo<ListContextValue>(
          () => ({
            density,
            spacing:
              resolvedSpacing,
            divided,
          }),
          [
            density,
            resolvedSpacing,
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
            data-ui-list-motion={
              motionState.effectiveLevel
            }
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

              gap:
                resolvedSpacing,

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
                  "var(--ui-density-block-gap, 0.45rem)",

                paddingInline:
                  "var(--ui-density-content-padding, 0.25rem)",

                minWidth: 0,
              }}
            >
              {hasLabel ? (
                <Box
                  id={labelId}
                  style={{
                    ...typographyRecipe({
                      role:
                        "caption",
                    }),

                    color:
                      "var(--ui-text-muted)",

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

                    ...typographyRecipe({
                      role:
                        "caption",
                    }),

                    color:
                      "var(--ui-text-muted)",
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

              gap:
                spacing,
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
        ...interactiveStateRecipe({
          tone:
            "primary",

          emphasis:
            "surface",
        }),

        "--ui-interactive-background":
          String(
            customBackground,
          ),

        width: "100%",
        minWidth: 0,
        minHeight: 0,

        boxSizing: "border-box",

        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",

        gap:
          "var(--ui-density-inline-gap, 0.75rem)",

        borderRadius:
          "var(--ui-radius-md)",

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

                      ...typographyRecipe({
                        role:
                          "label",
                      }),

                      color:
                        "inherit",
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

                      ...typographyRecipe({
                        role:
                          "caption",
                      }),

                      color:
                        "var(--ui-text-muted)",
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

                ...typographyRecipe({
                  role:
                    "label",
                }),

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
                  "var(--ui-density-icon-size, 1.15rem)",

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
              data-interactive=""
              data-ui-interactive=""
              data-ui-interactive-target=""
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