// src/patterns/scaffold/ScreenContent.tsx
import React from "react";
import {
  cssSize,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
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

export interface ScreenContentSafeAreaEdges {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
}

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
  safeArea?: boolean | ScreenContentSafeAreaEdges;

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

function resolveSafeAreaEdges(
  safeArea: ScreenContentProps["safeArea"]
): ScreenContentSafeAreaEdges {
  if (!safeArea) {
    return {
      top: false,
      right: false,
      bottom: false,
      left: false,
    };
  }

  if (safeArea === true) {
    return {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }

  return {
    top: Boolean(safeArea.top),
    right: Boolean(safeArea.right),
    bottom: Boolean(safeArea.bottom),
    left: Boolean(safeArea.left),
  };
}

function addInset(
  value: string | undefined,
  inset: string,
  enabled: boolean
): string | undefined {
  if (!enabled) return value;
  if (!value) return `env(${inset}, 0px)`;

  return `calc(${value} + env(${inset}, 0px))`;
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
  const resolvedPadding = resolvePadding({ padded, padding });
  const edges = resolveSafeAreaEdges(safeArea);

  return {
    paddingTop: addInset(
      resolvedPadding,
      "safe-area-inset-top",
      edges.top ?? false
    ),
    paddingRight: addInset(
      resolvedPadding,
      "safe-area-inset-right",
      edges.right ?? false
    ),
    paddingBottom: addInset(
      resolvedPadding,
      "safe-area-inset-bottom",
      edges.bottom ?? false
    ),
    paddingLeft: addInset(
      resolvedPadding,
      "safe-area-inset-left",
      edges.left ?? false
    ),
  };
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

    const rootSlot = resolveSlot<ScreenContentSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-screen-content": "",
        "data-ui-screen-content-scrollable": scrollable || undefined,
      },
      baseStyle: {
        width: "100%",
        height: fill ? "100%" : undefined,
        minWidth: 0,
        minHeight: 0,
        boxSizing: "border-box",
      },
    });

    const scrollAreaSlot = resolveSlot<ScreenContentSlot>({
      slot: "scrollArea",
      styles,
      slotProps,
      baseStyle: {
        width: "100%",
        height: fill ? "100%" : undefined,
        minWidth: 0,
        minHeight: 0,
        boxSizing: "border-box",
      },
    });

    const contentSlot = resolveSlot<ScreenContentSlot>({
      slot: "content",
      styles,
      slotProps,
      baseProps: {
        "data-ui-screen-content-inner": "",
      },
      baseStyle: {
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
      },
    });

    if (scrollable) {
      return (
        <ScrollArea
          ref={ref}
          axis={axis}
          scrollbar={scrollbar}
          contain={contain}
          momentum={momentum}
          touchAction={touchAction}
          {...rest}
          {...rootSlot}
          style={{
            ...rootSlot.style,
            ...scrollAreaSlot.style,
          }}
        >
          <Box {...contentSlot}>{children}</Box>
        </ScrollArea>
      );
    }

    return (
      <Box
        ref={ref}
        {...rest}
        {...rootSlot}
        style={{
          ...rootSlot.style,
          overflow: "hidden",
          display: centered ? "grid" : undefined,
          placeItems: centered ? "center" : undefined,
          ...paddingStyles,
        }}
      >
        {children}
      </Box>
    );
  }
);

ScreenContent.displayName = "ScreenContent";