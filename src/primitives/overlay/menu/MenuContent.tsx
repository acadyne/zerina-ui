// src/primitives/overlay/menu/MenuContent.tsx

import React from "react";

import {
  motion,
} from "framer-motion";

import {
  DismissableLayer,
  FloatingLayer,
  Portal,
  getLayerZIndex,
} from "../../../core/overlay";

import {
  MotionPresenceGroup,
  useOptionalUIMotion,
} from "../../../core/motion";

import {
  setRef,
} from "../../../core/interaction/events";

import {
  composeEventHandlers,
} from "../../../core/interaction/events/composeEventHandlers";

import {
  clearOwnedWindowTimeout,
  setOwnedWindowTimeout,
} from "../../../core/dom";

import {
  resolveLayeredSlot,
  toMotionSlotProps,
} from "../../../helpers/css";

import {
  composeMenuExternalHandlers,
  getFloatingSide,
  getMenuTransformOrigin,
} from "./menu.utils";

import {
  useMenuContext,
} from "./menu.context";

import {
  menuRecipe,
} from "./menu.recipe";

import type {
  MenuSlot,
  MenuContentProps,
} from "./menu.types";


/*
 * La superficie flotante es el owner explícito de la composición de refs.
 *
 * Crear el callback dentro del render prop de FloatingLayer produciría una
 * identidad nueva por render y ciclos artificiales node -> null -> node.
 */
type MenuContentSurfaceProps =
  Omit<
    React.ComponentProps<
      typeof motion.div
    >,
    "ref"
  > & {
    floatingRef:
      React.Ref<HTMLDivElement>;

    contentRef:
      React.RefCallback<HTMLDivElement>;
  };


const MenuContentSurface:
  React.FC<MenuContentSurfaceProps> = ({
    floatingRef,
    contentRef,
    ...props
  }) => {
    const setSurfaceRefs =
      React.useCallback(
        (
          node:
            | HTMLDivElement
            | null
        ) => {
          setRef(
            floatingRef,
            node
          );

          contentRef(
            node
          );
        },
        [
          contentRef,
          floatingRef,
        ]
      );


    return (
      <motion.div
        {...props}
        ref={setSurfaceRefs}
      />
    );
  };


export const MenuContent =
  React.forwardRef<HTMLDivElement, MenuContentProps>(
    (
      {
        children,
        style,
        className = "",
        portalled = true,
        container,
        placement = "bottom-start",
        offset = 8,
        flip = true,
        shift = true,
        viewportPadding = 8,
        closeOnEscape = true,
        closeOnPointerDownOutside = true,
        matchAnchorWidth = false,
        styles,
        slotProps,

        onKeyDown,

        ...rest
      },
      ref
    ) => {
      const ctx =
        useMenuContext();

      const motionState =
        useOptionalUIMotion();

      const contentRef =
        React.useRef<HTMLDivElement | null>(
          null
        );


      const typeaheadBufferRef =
        React.useRef("");

      const typeaheadTimeoutRef =
        React.useRef<
          ReturnType<
            typeof setOwnedWindowTimeout
          > | null
        >(
          null
        );


      const {
        anchorRef,
        focusFirst,
        focusInitial,
        focusLast,
        focusNext,
        focusPrev,
        onOpenChange,
        open,
      } = ctx;
      const setRefs =
        React.useCallback(
          (
            node: HTMLDivElement | null
          ) => {
            contentRef.current =
              node;

            setRef(
              ref,
              node
            );
          },
          [ref]
        );


      /*
       * Este timeout solo expira el buffer local de búsqueda.
       *
       * No representa una época de apertura ni resuelve reaperturas diferidas;
       * esa frontera temporal pertenece a P3.1.
       */
      const clearTypeahead =
        React.useCallback(
          (): void => {
            typeaheadBufferRef
              .current =
              "";

            if (
              typeaheadTimeoutRef
                .current ===
              null
            ) {
              return;
            }

            clearOwnedWindowTimeout(
              typeaheadTimeoutRef
                .current
            );

            typeaheadTimeoutRef
              .current =
              null;
          },
          []
        );


      React.useEffect(
        () => {
          if (!open) {
            clearTypeahead();
          }

          return clearTypeahead;
        },
        [
          clearTypeahead,
          open,
        ]
      );


      React.useEffect(() => {
        if (!open) {
          return;
        }


        if (ctx.hasFocusedItem) {
          return;
        }

        const ownerWindow =
          contentRef.current?.ownerDocument.defaultView ??
          anchorRef.current?.ownerDocument.defaultView;

        if (!ownerWindow) {
          return;
        }

        const timeout =
          setOwnedWindowTimeout(
            ownerWindow,
            () => {
              focusInitial();
            },
            0
          );

        return () => {
          clearOwnedWindowTimeout(
            timeout
          );
        };
      }, [
        ctx.hasFocusedItem,
        focusInitial,
        open,
      ]);


      const handleDismiss =
        React.useCallback(
          () => {
            onOpenChange?.(false);
          },
          [onOpenChange]
        );


      const focusByTextValue =
        ctx.focusByTextValue;


      const handleKeyDown =
        React.useCallback(
          (
            event:
              React.KeyboardEvent<HTMLDivElement>
          ) => {
            /*
             * Mientras el IME compone texto, event.key todavía no representa una
             * intención estable de navegación ni una entrada de typeahead.
             */
            if (
              event.nativeEvent
                .isComposing ||
              event.key ===
                "Process"
            ) {
              return;
            }

            if (
              event.key ===
              "ArrowDown"
            ) {
              clearTypeahead();
              event.preventDefault();
              focusNext();
              return;
            }

            if (
              event.key ===
              "ArrowUp"
            ) {
              clearTypeahead();
              event.preventDefault();
              focusPrev();
              return;
            }

            if (
              event.key ===
              "Home"
            ) {
              clearTypeahead();
              event.preventDefault();
              focusFirst();
              return;
            }

            if (
              event.key ===
              "End"
            ) {
              clearTypeahead();
              event.preventDefault();
              focusLast();
              return;
            }

            if (
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              Array.from(
                event.key
              ).length !== 1
            ) {
              return;
            }

            const normalizedKey =
              event.key
                .normalize("NFKC")
                .toLocaleLowerCase();

            const nextBuffer =
              `${
                typeaheadBufferRef
                  .current
              }${normalizedKey}`;

            const characters =
              Array.from(
                nextBuffer
              );

            /*
             * Una secuencia de la misma tecla busca por un carácter para recorrer
             * coincidencias sucesivas en vez de intentar encontrar "aaa".
             */
            let searchValue =
              characters.length > 0 &&
              characters.every(
                (character) =>
                  character ===
                  characters[0]
              )
                ? characters[0] ?? ""
                : nextBuffer;

            typeaheadBufferRef
              .current =
              nextBuffer;

            if (
              typeaheadTimeoutRef
                .current !==
              null
            ) {
              clearOwnedWindowTimeout(
                typeaheadTimeoutRef
                  .current
              );
            }

            const ownerWindow =
              contentRef.current
                ?.ownerDocument
                .defaultView ??
              ctx.anchorRef.current
                ?.ownerDocument
                .defaultView;

            if (ownerWindow) {
              typeaheadTimeoutRef
                .current =
                setOwnedWindowTimeout(
                  ownerWindow,
                  () => {
                    typeaheadBufferRef
                      .current =
                      "";

                    typeaheadTimeoutRef
                      .current =
                      null;
                  },
                  700
                );
            }

            let matched =
              focusByTextValue(
                searchValue
              );

            /*
             * Si la secuencia acumulada deja de coincidir, la última tecla inicia
             * una búsqueda nueva sin esperar a que expire el buffer.
             */
            if (
              !matched &&
              searchValue !==
                normalizedKey
            ) {
              typeaheadBufferRef
                .current =
                normalizedKey;

              searchValue =
                normalizedKey;

              matched =
                focusByTextValue(
                  searchValue
                );
            }

            if (matched) {
              event.preventDefault();
            }
          },
          [
            clearTypeahead,
            ctx.anchorRef,
            focusByTextValue,
            focusFirst,
            focusLast,
            focusNext,
            focusPrev,
          ]
        );


      const variants =
        motionState.getVariants(
          "menu",
          motionState.effectiveLevel
        );


      const transition =
        motionState.getTransition(
          motionState.effectiveLevel,
          "slide"
        );


      const localContentOnKeyDown =
        (
          slotProps
            ?.content as
            | React.HTMLAttributes<HTMLDivElement>
            | undefined
        )
          ?.onKeyDown;

      const contextContentOnKeyDown =
        (
          ctx.slotProps
            ?.content as
            | React.HTMLAttributes<HTMLDivElement>
            | undefined
        )
          ?.onKeyDown;


      /*
       * Prop pública, slot local y slot de contexto se ejecutan una vez.
       *
       * resolveLayeredSlot resuelve props ordinarias por precedencia, por lo que
       * los handlers se extraen explícitamente. preventDefault de cualquiera
       * bloquea después la navegación interna.
       */
      const composedContentOnKeyDown =
        composeEventHandlers(
          composeMenuExternalHandlers(
            onKeyDown,
            localContentOnKeyDown,
            contextContentOnKeyDown
          ),
          handleKeyDown
        );


      const content =
        ctx.open &&
          ctx.anchorRef.current ? (
          <FloatingLayer
            anchorRef={
              ctx.anchorRef
            }
            open={
              ctx.open
            }
            placement={
              placement
            }
            offset={
              offset
            }
            flip={
              flip
            }
            shift={
              shift
            }
            viewportPadding={
              viewportPadding
            }
            zIndex={
              getLayerZIndex(
                "dropdown"
              )
            }
            strategy="fixed"
            matchAnchorWidth={
              matchAnchorWidth
            }
          >
            {({
              ref: floatingRef,
              style: floatingStyle,
              placement: resolvedPlacement,
            }) => {
              const side =
                getFloatingSide(
                  resolvedPlacement
                );


              const dismissableLayerSlot =
                resolveLayeredSlot<MenuSlot>({
                  slots: [
                    "dismissableLayer",
                  ],

                  contextStyles:
                    ctx.styles,

                  contextSlotProps:
                    ctx.slotProps,

                  styles,

                  slotProps,


                  baseProps: {
                    "data-ui-menu-dismissable-layer":
                      "",

                    "data-side":
                      side,

                    "data-placement":
                      resolvedPlacement,
                  },

                  baseStyle: {
                    ...floatingStyle,

                    zIndex:
                      getLayerZIndex(
                        "dropdown"
                      ),
                  },
                });


              const contentSlot =
                resolveLayeredSlot<MenuSlot>({
                  slots: [
                    "content",
                  ],

                  contextStyles:
                    ctx.styles,

                  contextSlotProps:
                    ctx.slotProps,

                  styles,

                  slotProps,


                  className,

                  style,

                  baseProps: {
                    "data-ui-menu-content":
                      "",

                    "data-side":
                      side,

                    "data-placement":
                      resolvedPlacement,
                  },

                  baseStyle:
                    menuRecipe({
                      transformOrigin:
                        getMenuTransformOrigin(
                          resolvedPlacement
                        ),
                    }).content,
                });


              return (
                <DismissableLayer
                  /*
                   * Todas las props DOM válidas del slot alcanzan la frontera
                   * central. Las invariantes internas se declaran después y
                   * mantienen autoridad sobre la interacción del overlay.
                   */
                  {...dismissableLayerSlot}

                  overlayId={
                    ctx.contentId
                  }
                  layer={
                    getLayerZIndex(
                      "dropdown"
                    )
                  }
                  enabled={
                    ctx.open
                  }
                  restoreFocus
                  focusHandoffRef={
                    anchorRef
                  }
                  branches={[
                    anchorRef,
                  ]}
                  dismissOnEscape={
                    closeOnEscape
                  }
                  dismissOnPointerDownOutside={
                    closeOnPointerDownOutside
                  }
                  onDismiss={
                    handleDismiss
                  }
                  className={
                    dismissableLayerSlot.className
                  }
                  style={
                    dismissableLayerSlot.style
                  }
                >
                  <MenuContentSurface
                    floatingRef={
                      floatingRef as React.Ref<HTMLDivElement>
                    }

                    contentRef={
                      setRefs
                    }
                    {...rest}
                    {...toMotionSlotProps(
                      contentSlot
                    )}

                    onKeyDown={
                      composedContentOnKeyDown
                    }
                    id={
                      ctx.contentId
                    }
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={
                      ctx.triggerId
                    }
                    variants={
                      variants
                    }
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={
                      transition
                    }
                  >
                    {children}
                  </MenuContentSurface>
                </DismissableLayer>
              );
            }}
          </FloatingLayer>
        ) : null;


      const animated =
        (
          <MotionPresenceGroup>
            {content}
          </MotionPresenceGroup>
        );


      return portalled ? (
        <Portal container={container}>
          {animated}
        </Portal>
      ) : (
        animated
      );
    }
  );


MenuContent.displayName =
  "MenuContent";
