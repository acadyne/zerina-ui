// src/patterns/scaffold/ScreenContent.tsx
import React from "react";
import {
  cssSize,
  resolveMergedSlot,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import {
  getSafeAreaPadding,
  type SafeAreaEdges,
} from "../../helpers/safeArea";
import {
  Box,
  type BoxProps,
  ScrollArea,
  type ScrollAreaAxis,
  type ScrollAreaScrollbar,
} from "../../primitives/layout";

export type ScreenContentPadding =
  | "none"
  | "compact"
  | "comfortable"
  | "spacious"
  | number
  | string;

export type ScreenContentSlot = "root" | "scrollArea" | "content";

export type ScreenContentStyles = SlotStyleMap<ScreenContentSlot>;

export type ScreenContentSlotProps = SlotPropsMap<ScreenContentSlot>;

export interface ScreenContentProps
  extends Omit<BoxProps<"div">, "children"> {
  children?: React.ReactNode;

  /**
   * Atajo semántico.
   *
   * true:
   *   Usa padding comfortable.
   *
   * false:
   *   No aplica padding.
   */
  padded?: boolean;

  /**
   * Control explícito del padding.
   * Tiene prioridad sobre padded.
   */
  padding?: ScreenContentPadding;

  /**
   * true:
   *   ScreenContent controla su propio scroll.
   *
   * false:
   *   El contenido no agrega scroll propio.
   */
  scrollable?: boolean;

  axis?: ScrollAreaAxis;
  scrollbar?: ScrollAreaScrollbar;
  contain?: boolean;
  momentum?: boolean;
  touchAction?: React.CSSProperties["touchAction"];

  /**
   * Ocupa el alto disponible del padre.
   */
  fill?: boolean;

  /**
   * Centra el contenido en ambos ejes.
   * Útil para empty/loading/error states.
   */
  centered?: boolean;

  /**
   * Limita el ancho del contenido interno.
   */
  maxContentWidth?: number | string;

  /**
   * Centra horizontalmente el contenido cuando hay maxContentWidth.
   */
  centerContent?: boolean;

  /**
   * Suma safe-area al padding correspondiente.
   */
  safeArea?: boolean | SafeAreaEdges;

  className?: string;
  style?: React.CSSProperties;

  styles?: ScreenContentStyles;
  slotProps?: ScreenContentSlotProps;
}

function resolvePadding({
  padded,
  padding,
}: {
  padded: boolean;
  padding?: ScreenContentPadding;
}): string | undefined {
  if (padding !== undefined) {
    if (padding === "none") return undefined;
    if (padding === "compact") return "0.75rem";
    if (padding === "comfortable") return "1rem";
    if (padding === "spacious") return "1.25rem";

    return cssSize(padding);
  }

  return padded ? "1rem" : undefined;
}

function getPaddingStyles({
  padded,
  padding,
  safeArea,
}: {
  padded: boolean;
  padding?: ScreenContentPadding;
  safeArea?: ScreenContentProps["safeArea"];
}): React.CSSProperties {
  const resolvedPadding =
    resolvePadding({
      padded,
      padding,
    });

  return getSafeAreaPadding(
    safeArea,
    resolvedPadding
  );
}

export const ScreenContent = React.forwardRef<
  HTMLDivElement,
  ScreenContentProps
>(
  (
    {
      children,

      padded = false,
      padding,

      scrollable = false,
      axis = "y",
      scrollbar = "native",
      contain = true,
      momentum = true,
      touchAction,

      fill = true,
      centered = false,

      maxContentWidth,
      centerContent = true,

      safeArea = false,

      className = "",
      style,

      styles,
      slotProps,

      ...rest
    },
    ref
  ) => {
    const paddingStyles = getPaddingStyles({
      padded,
      padding,
      safeArea,
    });

    const rootBaseStyle: React.CSSProperties = {
      width: "100%",
      height: fill ? "100%" : undefined,
      minWidth: 0,
      minHeight: 0,
      boxSizing: "border-box",
    };

    const contentBaseStyle: React.CSSProperties = {
      width: "100%",
      maxWidth:
        maxContentWidth !== undefined
          ? cssSize(maxContentWidth)
          : undefined,
      minWidth: 0,
      minHeight: centered ? "100%" : 0,
      boxSizing: "border-box",
      marginLeft:
        centerContent && maxContentWidth !== undefined ? "auto" : undefined,
      marginRight:
        centerContent && maxContentWidth !== undefined ? "auto" : undefined,
      display: centered ? "grid" : undefined,
      placeItems: centered ? "center" : undefined,
      ...paddingStyles,
    };

    if (scrollable) {
      /*
       * root y scrollArea comparten el nodo físico en esta rama.
       * resolveMergedSlot conserva className, eventos, data/aria y estilos
       * de ambos; className y style públicos permanecen como capa final.
       */
      const scrollableRootSlot =
        resolveMergedSlot<ScreenContentSlot>({
          slots: [
            "root",
            "scrollArea",
          ],
          styles,
          slotProps,
          className,
          style,
          baseProps: {
            "data-ui-screen-content": "",
            "data-ui-screen-content-scrollable": true,
          },
          baseStyle: rootBaseStyle,
        });

      const contentSlot =
        resolveSlot<ScreenContentSlot>({
          slot: "content",
          styles,
          slotProps,
          baseProps: {
            "data-ui-screen-content-inner": "",
          },
          baseStyle: contentBaseStyle,
        });

      return (
        <ScrollArea
          ref={ref}
          axis={axis}
          scrollbar={scrollbar}
          contain={contain}
          momentum={momentum}
          touchAction={touchAction}
          {...rest}
          {...scrollableRootSlot}
        >
          <Box {...contentSlot}>{children}</Box>
        </ScrollArea>
      );
    }

    /*
     * Sin scroll, root y content colapsan sobre el mismo Box. Fusionarlos
     * preserva el contrato completo del slot content, incluido su data
     * attribute, en lugar de reconstruir únicamente sus estilos en JSX.
     */
    const staticRootSlot =
      resolveMergedSlot<ScreenContentSlot>({
        slots: [
          "root",
          "content",
        ],
        styles,
        slotProps,
        className,
        style,
        baseProps: {
          "data-ui-screen-content": "",
          "data-ui-screen-content-scrollable": undefined,
          "data-ui-screen-content-inner": "",
        },
        baseStyle: {
          ...rootBaseStyle,
          ...contentBaseStyle,
          overflow: "hidden",
        },
      });

    return (
      <Box
        ref={ref}
        {...rest}
        {...staticRootSlot}
      >
        {children}
      </Box>
    );
  }
);

ScreenContent.displayName = "ScreenContent";