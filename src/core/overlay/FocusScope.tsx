// src/core/overlay/FocusScope.tsx

import React from "react";
import {
  setRef,
} from "../interaction/events";
import {
  attemptFocus,
} from "../interaction/focus/attemptFocus";
import {
  collectComposedFocusCandidates,
} from "../interaction/focus/focusNavigation";
import {
  getDeepActiveElement,
  getNodeEventRoot,
  isComposedDescendantOf,
  isEventInsideNode,
  type DOMEventRoot,
} from "../dom";
import {
  useOverlayInstanceContext,
} from "./DismissableLayer";

function getBestInitialFocusTarget(
  focusable: HTMLElement[],
  fallback: HTMLElement
): HTMLElement {
  return (
    focusable.find(
      (element) =>
        element.tagName ===
        "INPUT"
    ) ||
    focusable.find(
      (element) =>
        element.tagName ===
        "TEXTAREA"
    ) ||
    focusable.find(
      (element) =>
        element.tagName ===
        "SELECT"
    ) ||
    focusable.find(
      (element) =>
        element.tagName ===
        "BUTTON"
    ) ||
    focusable[0] ||
    fallback
  );
}

export interface FocusScopeProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "tabIndex"
  > {
  children?: React.ReactNode;

  contain?: boolean;
  autoFocus?: boolean;

  initialFocusRef?:
    React.RefObject<
      HTMLElement | null
    >;
}

export const FocusScope =
  React.forwardRef<
    HTMLDivElement,
    FocusScopeProps
  >(
    (
      {
        children,

        contain = true,
        autoFocus = true,

        initialFocusRef,

        ...rest
      },
      ref
    ) => {
      const {
        interactive,
        isTopmost,

        ownerDocument:
          overlayDocument,
      } =
        useOverlayInstanceContext();

      const localRef =
        React.useRef<
          HTMLDivElement | null
        >(null);

      const hasAutoFocusedRef =
        React.useRef(false);

      const setRefs =
        React.useCallback(
          (
            node:
              HTMLDivElement | null
          ) => {
            localRef.current =
              node;

            setRef(
              ref,
              node
            );
          },
          [ref]
        );

      React.useEffect(() => {
        if (!interactive) {
          hasAutoFocusedRef
            .current =
            false;

          return;
        }

        if (
          !autoFocus ||
          !isTopmost ||
          hasAutoFocusedRef
            .current
        ) {
          return;
        }

        const container =
          localRef.current;

        const ownerWindow =
          container
            ?.ownerDocument
            .defaultView;

        if (
          !container ||
          !ownerWindow
        ) {
          return;
        }

        const frameId =
          ownerWindow
            .requestAnimationFrame(
              () => {
                const currentContainer =
                  localRef.current;

                if (
                  !currentContainer ||
                  !currentContainer
                    .isConnected
                ) {
                  return;
                }

                const explicitTarget =
                  initialFocusRef
                    ?.current;

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
                  hasAutoFocusedRef
                    .current =
                    true;

                  return;
                }

                const focusable =
                  collectComposedFocusCandidates(
                    currentContainer
                  );

                void attemptFocus(
                  getBestInitialFocusTarget(
                    focusable,
                    currentContainer
                  )
                );

                /*
                 * El ciclo registra el intento aunque el navegador rechace el
                 * candidato. Reintentar en cada efecto produciría bucles.
                 */
                hasAutoFocusedRef
                  .current =
                  true;
              }
            );

        return () => {
          ownerWindow
            .cancelAnimationFrame(
              frameId
            );
        };
      }, [
        autoFocus,
        initialFocusRef,
        interactive,
        isTopmost,
      ]);

      React.useEffect(() => {
        if (
          !interactive ||
          !contain
        ) {
          return;
        }

        const container =
          localRef.current;

        if (!container) {
          return;
        }

        const ownerDocument =
          container.ownerDocument;

        const eventRoot =
          getNodeEventRoot(
            container
          );

        const roots:
          DOMEventRoot[] =
          eventRoot ===
            ownerDocument
            ? [
                ownerDocument,
              ]
            : [
                eventRoot,
                ownerDocument,
              ];

        const processedKeyEvents =
          new WeakSet<Event>();

        const processedFocusEvents =
          new WeakSet<Event>();

        const handleKeyDown =
          (
            event:
              Event
          ) => {
            if (
              processedKeyEvents
                .has(event)
            ) {
              return;
            }

            processedKeyEvents
              .add(event);

            const keyboardEvent =
              event as
                KeyboardEvent;

            if (
              !isTopmost ||
              keyboardEvent.key !==
                "Tab"
            ) {
              return;
            }

            const currentContainer =
              localRef.current;

            if (
              !currentContainer
            ) {
              return;
            }

            const focusable =
              collectComposedFocusCandidates(
                currentContainer
              );

            if (
              !focusable.length
            ) {
              keyboardEvent
                .preventDefault();

              void attemptFocus(
                currentContainer
              );

              return;
            }

            const first =
              focusable[0];

            const last =
              focusable[
                focusable.length -
                  1
              ];

            const active =
              getDeepActiveElement(
                getNodeEventRoot(
                  currentContainer
                ),
                {
                  traverseIframes:
                    true,
                }
              );

            const activeInside =
              !!active &&
              isComposedDescendantOf(
                active,
                currentContainer
              );

            if (
              !activeInside
            ) {
              keyboardEvent
                .preventDefault();

              void attemptFocus(
                first
              );

              return;
            }

            if (
              keyboardEvent
                .shiftKey
            ) {
              if (
                active === first
              ) {
                keyboardEvent
                  .preventDefault();

                void attemptFocus(
                  last
                );
              }

              return;
            }

            if (
              active === last
            ) {
              keyboardEvent
                .preventDefault();

              void attemptFocus(
                first
              );
            }
          };

        const handleFocusIn =
          (
            event:
              Event
          ) => {
            if (
              processedFocusEvents
                .has(event)
            ) {
              return;
            }

            processedFocusEvents
              .add(event);

            if (!isTopmost) {
              return;
            }

            const currentContainer =
              localRef.current;

            if (
              !currentContainer ||
              isEventInsideNode(
                event,
                currentContainer
              )
            ) {
              return;
            }

            const focusable =
              collectComposedFocusCandidates(
                currentContainer
              );

            void attemptFocus(
              getBestInitialFocusTarget(
                focusable,
                currentContainer
              )
            );
          };

        roots.forEach(
          (root) => {
            root.addEventListener(
              "keydown",
              handleKeyDown
            );

            root.addEventListener(
              "focusin",
              handleFocusIn
            );
          }
        );

        return () => {
          roots.forEach(
            (root) => {
              root.removeEventListener(
                "keydown",
                handleKeyDown
              );

              root.removeEventListener(
                "focusin",
                handleFocusIn
              );
            }
          );
        };
      }, [
        contain,
        interactive,
        isTopmost,
        overlayDocument,
      ]);

      return (
        <div
          {...rest}
          ref={setRefs}
          tabIndex={-1}
        >
          {children}
        </div>
      );
    }
  );

FocusScope.displayName =
  "FocusScope";
