// src/core/overlay/DismissableLayer.tsx
import React from "react";
import { useIsOverlayTopmost, useOverlayRegistration } from "./OverlayProvider";
import { setRef } from "../interaction/events";

type DismissableLayerEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

type DismissableLayerBranchRef =
  React.RefObject<HTMLElement | null>;

function isEventInsideNode(
  event: PointerEvent,
  node: Node
): boolean {
  /*
   * composedPath conserva la pertenencia a través de shadow roots.
   * contains cubre el DOM regular y targets que no aparezcan en el path.
   */
  const path =
    typeof event.composedPath === "function"
      ? event.composedPath()
      : [];

  if (path.includes(node)) {
    return true;
  }

  const target = event.target;

  return (
    target instanceof Node &&
    node.contains(target)
  );
}

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

  /*
   * Nodos externos que pertenecen lógicamente al overlay, como su trigger.
   * Una interacción dentro de una branch no debe emitirse como outside.
   */
  branches?: readonly DismissableLayerBranchRef[];

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
      branches,
      onDismiss,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...rest
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);

    /*
     * El listener documental debe permanecer estable, pero siempre consultar
     * la lista más reciente y las refs vivas de las branches.
     */
    const branchesRef =
      React.useRef<
        readonly DismissableLayerBranchRef[]
      >([]);

    branchesRef.current =
      branches ?? [];

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        setRef(ref, node);
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

        if (
          isEventInsideNode(
            event,
            container
          )
        ) {
          return;
        }

        const insideBranch =
          branchesRef.current.some(
            (branchRef) => {
              const branch =
                branchRef.current;

              return (
                branch !== null &&
                isEventInsideNode(
                  event,
                  branch
                )
              );
            }
          );

        if (insideBranch) {
          return;
        }

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