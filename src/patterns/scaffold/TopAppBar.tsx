// src/patterns/scaffold/TopAppBar.tsx

import React from "react";

import {
  hasRenderableNode,
} from "../../core/react/nodePresence";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { getSafeAreaOffset } from "../../helpers/safeArea";

import {
  Box,
  Flex,
} from "../../primitives/layout";

import { Typography } from "../../primitives/typography";


/**
 * Tamaños visuales disponibles para la barra superior.
 */
export type TopAppBarSize =
  | "sm"
  | "md"
  | "lg";


/**
 * Variantes visuales de superficie.
 */
export type TopAppBarVariant =
  | "solid"
  | "transparent"
  | "blur";


/**
 * Slots de composición.
 *
 * TopAppBar está diseñado para ser extendido
 * mediante slots, no mediante conocimiento
 * de conceptos de aplicación.
 */
export type TopAppBarSlot =
  | "root"
  | "content"
  | "leading"
  | "center"
  | "title"
  | "subtitle"
  | "actions";


export type TopAppBarStyles =
  SlotStyleMap<TopAppBarSlot>;


export type TopAppBarSlotProps =
  SlotPropsMap<TopAppBarSlot>;


/**
 * Barra superior genérica de interfaz.
 *
 * Responsabilidades:
 *
 * - estructura visual superior
 * - título y subtítulo
 * - zonas leading, center y actions
 * - comportamiento sticky
 * - safe-area superior
 * - composición mediante slots
 *
 *
 * No conoce:
 *
 * - routing
 * - NavigationNode
 * - sidebar
 * - tabs
 * - autenticación
 * - usuarios
 * - logout
 * - temas
 *
 *
 * Las capacidades específicas de una aplicación
 * deben entrar mediante composición.
 *
 * Ejemplo:
 *
 * <TopAppBar
 *   actions={
 *     <>
 *       <ThemeSwitcher />
 *       <UserMenu />
 *     </>
 *   }
 * />
 */
export interface TopAppBarProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "title"
  > {


  /**
   * Título principal.
   */
  title?: React.ReactNode;


  /**
   * Información secundaria debajo del título.
   */
  subtitle?: React.ReactNode;


  /**
   * Contenido visual izquierdo.
   *
   * Ejemplos:
   *
   * - botón atrás
   * - logo
   * - menú
   * - navegación contextual
   */
  leading?: React.ReactNode;


  /**
   * Acciones contextuales de la aplicación.
   *
   * Ejemplos:
   *
   * - botones
   * - UserMenu
   * - ThemeSwitcher
   * - comandos
   *
   * TopAppBar no conoce la naturaleza
   * de estas acciones.
   */
  actions?: React.ReactNode;


  /**
   * Slot central personalizado.
   *
   * Cuando existe reemplaza title/subtitle.
   *
   * Casos de uso:
   *
   * - búsqueda global
   * - breadcrumbs
   * - tabs
   * - filtros
   * - estado contextual
   */
  center?: React.ReactNode;


  size?: TopAppBarSize;

  variant?: TopAppBarVariant;


  /**
   * Aplica safe-area-top directamente
   * sobre la barra.
   */
  safeAreaTop?: boolean;


  /**
   * Mantiene la barra pegada arriba
   * dentro de su contenedor.
   */
  sticky?: boolean;


  /**
   * Centra title/subtitle dentro del espacio disponible
   * entre leading y actions.
   *
   * La zona central permanece en el flujo del layout para
   * evitar solapamientos cuando las acciones cambian de ancho.
   */
  centerTitle?: boolean;


  className?: string;

  style?: React.CSSProperties;


  styles?: TopAppBarStyles;

  slotProps?: TopAppBarSlotProps;
}


const TOP_APP_BAR_SIZE_MAP: Record<
  TopAppBarSize,
  {
    minHeight: number;
    paddingInline: string;
    titleRole:
      "title" |
      "headline";
    subtitleRole:
      "caption" |
      "label";
  }
> = {

  sm: {
    minHeight: 48,
    paddingInline: "0.65rem",
    titleRole:
      "title",
    subtitleRole:
      "caption",
  },

  md: {
    minHeight: 56,
    paddingInline: "0.85rem",
    titleRole:
      "title",
    subtitleRole:
      "caption",
  },

  lg: {
    minHeight: 68,
    paddingInline: "1rem",
    titleRole:
      "headline",
    subtitleRole:
      "label",
  },
};




function getVariantStyles(
  variant: TopAppBarVariant
): Pick<
  React.CSSProperties,
  | "background"
  | "borderBottom"
  | "backdropFilter"
  | "WebkitBackdropFilter"
> {

  if (variant === "transparent") {
    return {
      background: "transparent",
      borderBottom:
        "1px solid transparent",
    };
  }


  if (variant === "blur") {
    return {
      background:
        "color-mix(in srgb, var(--ui-surface) 88%, transparent)",

      borderBottom:
        "1px solid var(--ui-border)",

      backdropFilter:
        "blur(14px)",

      WebkitBackdropFilter:
        "blur(14px)",
    };
  }


  return {
    background:
      "var(--ui-surface)",

    borderBottom:
      "1px solid var(--ui-border)",
  };
}

export const TopAppBar =
  React.forwardRef<
    HTMLElement,
    TopAppBarProps
  >(
    (
      {
        title,
        subtitle,

        leading,
        actions,

        center,

        size = "md",
        variant = "blur",

        safeAreaTop = false,

        sticky = false,

        centerTitle = false,

        className = "",

        style,

        styles,

        slotProps,

        ...rest
      },
      ref
    ) => {
      const sizeStyles =
        TOP_APP_BAR_SIZE_MAP[size];

      const hasTitle =
        hasRenderableNode(title);

      const hasSubtitle =
        hasRenderableNode(subtitle);

      const hasLeading =
        hasRenderableNode(leading);

      const hasCustomCenter =
        center !== null &&
        center !== undefined;


      const rootSlot =
        resolveSlot<TopAppBarSlot>({
          slot: "root",

          styles,

          slotProps,

          className,

          style,


          baseProps: {
            "data-ui-top-app-bar": "",

            "data-ui-top-app-bar-size":
              size,

            "data-ui-top-app-bar-variant":
              variant,
          },


          baseStyle: {
            position:
              sticky
                ? "sticky"
                : "relative",

            top:
              sticky
                ? 0
                : undefined,

            zIndex:
              sticky
                ? 20
                : undefined,


            width: "100%",

            minWidth: 0,

            boxSizing:
              "border-box",


            paddingTop:
              safeAreaTop
                ? getSafeAreaOffset("top")
                : undefined,


            ...getVariantStyles(
              variant
            ),


            color:
              "var(--ui-text)",
          },
        });



      /*
       * La distribución pertenece a los slots: styles y slotProps deben
       * poder reemplazarla sin que Flex vuelva a imponer defaults en JSX.
       */
      const contentSlot =
        resolveSlot<TopAppBarSlot>({
          slot: "content",

          styles,

          slotProps,


          baseStyle: {
            position:
              "relative",

            minWidth: 0,

            minHeight:
              sizeStyles.minHeight,

            paddingInline:
              sizeStyles.paddingInline,

            boxSizing:
              "border-box",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              "0.75rem",
          },
        });



      /*
       * Each edge zone owns its geometry boundary. Responsive composition
       * decides which actions to render; the app bar prevents a wide child
       * from escaping its negotiated flex area and overlapping another zone.
       */
      const leadingSlot =
        resolveSlot<TopAppBarSlot>({
          slot: "leading",

          styles,

          slotProps,


          baseStyle: {
            minWidth: 0,

            flex:
              centerTitle
                ? "0 1 auto"
                : "1 1 0",

            overflow:
              "hidden",

            position:
              "relative",

            zIndex:
              2,

            alignItems:
              "center",

            gap:
              "0.55rem",
          },
        });



      const centerSlot =
        resolveSlot<TopAppBarSlot>({
          slot: "center",

          styles,

          slotProps,


          baseStyle: {
            minWidth: 0,

            flex:
              centerTitle
                ? "1 1 auto"
                : undefined,

            overflow:
              "hidden",

            textAlign:
              centerTitle
                ? "center"
                : "left",
          },
        });



      const titleSlot =
        resolveSlot<TopAppBarSlot>({
          slot: "title",

          styles,

          slotProps,


          baseStyle: {
            margin: 0,

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace:
              "nowrap",

            color:
              "var(--ui-text)",
          },
        });



      const subtitleSlot =
        resolveSlot<TopAppBarSlot>({
          slot: "subtitle",

          styles,

          slotProps,


          baseStyle: {
            marginTop:
              "0.12rem",

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace:
              "nowrap",
          },
        });



      const actionsSlot =
        resolveSlot<TopAppBarSlot>({
          slot: "actions",

          styles,

          slotProps,


          baseStyle: {
            minWidth: 0,

            flex:
              centerTitle
                ? "0 1 auto"
                : "0 0 auto",

            overflow:
              "hidden",

            position:
              "relative",

            zIndex:
              2,

            alignItems:
              "center",

            justifyContent:
              "flex-end",

            gap:
              "0.35rem",
          },
        });



      /**
       * Cuando existe center:
       *
       * center tiene prioridad.
       *
       * Esto permite sustituir completamente
       * la jerarquía title/subtitle.
       */
      const centerContent =
        hasCustomCenter ? (
          center
        ) : (
          <>
            {hasTitle ? (
              <Typography
                as="div"
                typographyRole={
                  sizeStyles.titleRole
                }
                {...titleSlot}
              >
                {title}
              </Typography>
            ) : null}


            {hasSubtitle ? (
              <Typography
                as="div"
                typographyRole={
                  sizeStyles.subtitleRole
                }
                color="var(--ui-text-muted)"
                {...subtitleSlot}
              >
                {subtitle}
              </Typography>
            ) : null}
          </>
        );


      const titleContent = (
        <Box {...centerSlot}>
          {centerContent}
        </Box>
      );


      return (
        <Box
          as="header"
          ref={ref}
          {...rest}
          {...rootSlot}
        >

          <Flex
            {...contentSlot}
          >

            <Flex
              {...leadingSlot}
            >

              {
                hasLeading ? (
                  <Box
                    style={{
                      display:
                        "inline-flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      flexShrink:
                        0,
                    }}
                  >
                    {leading}
                  </Box>
                ) : null
              }


              {
                !centerTitle
                  ? titleContent
                  : null
              }

            </Flex>



            {
              centerTitle
                ? titleContent
                : null
            }



            <Flex
              {...actionsSlot}
            >
              {actions}
            </Flex>


          </Flex>

        </Box>
      );
    }
  );


TopAppBar.displayName =
  "TopAppBar";