// src/core/overlay/FocusScope.tsx

import React from "react";
import { setRef } from "../interaction/events";
import { attemptFocus } from "../interaction/focus/attemptFocus";
import {
  FOCUSABLE_CANDIDATE_SELECTOR,
  isSequentialFocusCandidate,
} from "../interaction/focus/focusability";
import { useIsomorphicLayoutEffect } from "../react/useIsomorphicLayoutEffect";
import {
  getDeepActiveElement,
  getNodeEventRoot,
  isComposedDescendantOf,
  isEventInsideNode,
  type DOMEventRoot,
} from "../dom";
import { useOverlayInstanceContext } from "./DismissableLayer";

function getPreviousFocusTarget(
  container: HTMLElement,
  sourceDocument: Document | null
): HTMLElement | null {
  const ownerDocument =
    container.ownerDocument;

  /*
   * La restauración conserva deliberadamente el comportamiento previo de
   * atravesar iframes same-origin. El cruce queda explícito aquí; la primitiva
   * central permanece limitada a su Document salvo que el consumidor lo pida.
   */
  if (
    sourceDocument &&
    sourceDocument !==
      ownerDocument
  ) {
    return getDeepActiveElement(
      sourceDocument,
      {
        traverseIframes: true,
      }
    );
  }

  return getDeepActiveElement(
    getNodeEventRoot(
      container
    ),
    {
      traverseIframes: true,
    }
  );
}

function getDOMSequentialFocusCandidates(
  container: HTMLElement
): HTMLElement[] {
  /*
   * FocusScope conserva aquí únicamente el descubrimiento de sus descendientes
   * DOM. La clasificación de cada elemento pertenece a la frontera de foco.
   */
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      FOCUSABLE_CANDIDATE_SELECTOR
    )
  ).filter(
    isSequentialFocusCandidate
  );
}

function getBestInitialFocusTarget(
  focusable: HTMLElement[],
  fallback: HTMLElement
): HTMLElement {
  return (
    focusable.find((element) => element.tagName === "INPUT") ||
    focusable.find((element) => element.tagName === "TEXTAREA") ||
    focusable.find((element) => element.tagName === "SELECT") ||
    focusable.find((element) => element.tagName === "BUTTON") ||
    focusable[0] ||
    fallback
  );
}

export interface FocusScopeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "tabIndex"> {
  children?: React.ReactNode;

  contain?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;

  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export const FocusScope = React.forwardRef<HTMLDivElement, FocusScopeProps>(
  (
    {
      children,
      contain = true,
      autoFocus = true,
      restoreFocus = true,
      initialFocusRef,
      ...rest
    },
    ref
  ) => {
    const {
      enabled,
      isTopmost,
      ownerDocument: overlayDocument,
      sourceDocument,
    } = useOverlayInstanceContext();
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const focusCycleRef = React.useRef<{
      active: boolean;
      target: HTMLElement | null;
    }>({
      active: false,
      target: null,
    });
    const restoreFocusRef = React.useRef(restoreFocus);
    const hasAutoFocusedRef = React.useRef(false);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        setRef(ref, node);
      },
      [ref]
    );

    const releaseFocusCycle =
      React.useCallback(() => {
        const cycle = focusCycleRef.current;

        if (!cycle.active) {
          return;
        }

        cycle.active = false;

        const target = cycle.target;
        cycle.target = null;

        if (
          !restoreFocusRef.current ||
          !target ||
          typeof target.focus !== "function" ||
          !target.isConnected
        ) {
          return;
        }

        void attemptFocus(
          target
        );
      }, []);

    /*
     * Este efecto reconcilia transiciones de actividad después del commit.
     * Cambiar restoreFocus solo actualiza la configuración del ciclo vigente;
     * no lo libera ni restaura foco mientras el overlay continúa abierto.
     */
    useIsomorphicLayoutEffect(() => {
      restoreFocusRef.current = restoreFocus;

      const cycle = focusCycleRef.current;

      if (enabled && !cycle.active) {
        const container = localRef.current;

        cycle.active = true;
        cycle.target = container
          ? getPreviousFocusTarget(
              container,
              sourceDocument
            )
          : null;

        hasAutoFocusedRef.current = false;
        return;
      }

      if (!enabled && cycle.active) {
        releaseFocusCycle();
      }
    });

    useIsomorphicLayoutEffect(() => {
      return () => {
        releaseFocusCycle();
      };
    }, [releaseFocusCycle]);

    React.useEffect(() => {
      if (!enabled || !autoFocus || !isTopmost) return;
      if (hasAutoFocusedRef.current) return;

      const container = localRef.current;
      const ownerWindow = container?.ownerDocument.defaultView;

      if (!container || !ownerWindow) {
        return;
      }

      const frameId = ownerWindow.requestAnimationFrame(() => {
        const currentContainer = localRef.current;

        if (!currentContainer || !currentContainer.isConnected) return;

        const explicitTarget = initialFocusRef?.current;

        if (
          explicitTarget &&
          isComposedDescendantOf(
            explicitTarget,
            currentContainer
          ) &&
          attemptFocus(
            explicitTarget
          )
        ) {
          hasAutoFocusedRef.current = true;
          return;
        }

        const focusable = getDOMSequentialFocusCandidates(currentContainer);

        void attemptFocus(
          getBestInitialFocusTarget(
            focusable,
            currentContainer
          )
        );

        /*
         * El ciclo registra el intento incluso cuando el navegador rechaza el
         * candidato final. Reintentar en cada efecto produciría bucles de foco.
         */
        hasAutoFocusedRef.current = true;
      });

      return () => {
        ownerWindow.cancelAnimationFrame(frameId);
      };
    }, [autoFocus, enabled, initialFocusRef, isTopmost]);

    React.useEffect(() => {
      if (!enabled || !contain) return;

      const container = localRef.current;

      if (!container) {
        return;
      }

      const ownerDocument = container.ownerDocument;
      const eventRoot = getNodeEventRoot(container);
      const roots: DOMEventRoot[] =
        eventRoot === ownerDocument
          ? [ownerDocument]
          : [eventRoot, ownerDocument];
      const processedKeyEvents = new WeakSet<Event>();
      const processedFocusEvents = new WeakSet<Event>();

      const handleKeyDown = (event: Event) => {
        if (processedKeyEvents.has(event)) return;
        processedKeyEvents.add(event);

        const keyboardEvent = event as KeyboardEvent;

        if (!isTopmost || keyboardEvent.key !== "Tab") return;

        const currentContainer = localRef.current;
        if (!currentContainer) return;

        const focusable = getDOMSequentialFocusCandidates(currentContainer);

        if (!focusable.length) {
          keyboardEvent.preventDefault();
          void attemptFocus(
            currentContainer
          );

          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active =
          getDeepActiveElement(
            getNodeEventRoot(
              currentContainer
            ),
            {
              traverseIframes: true,
            }
          );

        const activeInside =
          !!active &&
          isComposedDescendantOf(
            active,
            currentContainer
          );

        if (!activeInside) {
          keyboardEvent.preventDefault();
          void attemptFocus(
            first
          );

          return;
        }

        if (keyboardEvent.shiftKey) {
          if (active === first) {
            keyboardEvent.preventDefault();
            void attemptFocus(
              last
            );
          }
          return;
        }

        if (active === last) {
          keyboardEvent.preventDefault();
          void attemptFocus(
            first
          );
        }
      };

      const handleFocusIn = (event: Event) => {
        if (processedFocusEvents.has(event)) return;
        processedFocusEvents.add(event);
        if (!isTopmost) return;

        const currentContainer = localRef.current;
        if (!currentContainer || isEventInsideNode(event, currentContainer)) {
          return;
        }

        const focusable =
          getDOMSequentialFocusCandidates(
            currentContainer
          );

        void attemptFocus(
          getBestInitialFocusTarget(
            focusable,
            currentContainer
          )
        );
      };

      roots.forEach((root) => {
        root.addEventListener("keydown", handleKeyDown);
        root.addEventListener("focusin", handleFocusIn);
      });

      return () => {
        roots.forEach((root) => {
          root.removeEventListener("keydown", handleKeyDown);
          root.removeEventListener("focusin", handleFocusIn);
        });
      };
    }, [contain, enabled, isTopmost, overlayDocument]);

    return (
      <div {...rest} ref={setRefs} tabIndex={-1}>
        {children}
      </div>
    );
  }
);

FocusScope.displayName = "FocusScope";
