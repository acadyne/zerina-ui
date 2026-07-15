// src/primitives/overlay/Dialog.tsx
import React from "react";
import {
  DismissableLayer,
  FocusScope,
  getLayerZIndex,
  Portal,
  ScrollLock,
} from "../../core/overlay";
import {
  MotionOverlayBackdrop,
  MotionOverlayPanel,
  MotionOverlayPresence,
  MotionOverlayRoot,
} from "../../core/motion";
import {
  defineSlotRecipe,
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import {
  Button,
  type ButtonProps,
} from "../forms/Button";

type DialogSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

export type DialogSlot =
  | "root"
  | "backdrop"
  | "dismissableLayer"
  | "focusScope"
  | "panel"
  | "content"
  | "header"
  | "body"
  | "footer"
  | "title"
  | "description"
  | "close";

export type DialogStyles =
  SlotStyleMap<DialogSlot>;

export type DialogSlotProps =
  SlotPropsMap<DialogSlot>;

type DialogRecipeVariants = {
  size: DialogSize;
};

type DialogRecipeState =
  Record<never, never>;

/**
 * Esta recipe contiene únicamente política visual.
 *
 * Presence, transiciones, foco, dismiss, Portal, ScrollLock
 * y atributos ARIA permanecen en sus respectivos sistemas.
 */
const dialogRecipe = defineSlotRecipe<
  DialogSlot,
  DialogRecipeVariants,
  DialogRecipeState
>({
  base: {
    root: {
      position: "fixed",
      inset: 0,

      zIndex:
        getLayerZIndex("modal"),

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      paddingTop:
        "max(16px, env(safe-area-inset-top))",

      paddingRight:
        "max(16px, env(safe-area-inset-right))",

      paddingBottom:
        "max(16px, env(safe-area-inset-bottom))",

      paddingLeft:
        "max(16px, env(safe-area-inset-left))",

      pointerEvents: "none",
    },

    backdrop: {
      position: "fixed",
      inset: 0,

      background:
        "var(--ui-overlay)",

      zIndex:
        getLayerZIndex(
          "modalBackdrop"
        ),

      pointerEvents: "auto",
    },

    dismissableLayer: {
      position: "relative",

      zIndex:
        getLayerZIndex("modal"),

      width: "100%",

      display: "flex",
      justifyContent: "center",

      pointerEvents: "none",
    },

    focusScope: {
      position: "relative",

      zIndex:
        getLayerZIndex("modal"),

      width: "100%",

      display: "flex",
      justifyContent: "center",

      pointerEvents: "auto",
    },

    panel: {
      maxHeight:
        "min(88vh, 88dvh)",

      overflow: "auto",
      overscrollBehavior:
        "contain",

      WebkitOverflowScrolling:
        "touch",

      borderRadius:
        "var(--ui-radius-xl)",

      border:
        "1px solid var(--ui-border)",

      background:
        "var(--ui-surface)",

      color:
        "var(--ui-text)",

      boxShadow:
        "var(--ui-shadow-lg)",

      outline: "none",
      transformOrigin: "center",
    },

    content: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
    },

    header: {
      display: "flex",
      flexDirection: "column",

      gap: "0.4rem",

      padding:
        "1rem 1rem 0.75rem 1rem",

      borderBottom:
        "1px solid var(--ui-border)",
    },

    body: {
      padding: "1rem",
      minWidth: 0,
    },

    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",

      gap: "0.75rem",
      flexWrap: "wrap",

      padding:
        "0.75rem 1rem 1rem 1rem",

      borderTop:
        "1px solid var(--ui-border)",
    },

    title: {
      margin: 0,

      fontSize: "1.125rem",
      fontWeight: 800,
      lineHeight: 1.2,

      color:
        "var(--ui-text)",
    },

    description: {
      margin: 0,

      fontSize:
        "var(--ui-font-size-sm)",

      lineHeight: 1.45,

      color:
        "var(--ui-text-muted)",
    },
  },

  variants: {
    size: {
      sm: {
        panel: {
          width: "420px",
          maxWidth: "92vw",
        },
      },

      md: {
        panel: {
          width: "560px",
          maxWidth: "92vw",
        },
      },

      lg: {
        panel: {
          width: "720px",
          maxWidth: "94vw",
        },
      },

      xl: {
        panel: {
          width: "880px",
          maxWidth: "96vw",
        },
      },
    },
  },
});

const DEFAULT_DIALOG_RECIPE_STYLES =
  dialogRecipe({
    size: "md",
  });

type DialogContextValue = {
  open: boolean;

  overlayId: string;
  titleId: string;
  descriptionId: string;

  setTitleMounted: (
    mounted: boolean
  ) => void;

  setDescriptionMounted: (
    mounted: boolean
  ) => void;

  hasTitle: boolean;
  hasDescription: boolean;

  onOpenChange?: (
    open: boolean
  ) => void;

  recipeStyles:
    SlotStyleMap<DialogSlot>;

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
};

const DialogContext =
  React.createContext<
    DialogContextValue | null
  >(null);

function useDialogContext() {
  const ctx =
    React.useContext(
      DialogContext
    );

  if (!ctx) {
    throw new Error(
      "Dialog subcomponents must be used inside <Dialog />"
    );
  }

  return ctx;
}

function useOptionalDialogContext() {
  return React.useContext(
    DialogContext
  );
}

export interface DialogProps {
  children?: React.ReactNode;

  open: boolean;

  onOpenChange?: (
    open: boolean
  ) => void;

  closeOnEscape?: boolean;

  closeOnPointerDownOutside?:
    boolean;

  modal?: boolean;
  lockScroll?: boolean;

  restoreFocus?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;

  initialFocusRef?:
    React.RefObject<
      HTMLElement | null
    >;

  portalled?: boolean;

  container?:
    | Element
    | DocumentFragment
    | null;

  size?: DialogSize;
  overlayId?: string;

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const Dialog:
  React.FC<DialogProps> = ({
    children,
    open,
    onOpenChange,

    closeOnEscape = true,

    closeOnPointerDownOutside =
      true,

    modal = true,
    lockScroll = true,

    restoreFocus = true,
    trapFocus = true,
    autoFocus = true,

    initialFocusRef,

    portalled = true,
    container,

    size = "md",

    overlayId:
      overlayIdProp,

    styles,
    slotProps,
  }) => {
    const reactId =
      React.useId().replace(
        /:/g,
        ""
      );

    const overlayId =
      overlayIdProp ??
      `dialog-${reactId}`;

    const titleId =
      `${overlayId}-title`;

    const descriptionId =
      `${overlayId}-description`;

    const [
      hasTitle,
      setHasTitle,
    ] = React.useState(false);

    const [
      hasDescription,
      setHasDescription,
    ] = React.useState(false);

    const handleDismiss =
      React.useCallback(() => {
        onOpenChange?.(false);
      }, [onOpenChange]);

    const recipeStyles =
      dialogRecipe({
        size,
      });

    const contextValue =
      React.useMemo<
        DialogContextValue
      >(
        () => ({
          open,

          overlayId,
          titleId,
          descriptionId,

          setTitleMounted:
            setHasTitle,

          setDescriptionMounted:
            setHasDescription,

          hasTitle,
          hasDescription,

          onOpenChange,

          recipeStyles,

          styles,
          slotProps,
        }),
        [
          open,

          overlayId,
          titleId,
          descriptionId,

          hasTitle,
          hasDescription,

          onOpenChange,

          recipeStyles,

          styles,
          slotProps,
        ]
      );

    const rootSlot =
      resolveSlot<DialogSlot>({
        slot: "root",
        styles,
        slotProps,

        baseProps: {
          "data-ui-dialog-root":
            "",
        },

        baseStyle:
          recipeStyles.root,
      });

    const backdropSlot =
      resolveSlot<DialogSlot>({
        slot: "backdrop",
        styles,
        slotProps,

        baseProps: {
          "aria-hidden": true,

          "data-ui-dialog-backdrop":
            "",
        },

        baseStyle:
          recipeStyles.backdrop,
      });

    const dismissableLayerSlot =
      resolveSlot<DialogSlot>({
        slot:
          "dismissableLayer",

        styles,
        slotProps,

        baseStyle:
          recipeStyles
            .dismissableLayer,
      });

    const focusScopeSlot =
      resolveSlot<DialogSlot>({
        slot: "focusScope",
        styles,
        slotProps,

        baseStyle:
          recipeStyles
            .focusScope,
      });

    const panelSlot =
      resolveSlot<DialogSlot>({
        slot: "panel",
        styles,
        slotProps,

        baseProps: {
          "data-ui":
            "modal-content",

          "data-ui-dialog-panel":
            "",
        },

        baseStyle:
          recipeStyles.panel,
      });

    /*
     * MotionOverlay conserva la política de presencia y movimiento.
     * La recipe no define estados animados ni transiciones de Framer Motion.
     */
    const content = (
      <DialogContext.Provider
        value={contextValue}
      >
        <MotionOverlayPresence
          open={open}
        >
          <MotionOverlayRoot
            {...toMotionSlotProps(
              rootSlot
            )}
          >
            {modal ? (
              <MotionOverlayBackdrop
                {...toMotionSlotProps(
                  backdropSlot
                )}
              />
            ) : null}

            {/*
             * DismissableLayer, FocusScope y ScrollLock son
             * responsabilidades de Overlay, no de Styling.
             */}
            <DismissableLayer
              overlayId={overlayId}
              layer={getLayerZIndex(
                "modal"
              )}
              enabled={open}
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
              <FocusScope
                overlayId={overlayId}
                enabled={open}
                contain={trapFocus}
                autoFocus={autoFocus}
                restoreFocus={
                  restoreFocus
                }
                initialFocusRef={
                  initialFocusRef
                }
                className={
                  focusScopeSlot.className
                }
                style={
                  focusScopeSlot.style
                }
              >
                <MotionOverlayPanel
                  {...toMotionSlotProps(
                    panelSlot
                  )}
                  as="div"
                  kind="dialog"
                  role="dialog"
                  aria-modal={
                    modal
                      ? true
                      : undefined
                  }
                  aria-labelledby={
                    hasTitle
                      ? titleId
                      : undefined
                  }
                  aria-describedby={
                    hasDescription
                      ? descriptionId
                      : undefined
                  }
                >
                  {children}
                </MotionOverlayPanel>
              </FocusScope>

              {lockScroll ? (
                <ScrollLock
                  overlayId={
                    overlayId
                  }
                  enabled={open}
                  active={open}
                />
              ) : null}
            </DismissableLayer>
          </MotionOverlayRoot>
        </MotionOverlayPresence>
      </DialogContext.Provider>
    );

    return portalled ? (
      <Portal
        container={container}
      >
        {content}
      </Portal>
    ) : (
      content
    );
  };

Dialog.displayName = "Dialog";

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogContent =
  React.forwardRef<
    HTMLDivElement,
    DialogContentProps
  >(
    (
      {
        children,
        className = "",
        style,
        styles,
        slotProps,
        ...rest
      },
      ref
    ) => {
      const ctx =
        useOptionalDialogContext();

      const contentSlot =
        resolveSlot<DialogSlot>({
          slot: "content",

          styles:
            styles ??
            ctx?.styles,

          slotProps:
            slotProps ??
            ctx?.slotProps,

          className,
          style,

          baseStyle:
            ctx?.recipeStyles
              .content ??
            DEFAULT_DIALOG_RECIPE_STYLES
              .content,
        });

      return (
        <div
          {...contentSlot}
          ref={ref}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );

DialogContent.displayName =
  "DialogContent";

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogHeader =
  React.forwardRef<
    HTMLDivElement,
    DialogHeaderProps
  >(
    (
      {
        children,
        className = "",
        style,
        styles,
        slotProps,
        ...rest
      },
      ref
    ) => {
      const ctx =
        useOptionalDialogContext();

      const headerSlot =
        resolveSlot<DialogSlot>({
          slot: "header",

          styles:
            styles ??
            ctx?.styles,

          slotProps:
            slotProps ??
            ctx?.slotProps,

          className,
          style,

          baseStyle:
            ctx?.recipeStyles
              .header ??
            DEFAULT_DIALOG_RECIPE_STYLES
              .header,
        });

      return (
        <div
          {...headerSlot}
          ref={ref}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );

DialogHeader.displayName =
  "DialogHeader";

export interface DialogBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogBody =
  React.forwardRef<
    HTMLDivElement,
    DialogBodyProps
  >(
    (
      {
        children,
        className = "",
        style,
        styles,
        slotProps,
        ...rest
      },
      ref
    ) => {
      const ctx =
        useOptionalDialogContext();

      const bodySlot =
        resolveSlot<DialogSlot>({
          slot: "body",

          styles:
            styles ??
            ctx?.styles,

          slotProps:
            slotProps ??
            ctx?.slotProps,

          className,
          style,

          baseStyle:
            ctx?.recipeStyles
              .body ??
            DEFAULT_DIALOG_RECIPE_STYLES
              .body,
        });

      return (
        <div
          {...bodySlot}
          ref={ref}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );

DialogBody.displayName =
  "DialogBody";

export interface DialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogFooter =
  React.forwardRef<
    HTMLDivElement,
    DialogFooterProps
  >(
    (
      {
        children,
        className = "",
        style,
        styles,
        slotProps,
        ...rest
      },
      ref
    ) => {
      const ctx =
        useOptionalDialogContext();

      const footerSlot =
        resolveSlot<DialogSlot>({
          slot: "footer",

          styles:
            styles ??
            ctx?.styles,

          slotProps:
            slotProps ??
            ctx?.slotProps,

          className,
          style,

          baseStyle:
            ctx?.recipeStyles
              .footer ??
            DEFAULT_DIALOG_RECIPE_STYLES
              .footer,
        });

      return (
        <div
          {...footerSlot}
          ref={ref}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );

DialogFooter.displayName =
  "DialogFooter";

export interface DialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;

  as?: React.ElementType;

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogTitle =
  React.forwardRef<
    HTMLHeadingElement,
    DialogTitleProps
  >(
    (
      {
        children,
        as: Comp = "h2",
        className = "",
        style,
        styles,
        slotProps,
        ...rest
      },
      ref
    ) => {
      const ctx =
        useDialogContext();

      /*
       * Este registro controla aria-labelledby.
       * No representa estado visual y por eso permanece fuera de la recipe.
       */
      React.useEffect(() => {
        ctx.setTitleMounted(
          true
        );

        return () => {
          ctx.setTitleMounted(
            false
          );
        };
      }, [ctx]);

      const titleSlot =
        resolveSlot<DialogSlot>({
          slot: "title",

          styles:
            styles ??
            ctx.styles,

          slotProps:
            slotProps ??
            ctx.slotProps,

          className,
          style,

          baseStyle:
            ctx.recipeStyles
              .title,
        });

      return (
        <Comp
          {...titleSlot}
          ref={
            ref as React.Ref<any>
          }
          id={ctx.titleId}
          {...rest}
        >
          {children}
        </Comp>
      );
    }
  );

DialogTitle.displayName =
  "DialogTitle";

export interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogDescription =
  React.forwardRef<
    HTMLParagraphElement,
    DialogDescriptionProps
  >(
    (
      {
        children,
        className = "",
        style,
        styles,
        slotProps,
        ...rest
      },
      ref
    ) => {
      const ctx =
        useDialogContext();

      /*
       * Este registro controla aria-describedby.
       * No representa estado visual y por eso permanece fuera de la recipe.
       */
      React.useEffect(() => {
        ctx.setDescriptionMounted(
          true
        );

        return () => {
          ctx.setDescriptionMounted(
            false
          );
        };
      }, [ctx]);

      const descriptionSlot =
        resolveSlot<DialogSlot>({
          slot: "description",

          styles:
            styles ??
            ctx.styles,

          slotProps:
            slotProps ??
            ctx.slotProps,

          className,
          style,

          baseStyle:
            ctx.recipeStyles
              .description,
        });

      return (
        <p
          {...descriptionSlot}
          ref={ref}
          id={
            ctx.descriptionId
          }
          {...rest}
        >
          {children}
        </p>
      );
    }
  );

DialogDescription.displayName =
  "DialogDescription";

export interface DialogCloseProps
  extends Omit<
    ButtonProps,
    "type"
  > {
  children?: React.ReactNode;
}

export const DialogClose =
  React.forwardRef<
    HTMLButtonElement,
    DialogCloseProps
  >(
    (
      {
        children,
        onPress,
        className = "",
        style,
        ...rest
      },
      ref
    ) => {
      const ctx =
        useDialogContext();

      const closeSlot =
        resolveSlot<DialogSlot>({
          slot: "close",

          styles:
            ctx.styles,

          slotProps:
            ctx.slotProps,

          className,
          style,

          baseStyle:
            ctx.recipeStyles
              .close,
        });

      return (
        <Button
          ref={ref}
          type="button"
          variant="ghost"
          size="sm"
          className={
            closeSlot.className
          }
          style={
            closeSlot.style
          }
          onPress={(event) => {
            ctx.onOpenChange?.(
              false
            );

            onPress?.(event);
          }}
          {...rest}
        >
          {children}
        </Button>
      );
    }
  );

DialogClose.displayName =
  "DialogClose";