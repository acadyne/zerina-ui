// src/core/overlay/FloatingLayer.tsx
import React from "react";
import {
  getElementRect,
  useElementRect,
  useViewportSize,
  type ElementRect,
  type ViewportSize,
} from "../dom";

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

function getPlacementCandidates(
  placement: FloatingPlacement,
  flip: boolean
): FloatingPlacement[] {
  if (!flip) {
    return [placement];
  }

  const oppositeMap: Record<
    FloatingPlacement,
    FloatingPlacement
  > = {
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

  const opposite =
    oppositeMap[placement];

  return opposite === placement
    ? [placement]
    : [placement, opposite];
}

function computeCoordinates(
  triggerRect: ElementRect,
  floatingRect: ElementRect,
  placement: FloatingPlacement,
  offset: number
): FloatingCoordinates {
  switch (placement) {
    case "top":
      return {
        top:
          triggerRect.top -
          floatingRect.height -
          offset,

        left:
          triggerRect.left +
          triggerRect.width / 2 -
          floatingRect.width / 2,
      };

    case "bottom":
      return {
        top:
          triggerRect.bottom +
          offset,

        left:
          triggerRect.left +
          triggerRect.width / 2 -
          floatingRect.width / 2,
      };

    case "left":
      return {
        top:
          triggerRect.top +
          triggerRect.height / 2 -
          floatingRect.height / 2,

        left:
          triggerRect.left -
          floatingRect.width -
          offset,
      };

    case "right":
      return {
        top:
          triggerRect.top +
          triggerRect.height / 2 -
          floatingRect.height / 2,

        left:
          triggerRect.right +
          offset,
      };

    case "top-start":
      return {
        top:
          triggerRect.top -
          floatingRect.height -
          offset,

        left:
          triggerRect.left,
      };

    case "top-end":
      return {
        top:
          triggerRect.top -
          floatingRect.height -
          offset,

        left:
          triggerRect.right -
          floatingRect.width,
      };

    case "bottom-start":
      return {
        top:
          triggerRect.bottom +
          offset,

        left:
          triggerRect.left,
      };

    case "bottom-end":
      return {
        top:
          triggerRect.bottom +
          offset,

        left:
          triggerRect.right -
          floatingRect.width,
      };

    case "left-start":
      return {
        top:
          triggerRect.top,

        left:
          triggerRect.left -
          floatingRect.width -
          offset,
      };

    case "left-end":
      return {
        top:
          triggerRect.bottom -
          floatingRect.height,

        left:
          triggerRect.left -
          floatingRect.width -
          offset,
      };

    case "right-start":
      return {
        top:
          triggerRect.top,

        left:
          triggerRect.right +
          offset,
      };

    case "right-end":
      return {
        top:
          triggerRect.bottom -
          floatingRect.height,

        left:
          triggerRect.right +
          offset,
      };
  }
}

function fitsInViewport(
  coords: FloatingCoordinates,
  floatingRect: ElementRect,
  viewportSize: ViewportSize,
  viewportPadding: number
): boolean {
  return (
    coords.left >=
      viewportPadding &&
    coords.top >=
      viewportPadding &&
    coords.left +
        floatingRect.width <=
      viewportSize.width -
        viewportPadding &&
    coords.top +
        floatingRect.height <=
      viewportSize.height -
        viewportPadding
  );
}

function clampToViewport(
  coords: FloatingCoordinates,
  floatingRect: ElementRect,
  viewportSize: ViewportSize,
  viewportPadding: number
): FloatingCoordinates {
  const minLeft =
    viewportPadding;

  const minTop =
    viewportPadding;

  const maxLeft =
    Math.max(
      minLeft,

      viewportSize.width -
        floatingRect.width -
        viewportPadding
    );

  const maxTop =
    Math.max(
      minTop,

      viewportSize.height -
        floatingRect.height -
        viewportPadding
    );

  return {
    left:
      Math.min(
        Math.max(
          coords.left,
          minLeft
        ),
        maxLeft
      ),

    top:
      Math.min(
        Math.max(
          coords.top,
          minTop
        ),
        maxTop
      ),
  };
}

function resolvePosition(
  triggerRect: ElementRect,
  floatingRect: ElementRect,
  viewportSize: ViewportSize,
  placement: FloatingPlacement,
  offset: number,
  flip: boolean,
  shift: boolean,
  viewportPadding: number
): {
  coords: FloatingCoordinates;
  resolvedPlacement: FloatingPlacement;
} {
  const candidates =
    getPlacementCandidates(
      placement,
      flip
    );

  for (
    const candidate of
    candidates
  ) {
    const coords =
      computeCoordinates(
        triggerRect,
        floatingRect,
        candidate,
        offset
      );

    if (
      fitsInViewport(
        coords,
        floatingRect,
        viewportSize,
        viewportPadding
      )
    ) {
      return {
        coords,
        resolvedPlacement:
          candidate,
      };
    }
  }

  const fallbackPlacement =
    candidates[0];

  const rawCoords =
    computeCoordinates(
      triggerRect,
      floatingRect,
      fallbackPlacement,
      offset
    );

  return {
    coords: shift
      ? clampToViewport(
          rawCoords,
          floatingRect,
          viewportSize,
          viewportPadding
        )
      : rawCoords,

    resolvedPlacement:
      fallbackPlacement,
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
    | ((
        props: FloatingLayerRenderProps
      ) => React.ReactNode);

  anchorRef:
    React.RefObject<HTMLElement | null>;

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

export const FloatingLayer:
  React.FC<FloatingLayerProps> = ({
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
    const floatingRef =
      React.useRef<HTMLDivElement | null>(
        null
      );

    const [
      coords,
      setCoords,
    ] =
      React.useState<FloatingCoordinates | null>(
        null
      );

    const [
      resolvedPlacement,
      setResolvedPlacement,
    ] =
      React.useState<FloatingPlacement>(
        placement
      );

    const viewportSize =
      useViewportSize({
        ssrSafe: true,

        observeResize:
          open &&
          updateOnResize,
      });

    const anchorRect =
      useElementRect(
        anchorRef,
        {
          enabled: open,

          observeResize:
            updateOnResize,

          observeScroll:
            updateOnScroll,
        }
      );

    const floatingRect =
      useElementRect(
        floatingRef,
        {
          enabled: open,

          observeResize:
            updateOnResize,

          observeScroll: false,
        }
      );

    const setRef =
      React.useCallback(
        (
          node:
            | HTMLDivElement
            | null
        ) => {
          floatingRef.current =
            node;
        },
        []
      );

    const commitPosition =
      React.useCallback(
        (
          nextAnchorRect:
            ElementRect,

          nextFloatingRect:
            ElementRect
        ) => {
          if (
            !open ||
            nextAnchorRect.width <= 0 ||
            nextAnchorRect.height <= 0 ||
            nextFloatingRect.width <= 0 ||
            nextFloatingRect.height <= 0 ||
            viewportSize.width <= 0 ||
            viewportSize.height <= 0
          ) {
            return;
          }

          const next =
            resolvePosition(
              nextAnchorRect,
              nextFloatingRect,
              viewportSize,
              placement,
              offset,
              flip,
              shift,
              viewportPadding
            );

          setCoords(
            (currentCoords) => {
              if (
                currentCoords &&
                currentCoords.top ===
                  next.coords.top &&
                currentCoords.left ===
                  next.coords.left
              ) {
                return currentCoords;
              }

              return next.coords;
            }
          );

          setResolvedPlacement(
            (currentPlacement) =>
              currentPlacement ===
              next.resolvedPlacement
                ? currentPlacement
                : next.resolvedPlacement
          );
        },
        [
          flip,
          offset,
          open,
          placement,
          shift,
          viewportPadding,
          viewportSize,
        ]
      );

    const updatePosition =
      React.useCallback(() => {
        commitPosition(
          getElementRect(
            anchorRef.current
          ),

          getElementRect(
            floatingRef.current
          )
        );
      }, [
        anchorRef,
        commitPosition,
      ]);

    React.useLayoutEffect(() => {
      commitPosition(
        anchorRect,
        floatingRect
      );
    }, [
      anchorRect,
      commitPosition,
      floatingRect,
    ]);

    React.useEffect(() => {
      if (open) {
        return;
      }

      setCoords(null);

      setResolvedPlacement(
        placement
      );
    }, [
      open,
      placement,
    ]);

    if (!open) {
      return null;
    }

    const floatingStyle:
      React.CSSProperties = {
        position: strategy,

        top:
          coords?.top ??
          -9999,

        left:
          coords?.left ??
          -9999,

        zIndex,

        width:
          matchAnchorWidth &&
          anchorRect.width > 0
            ? anchorRect.width
            : undefined,

        ...style,
      };

    if (
      typeof children ===
      "function"
    ) {
      return (
        <>
          {children({
            ref: setRef,

            style:
              floatingStyle,

            placement:
              resolvedPlacement,

            updatePosition,
          })}
        </>
      );
    }

    return (
      <div
        ref={setRef}
        className={className}
        data-side={
          resolvedPlacement
        }
        style={floatingStyle}
      >
        {children}
      </div>
    );
  };

FloatingLayer.displayName =
  "FloatingLayer";