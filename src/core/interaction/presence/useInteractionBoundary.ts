import React from "react";

import {
  getDeepActiveElement,
  getNodeEventRoot,
  isComposedDescendantOf,
} from "../../dom";

import {
  useIsomorphicLayoutEffect,
} from "../../react/useIsomorphicLayoutEffect";

import {
  attemptFocus,
} from "../focus/attemptFocus";


function getPreviousFocusTarget(
  container:
    HTMLElement,

  sourceDocument:
    Document | null
):
  HTMLElement | null {
  const ownerDocument =
    container.ownerDocument;

  /*
   * Un árbol puede presentarse en un Document distinto del control que inició
   * el ciclo. El cruce same-origin permanece explícito en esta frontera.
   */
  if (
    sourceDocument &&
    sourceDocument !==
      ownerDocument
  ) {
    return getDeepActiveElement(
      sourceDocument,
      {
        traverseIframes:
          true,
      }
    );
  }

  return getDeepActiveElement(
    getNodeEventRoot(
      container
    ),
    {
      traverseIframes:
        true,
    }
  );
}


export interface UseInteractionBoundaryOptions<
  TElement extends
    HTMLElement,
> {
  /*
   * Indica si el sistema de presencia todavía considera vigente la instancia.
   *
   * Durante exit el nodo puede continuar montado aunque este valor ya sea false.
   */
  present:
    boolean;

  /*
   * Solicitud lógica del owner. La frontera exige también present=true para
   * conceder vigencia interactiva.
   */
  interactive:
    boolean;

  containerRef:
    React.RefObject<
      TElement | null
    >;

  /*
   * Solo realiza handoff cuando el foco profundo todavía permanece dentro del
   * árbol al perder vigencia interactiva.
   */
  restoreFocus?:
    boolean;

  /*
   * Target preferido. El elemento enfocado antes de iniciar el ciclo permanece
   * como fallback cuando este target no está conectado.
   */
  focusHandoffRef?:
    React.RefObject<
      HTMLElement | null
    >;

  sourceDocument?:
    Document | null;

  /*
   * Autoridad final del owner sobre un handoff concreto. La frontera no conoce
   * la causa por la que el owner pueda impedirlo.
   */
  shouldRestoreFocus?:
    () => boolean;
}


export interface InteractionBoundaryState {
  /*
   * Presencia y solicitud lógica reconciliadas.
   */
  interactive:
    boolean;

  /*
   * Solo cambia a true después de intentar evacuar el foco. El consumidor puede
   * entonces aplicar aria-hidden y pointer-events sin ocultar el foco vigente
   * durante el mismo commit.
   */
  interactionSuppressed:
    boolean;
}


/*
 * Esta frontera contiene únicamente el ciclo general:
 *
 * 1. al entrar en interactive=true abre un ciclo y recuerda el foco previo;
 * 2. al perder vigencia evacúa el foco cuando todavía permanece dentro;
 * 3. después confirma la supresión interactiva;
 * 4. sincroniza inert antes del siguiente paint.
 *
 * No posee Motion, posicionamiento, dismiss, registro, topmost ni trapping.
 */
export function useInteractionBoundary<
  TElement extends
    HTMLElement,
>({
  present,

  interactive:
    requestedInteractive,

  containerRef,

  restoreFocus =
    false,

  focusHandoffRef,

  sourceDocument =
    null,

  shouldRestoreFocus,
}: UseInteractionBoundaryOptions<TElement>):
  InteractionBoundaryState {
  const interactive =
    present &&
    requestedInteractive;

  const [
    interactionSuppressed,
    setInteractionSuppressed,
  ] =
    React.useState(
      !interactive
    );

  const focusCycleRef =
    React.useRef<{
      active:
        boolean;

      target:
        HTMLElement | null;
    }>({
      active:
        false,

      target:
        null,
    });

  const restoreFocusRef =
    React.useRef(
      restoreFocus
    );

  const focusHandoffRefRef =
    React.useRef(
      focusHandoffRef
    );

  const sourceDocumentRef =
    React.useRef(
      sourceDocument
    );

  const shouldRestoreFocusRef =
    React.useRef(
      shouldRestoreFocus
    );


  const releaseFocusCycle =
    React.useCallback(
      (): void => {
        const cycle =
          focusCycleRef.current;

        if (!cycle.active) {
          return;
        }

        cycle.active =
          false;

        const previousTarget =
          cycle.target;

        cycle.target =
          null;

        /*
         * La decisión del owner se consume antes de cualquier salida temprana.
         * Esto permite cerrar completamente su estado asociado al ciclo aunque
         * finalmente no exista una restauración efectiva.
         */
        const ownerAllowsRestore =
          shouldRestoreFocusRef
            .current?.() ??
          true;

        const container =
          containerRef.current;

        if (
          !ownerAllowsRestore ||
          !restoreFocusRef
            .current ||
          !container
        ) {
          return;
        }

        /*
         * Una transición externa ya consumada tiene autoridad. La frontera no
         * recupera foco cuando otro control ya lo posee.
         */
        const active =
          getDeepActiveElement(
            getNodeEventRoot(
              container
            )
          );

        if (
          !active ||
          !isComposedDescendantOf(
            active,
            container
          )
        ) {
          return;
        }

        const suppliedTarget =
          focusHandoffRefRef
            .current
            ?.current ??
          null;

        const target =
          suppliedTarget
            ?.isConnected
            ? suppliedTarget
            : previousTarget;

        if (
          !target ||
          !target.isConnected ||
          isComposedDescendantOf(
            target,
            container
          )
        ) {
          return;
        }

        void attemptFocus(
          target
        );
      },
      [
        containerRef,
      ]
    );


  useIsomorphicLayoutEffect(
    () => {
      restoreFocusRef.current =
        restoreFocus;

      focusHandoffRefRef
        .current =
        focusHandoffRef;

      sourceDocumentRef
        .current =
        sourceDocument;

      shouldRestoreFocusRef
        .current =
        shouldRestoreFocus;

      const cycle =
        focusCycleRef.current;

      if (interactive) {
        if (
          interactionSuppressed
        ) {
          setInteractionSuppressed(
            false
          );
        }

        /*
         * Solo la transición hacia un ciclo interactivo nuevo vuelve a capturar
         * el foco previo.
         */
        if (!cycle.active) {
          const container =
            containerRef.current;

          cycle.active =
            true;

          cycle.target =
            container
              ? getPreviousFocusTarget(
                  container,
                  sourceDocumentRef
                    .current
                )
              : null;
        }

        return;
      }

      if (cycle.active) {
        releaseFocusCycle();
      }

      if (
        !interactionSuppressed
      ) {
        setInteractionSuppressed(
          true
        );
      }
    }
  );


  useIsomorphicLayoutEffect(
    () => {
      return () => {
        releaseFocusCycle();
      };
    },
    [
      releaseFocusCycle,
    ]
  );


  /*
   * React 18 todavía no expone inert en HTMLAttributes. La sincronización DOM
   * permanece aquí para impedir implementaciones divergentes por consumidor.
   */
  useIsomorphicLayoutEffect(
    () => {
      const element =
        containerRef.current;

      if (!element) {
        return;
      }

      if (
        interactionSuppressed
      ) {
        element.setAttribute(
          "inert",
          ""
        );

        return;
      }

      element.removeAttribute(
        "inert"
      );
    },
    [
      containerRef,
      interactionSuppressed,
    ]
  );


  return {
    interactive,
    interactionSuppressed,
  };
}
