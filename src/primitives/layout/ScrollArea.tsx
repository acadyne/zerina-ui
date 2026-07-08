// src/primitives/layout/ScrollArea.tsx
import React from "react";
import { Box, type BoxProps } from "./Box";

export type ScrollAreaAxis = "x" | "y" | "both";

export type ScrollAreaScrollbar = "native" | "thin" | "hidden";

export interface ScrollAreaProps extends BoxProps<"div"> {
  children?: React.ReactNode;

  /**
   * Eje de scroll.
   *
   * y:
   *   Scroll vertical, bloquea overflow horizontal.
   *
   * x:
   *   Scroll horizontal, bloquea overflow vertical.
   *
   * both:
   *   Permite scroll en ambos ejes.
   */
  axis?: ScrollAreaAxis;

  /**
   * Si está activo, evita scroll chaining hacia padres.
   */
  contain?: boolean;

  /**
   * Activa momentum scrolling en iOS/WebKit.
   */
  momentum?: boolean;

  /**
   * Controla el touch-action del área.
   *
   * Por defecto:
   * - y    -> pan-y
   * - x    -> pan-x
   * - both -> pan-x pan-y
   */
  touchAction?: React.CSSProperties["touchAction"];

  /**
   * Estilo visual de scrollbar.
   *
   * native:
   *   Scrollbar del sistema.
   *
   * thin:
   *   Scrollbar delgada vía CSS estándar/WebKit.
   *
   * hidden:
   *   Oculta scrollbar manteniendo scroll.
   */
  scrollbar?: ScrollAreaScrollbar;
}

function getOverflowStyles(
  axis: ScrollAreaAxis
): Pick<React.CSSProperties, "overflowX" | "overflowY"> {
  if (axis === "x") {
    return {
      overflowX: "auto",
      overflowY: "hidden",
    };
  }

  if (axis === "both") {
    return {
      overflowX: "auto",
      overflowY: "auto",
    };
  }

  return {
    overflowX: "hidden",
    overflowY: "auto",
  };
}

function getDefaultTouchAction(
  axis: ScrollAreaAxis
): React.CSSProperties["touchAction"] {
  if (axis === "x") return "pan-x";
  if (axis === "both") return "pan-x pan-y";
  return "pan-y";
}

function getScrollbarClassName(scrollbar: ScrollAreaScrollbar): string {
  if (scrollbar === "thin") return "ui-scrollarea--thin";
  if (scrollbar === "hidden") return "ui-scrollarea--hidden";
  return "";
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      axis = "y",
      contain = true,
      momentum = true,
      touchAction,
      scrollbar = "native",
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const scrollbarClassName = getScrollbarClassName(scrollbar);
    const overflowStyles = getOverflowStyles(axis);

    return (
      <Box
        ref={ref}
        className={[className, scrollbarClassName].filter(Boolean).join(" ")}
        {...rest}
        style={{
          width: "100%",
          minWidth: 0,
          minHeight: 0,
          boxSizing: "border-box",
          ...overflowStyles,
          overscrollBehavior: contain ? "contain" : undefined,
          WebkitOverflowScrolling: momentum ? "touch" : undefined,
          touchAction: touchAction ?? getDefaultTouchAction(axis),
          ...style,
        }}
      >
        {children}
      </Box>
    );
  }
);

ScrollArea.displayName = "ScrollArea";