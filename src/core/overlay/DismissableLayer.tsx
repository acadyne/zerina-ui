// src/core/overlay/DismissableLayer.tsx
import React from "react";
import { useIsOverlayTopmost, useOverlayRegistration } from "./OverlayProvider";

type DismissableLayerEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

function createDismissableEvent(): DismissableLayerEvent {
  let prevented = false;

  return {
    get defaultPrevented() {
      return prevented;
    },
    preventDefault() {
      prevented = true;
    },
  };
}

export interface DismissableLayerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  overlayId: string;
  layer: number;

  enabled?: boolean;
  dismissOnEscape?: boolean;
  dismissOnPointerDownOutside?: boolean;

  onDismiss?: () => void;
  onEscapeKeyDown?: (event: KeyboardEvent, context: DismissableLayerEvent) => void;
  onPointerDownOutside?: (
    event: PointerEvent,
    context: DismissableLayerEvent
  ) => void;
}

export const DismissableLayer = React.forwardRef<
  HTMLDivElement,
  DismissableLayerProps
>(
  (
    {
      children,
      overlayId,
      layer,
      enabled = true,
      dismissOnEscape = true,
      dismissOnPointerDownOutside = true,
      onDismiss,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...rest
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    useOverlayRegistration(overlayId, layer, enabled);
    const isTopmost = useIsOverlayTopmost(overlayId);

    React.useEffect(() => {
      if (!enabled) return;

      const handlePointerDown = (event: PointerEvent) => {
        if (!isTopmost) return;
        if (!dismissOnPointerDownOutside && !onPointerDownOutside) return;

        const container = localRef.current;
        if (!container) return;

        const target = event.target as Node | null;
        if (target && container.contains(target)) return;

        const context = createDismissableEvent();
        onPointerDownOutside?.(event, context);

        if (!context.defaultPrevented && dismissOnPointerDownOutside) {
          onDismiss?.();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isTopmost) return;
        if (event.key !== "Escape") return;
        if (!dismissOnEscape && !onEscapeKeyDown) return;

        const context = createDismissableEvent();
        onEscapeKeyDown?.(event, context);

        if (!context.defaultPrevented && dismissOnEscape) {
          event.preventDefault();
          onDismiss?.();
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [
      enabled,
      isTopmost,
      dismissOnPointerDownOutside,
      dismissOnEscape,
      onDismiss,
      onPointerDownOutside,
      onEscapeKeyDown,
    ]);

    return (
      <div ref={setRefs} {...rest}>
        {children}
      </div>
    );
  }
);

DismissableLayer.displayName = "DismissableLayer";