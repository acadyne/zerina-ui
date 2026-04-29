// src/core/overlay/FloatingLayer.tsx
import React from "react";

export type FloatingPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

type FloatingCoordinates = {
  top: number;
  left: number;
};

type RectLike = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

function getViewportRect(): RectLike {
  return {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getPlacementCandidates(
  placement: FloatingPlacement,
  flip: boolean
): FloatingPlacement[] {
  if (!flip) return [placement];

  const oppositeMap: Record<FloatingPlacement, FloatingPlacement> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
    "top-start": "bottom-start",
    "top-end": "bottom-end",
    "bottom-start": "top-start",
    "bottom-end": "top-end",
    "left-start": "right-start",
    "left-end": "right-end",
    "right-start": "left-start",
    "right-end": "left-end",
  };

  const opposite = oppositeMap[placement];
  return opposite && opposite !== placement ? [placement, opposite] : [placement];
}

function computeCoordinates(
  triggerRect: RectLike,
  floatingRect: RectLike,
  placement: FloatingPlacement,
  offset: number
): FloatingCoordinates {
  switch (placement) {
    case "top":
      return {
        top: triggerRect.top - floatingRect.height - offset,
        left: triggerRect.left + triggerRect.width / 2 - floatingRect.width / 2,
      };

    case "bottom":
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left + triggerRect.width / 2 - floatingRect.width / 2,
      };

    case "left":
      return {
        top: triggerRect.top + triggerRect.height / 2 - floatingRect.height / 2,
        left: triggerRect.left - floatingRect.width - offset,
      };

    case "right":
      return {
        top: triggerRect.top + triggerRect.height / 2 - floatingRect.height / 2,
        left: triggerRect.right + offset,
      };

    case "top-start":
      return {
        top: triggerRect.top - floatingRect.height - offset,
        left: triggerRect.left,
      };

    case "top-end":
      return {
        top: triggerRect.top - floatingRect.height - offset,
        left: triggerRect.right - floatingRect.width,
      };

    case "bottom-start":
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left,
      };

    case "bottom-end":
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.right - floatingRect.width,
      };

    case "left-start":
      return {
        top: triggerRect.top,
        left: triggerRect.left - floatingRect.width - offset,
      };

    case "left-end":
      return {
        top: triggerRect.bottom - floatingRect.height,
        left: triggerRect.left - floatingRect.width - offset,
      };

    case "right-start":
      return {
        top: triggerRect.top,
        left: triggerRect.right + offset,
      };

    case "right-end":
      return {
        top: triggerRect.bottom - floatingRect.height,
        left: triggerRect.right + offset,
      };

    default:
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left,
      };
  }
}

function fitsInViewport(
  coords: FloatingCoordinates,
  floatingRect: RectLike,
  viewportPadding: number
): boolean {
  const viewport = getViewportRect();

  return (
    coords.left >= viewport.left + viewportPadding &&
    coords.top >= viewport.top + viewportPadding &&
    coords.left + floatingRect.width <= viewport.right - viewportPadding &&
    coords.top + floatingRect.height <= viewport.bottom - viewportPadding
  );
}

function clampToViewport(
  coords: FloatingCoordinates,
  floatingRect: RectLike,
  viewportPadding: number
): FloatingCoordinates {
  const viewport = getViewportRect();

  const minLeft = viewport.left + viewportPadding;
  const minTop = viewport.top + viewportPadding;

  const maxLeft = Math.max(
    minLeft,
    viewport.right - floatingRect.width - viewportPadding
  );

  const maxTop = Math.max(
    minTop,
    viewport.bottom - floatingRect.height - viewportPadding
  );

  return {
    left: Math.min(Math.max(coords.left, minLeft), maxLeft),
    top: Math.min(Math.max(coords.top, minTop), maxTop),
  };
}

function resolvePosition(
  triggerRect: RectLike,
  floatingRect: RectLike,
  placement: FloatingPlacement,
  offset: number,
  flip: boolean,
  shift: boolean,
  viewportPadding: number
): { coords: FloatingCoordinates; resolvedPlacement: FloatingPlacement } {
  const candidates = getPlacementCandidates(placement, flip);

  for (const candidate of candidates) {
    const coords = computeCoordinates(triggerRect, floatingRect, candidate, offset);

    if (fitsInViewport(coords, floatingRect, viewportPadding)) {
      return {
        coords,
        resolvedPlacement: candidate,
      };
    }
  }

  const fallbackPlacement = candidates[0];
  const rawCoords = computeCoordinates(
    triggerRect,
    floatingRect,
    fallbackPlacement,
    offset
  );

  return {
    coords: shift
      ? clampToViewport(rawCoords, floatingRect, viewportPadding)
      : rawCoords,
    resolvedPlacement: fallbackPlacement,
  };
}

export interface FloatingLayerRenderProps {
  ref: React.Ref<HTMLDivElement>;
  style: React.CSSProperties;
  placement: FloatingPlacement;
  updatePosition: () => void;
}

export interface FloatingLayerProps {
  children:
    | React.ReactNode
    | ((props: FloatingLayerRenderProps) => React.ReactNode);

  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;

  placement?: FloatingPlacement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  viewportPadding?: number;

  zIndex?: number;
  strategy?: "fixed";

  className?: string;
  style?: React.CSSProperties;

  matchAnchorWidth?: boolean;
  updateOnResize?: boolean;
  updateOnScroll?: boolean;
}

export const FloatingLayer: React.FC<FloatingLayerProps> = ({
  children,
  anchorRef,
  open,
  placement = "bottom-start",
  offset = 8,
  flip = true,
  shift = true,
  viewportPadding = 8,
  zIndex,
  strategy = "fixed",
  className = "",
  style,
  matchAnchorWidth = false,
  updateOnResize = true,
  updateOnScroll = true,
}) => {
  const floatingRef = React.useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = React.useState<FloatingCoordinates | null>(null);
  const [resolvedPlacement, setResolvedPlacement] =
    React.useState<FloatingPlacement>(placement);

  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    floatingRef.current = node;
  }, []);

  const updatePosition = React.useCallback(() => {
    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;

    if (!open || !anchorEl || !floatingEl) {
      return;
    }

    const anchorRect = anchorEl.getBoundingClientRect();
    const floatingRect = floatingEl.getBoundingClientRect();

    const next = resolvePosition(
      anchorRect,
      floatingRect,
      placement,
      offset,
      flip,
      shift,
      viewportPadding
    );

    setCoords((prev) => {
      if (prev && prev.top === next.coords.top && prev.left === next.coords.left) {
        return prev;
      }

      return next.coords;
    });

    setResolvedPlacement((prev) =>
      prev === next.resolvedPlacement ? prev : next.resolvedPlacement
    );
  }, [anchorRef, open, placement, offset, flip, shift, viewportPadding]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  React.useEffect(() => {
    if (!open) return;

    const handleUpdate = () => {
      updatePosition();
    };

    if (updateOnResize) {
      window.addEventListener("resize", handleUpdate);
    }

    if (updateOnScroll) {
      window.addEventListener("scroll", handleUpdate, true);
    }

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(handleUpdate)
        : null;

    if (anchorRef.current) {
      ro?.observe(anchorRef.current);
    }

    if (floatingRef.current) {
      ro?.observe(floatingRef.current);
    }

    return () => {
      if (updateOnResize) {
        window.removeEventListener("resize", handleUpdate);
      }

      if (updateOnScroll) {
        window.removeEventListener("scroll", handleUpdate, true);
      }

      ro?.disconnect();
    };
  }, [open, updatePosition, updateOnResize, updateOnScroll, anchorRef]);

  React.useEffect(() => {
    if (!open) {
      setCoords(null);
      setResolvedPlacement(placement);
    }
  }, [open, placement]);

  if (!open) {
    return null;
  }

  const width = matchAnchorWidth
    ? anchorRef.current?.getBoundingClientRect().width
    : undefined;

  const floatingStyle: React.CSSProperties = {
    position: strategy,
    top: coords?.top ?? -9999,
    left: coords?.left ?? -9999,
    zIndex,
    width,
    ...style,
  };

  if (typeof children === "function") {
    return (
      <>
        {children({
          ref: setRef,
          style: floatingStyle,
          placement: resolvedPlacement,
          updatePosition,
        })}
      </>
    );
  }

  return (
    <div
      ref={setRef}
      className={className}
      data-side={resolvedPlacement}
      style={floatingStyle}
    >
      {children}
    </div>
  );
};

FloatingLayer.displayName = "FloatingLayer";