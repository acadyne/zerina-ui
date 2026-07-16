// src/primitives/overlay/Drawer.tsx
import React from "react";
import { X } from "lucide-react";
import {
  DismissableLayer,
  FocusScope,
  Portal,
  ScrollLock,
  getLayerZIndex,
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
import { IconButton } from "../forms";
import { Box, Flex } from "../layout";
import { Typography } from "../typography";

export type DrawerPlacement =
  | "left"
  | "right";

export type DrawerSlot =
  | "root"
  | "backdrop"
  | "positioner"
  | "focusScope"
  | "panel"
  | "header"
  | "title"
  | "description"
  | "closeButton"
  | "body"
  | "footer";

export type DrawerStyles =
  SlotStyleMap<DrawerSlot>;

export type DrawerSlotProps =
  SlotPropsMap<DrawerSlot>;

type DrawerRecipeVariants = {
  placement: DrawerPlacement;
};

type DrawerRecipeState = {
  size: number | string;
};

/**
 * La recipe define únicamente la política visual del Drawer.
 *
 * Portal, presencia, movimiento, dismiss, foco y scroll lock
 * permanecen en los sistemas Overlay y Motion.
 */
const drawerRecipe = defineSlotRecipe<
  DrawerSlot,
  DrawerRecipeVariants,
  DrawerRecipeState
>({
  base: {
    root: {
      position: "fixed",
      inset: 0,
      zIndex: getLayerZIndex("modal"),
      pointerEvents: "none",
    },

    backdrop: {
      position: "fixed",
      inset: 0,
      zIndex: getLayerZIndex(
        "modalBackdrop"
      ),
      background: "var(--ui-overlay)",
      pointerEvents: "auto",
    },

    positioner: {
      position: "fixed",
      top: 0,
      bottom: 0,
      zIndex: getLayerZIndex("modal"),
      maxWidth: "100vw",
      pointerEvents: "auto",
    },

    focusScope: {
      height: "100%",
      minHeight: 0,
      outline: "none",
    },

    panel: {
      width: "100%",
      height: "100%",
      minHeight: 0,

      display: "flex",
      flexDirection: "column",

      background: "var(--ui-surface)",
      color: "var(--ui-text)",

      boxShadow: "var(--ui-shadow-lg)",

      outline: "none",
      overflow: "hidden",
    },

    header: {
      padding:
        "max(1rem, env(safe-area-inset-top)) 1rem 0.85rem",

      borderBottom:
        "1px solid var(--ui-border)",

      minWidth: 0,
    },

    title: {
      margin: 0,

      color: "var(--ui-text)",

      fontSize: "1.05rem",
      fontWeight: 800,
      lineHeight: 1.2,
    },

    description: {
      margin: "0.35rem 0 0",
    },

    body: {
      flex: 1,
      minHeight: 0,

      overflowY: "auto",
      overflowX: "hidden",

      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",

      padding: "1rem",
    },

    footer: {
      padding:
        "0.85rem 1rem max(1rem, env(safe-area-inset-bottom))",

      borderTop:
        "1px solid var(--ui-border)",

      minWidth: 0,
    },
  },

  variants: {
    placement: {
      left: {
        positioner: {
          left: 0,
          right: undefined,
        },

        panel: {
          borderLeft: undefined,

          borderRight:
            "1px solid var(--ui-border)",
        },
      },

      right: {
        positioner: {
          left: undefined,
          right: 0,
        },

        panel: {
          borderLeft:
            "1px solid var(--ui-border)",

          borderRight: undefined,
        },
      },
    },
  },

  resolve: ({
    size,
  }) => ({
    positioner: {
      width: size,
    },
  }),
});

const DEFAULT_DRAWER_RECIPE_STYLES =
  drawerRecipe({
    placement: "right",
    size: "min(420px, 92vw)",
  });

type DrawerContextValue = {
  onOpenChange?: (
    open: boolean
  ) => void;

  recipeStyles:
    SlotStyleMap<DrawerSlot>;

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
};

const DrawerContext =
  React.createContext<
    DrawerContextValue | null
  >(null);

function useOptionalDrawerContext() {
  return React.useContext(
    DrawerContext
  );
}

export interface DrawerProps {
  children?: React.ReactNode;

  open: boolean;

  onOpenChange?: (
    open: boolean
  ) => void;

  placement?: DrawerPlacement;
  size?: number | string;

  title?: React.ReactNode;
  description?: React.ReactNode;

  closeOnEscape?: boolean;

  closeOnPointerDownOutside?:
    boolean;

  lockScroll?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;

  initialFocusRef?:
    React.RefObject<
      HTMLElement | null
    >;

  showCloseButton?: boolean;

  portalled?: boolean;

  container?:
    | Element
    | DocumentFragment
    | null;

  overlayId?: string;

  className?: string;
  style?: React.CSSProperties;

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
}

export const Drawer:
  React.FC<DrawerProps> = ({
    children,
    open,
    onOpenChange,

    placement = "right",
    size = "min(420px, 92vw)",

    title,
    description,

    closeOnEscape = true,

    closeOnPointerDownOutside =
      true,

    lockScroll = true,
    trapFocus = true,
    autoFocus = true,
    restoreFocus = true,

    initialFocusRef,

    showCloseButton = true,

    portalled = true,
    container,

    overlayId:
      overlayIdProp,

    className = "",
    style,

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
      `drawer-${reactId}`;

    const titleId =
      `${overlayId}-title`;

    const descriptionId =
      `${overlayId}-description`;

    const handleClose =
      React.useCallback(() => {
        onOpenChange?.(false);
      }, [onOpenChange]);

    const recipeStyles =
      drawerRecipe({
        placement,
        size,
      });

    const contextValue =
      React.useMemo<
        DrawerContextValue
      >(
        () => ({
          onOpenChange,
          recipeStyles,
          styles,
          slotProps,
        }),
        [
          onOpenChange,
          recipeStyles,
          styles,
          slotProps,
        ]
      );

    const rootSlot =
      resolveSlot<DrawerSlot>({
        slot: "root",
        styles,
        slotProps,

        baseProps: {
          "data-ui-drawer-root":
            "",

          "data-ui-drawer-open":
            open ||
            undefined,

          "data-ui-drawer-placement":
            placement,
        },

        baseStyle:
          recipeStyles.root,
      });

    const backdropSlot =
      resolveSlot<DrawerSlot>({
        slot: "backdrop",
        styles,
        slotProps,

        baseProps: {
          "aria-hidden": true,

          "data-ui-drawer-backdrop":
            "",
        },

        baseStyle:
          recipeStyles.backdrop,
      });

    const positionerSlot =
      resolveSlot<DrawerSlot>({
        slot: "positioner",
        styles,
        slotProps,

        baseProps: {
          "data-ui-drawer-positioner":
            "",
        },

        baseStyle:
          recipeStyles.positioner,
      });

    const focusScopeSlot =
      resolveSlot<DrawerSlot>({
        slot: "focusScope",
        styles,
        slotProps,

        baseProps: {
          "data-ui-drawer-focus-scope":
            "",
        },

        baseStyle:
          recipeStyles.focusScope,
      });

    const panelSlot =
      resolveSlot<DrawerSlot>({
        slot: "panel",
        styles,
        slotProps,
        className,
        style,

        baseProps: {
          "data-ui-drawer-panel":
            "",
        },

        baseStyle:
          recipeStyles.panel,
      });

    /*
     * MotionOverlay conserva la política de presencia y movimiento.
     * La recipe no produce estados animados ni transiciones.
     */
    const content = (
      <DrawerContext.Provider
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
            <MotionOverlayBackdrop
              {...toMotionSlotProps(
                backdropSlot
              )}
            />

            {/*
             * DismissableLayer, FocusScope y ScrollLock
             * pertenecen al sistema Overlay, no a Styling.
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
                handleClose
              }
              {...positionerSlot}
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
                {...focusScopeSlot}
              >
                <MotionOverlayPanel
                  as="aside"
                  kind="drawer"
                  placement={placement}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={
                    title
                      ? titleId
                      : undefined
                  }
                  aria-describedby={
                    description
                      ? descriptionId
                      : undefined
                  }
                  {...toMotionSlotProps(
                    panelSlot
                  )}
                >
                  {title ||
                  description ||
                  showCloseButton ? (
                    <DrawerHeader>
                      <Box
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {title ? (
                          <DrawerTitle
                            id={titleId}
                          >
                            {title}
                          </DrawerTitle>
                        ) : null}

                        {description ? (
                          <DrawerDescription
                            id={
                              descriptionId
                            }
                          >
                            {description}
                          </DrawerDescription>
                        ) : null}
                      </Box>

                      {showCloseButton ? (
                        <DrawerClose
                          onClose={
                            handleClose
                          }
                        />
                      ) : null}
                    </DrawerHeader>
                  ) : null}

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
      </DrawerContext.Provider>
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

Drawer.displayName = "Drawer";

export interface DrawerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
}

export const DrawerHeader =
  React.forwardRef<
    HTMLDivElement,
    DrawerHeaderProps
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
        useOptionalDrawerContext();

      const headerSlot =
        resolveSlot<DrawerSlot>({
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
            DEFAULT_DRAWER_RECIPE_STYLES
              .header,
        });

      return (
        <Flex
          {...headerSlot}
          {...rest}
          ref={ref}
          align="flex-start"
          justify="space-between"
          gap="0.75rem"
        >
          {children}
        </Flex>
      );
    }
  );

DrawerHeader.displayName =
  "DrawerHeader";

export interface DrawerBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
}

export const DrawerBody =
  React.forwardRef<
    HTMLDivElement,
    DrawerBodyProps
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
        useOptionalDrawerContext();

      const bodySlot =
        resolveSlot<DrawerSlot>({
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
            DEFAULT_DRAWER_RECIPE_STYLES
              .body,
        });

      return (
        <Box
          {...bodySlot}
          {...rest}
          ref={ref}
        >
          {children}
        </Box>
      );
    }
  );

DrawerBody.displayName =
  "DrawerBody";

export interface DrawerFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
}

export const DrawerFooter =
  React.forwardRef<
    HTMLDivElement,
    DrawerFooterProps
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
        useOptionalDrawerContext();

      const footerSlot =
        resolveSlot<DrawerSlot>({
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
            DEFAULT_DRAWER_RECIPE_STYLES
              .footer,
        });

      return (
        <Flex
          {...footerSlot}
          {...rest}
          ref={ref}
          align="center"
          justify="flex-end"
          gap="0.75rem"
          wrap="wrap"
        >
          {children}
        </Flex>
      );
    }
  );

DrawerFooter.displayName =
  "DrawerFooter";

export interface DrawerTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
}

export const DrawerTitle =
  React.forwardRef<
    HTMLHeadingElement,
    DrawerTitleProps
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
        useOptionalDrawerContext();

      const titleSlot =
        resolveSlot<DrawerSlot>({
          slot: "title",

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
              .title ??
            DEFAULT_DRAWER_RECIPE_STYLES
              .title,
        });

      return (
        <h2
          {...titleSlot}
          {...rest}
          ref={ref}
        >
          {children}
        </h2>
      );
    }
  );

DrawerTitle.displayName =
  "DrawerTitle";

export interface DrawerDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
}

export const DrawerDescription =
  React.forwardRef<
    HTMLParagraphElement,
    DrawerDescriptionProps
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
        useOptionalDrawerContext();

      const descriptionSlot =
        resolveSlot<DrawerSlot>({
          slot: "description",

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
              .description ??
            DEFAULT_DRAWER_RECIPE_STYLES
              .description,
        });

      return (
        <Typography
          {...descriptionSlot}
          {...rest}
          ref={ref}
          as="p"
          size="sm"
          color="var(--ui-text-muted)"
        >
          {children}
        </Typography>
      );
    }
  );

DrawerDescription.displayName =
  "DrawerDescription";

export interface DrawerCloseProps {
  onClose?: () => void;

  ariaLabel?: string;

  className?: string;
  style?: React.CSSProperties;

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
}

export const DrawerClose =
  React.forwardRef<
    HTMLButtonElement,
    DrawerCloseProps
  >(
    (
      {
        onClose,
        ariaLabel = "Cerrar",
        className = "",
        style,
        styles,
        slotProps,
      },
      ref
    ) => {
      const ctx =
        useOptionalDrawerContext();

      const closeButtonSlot =
        resolveSlot<DrawerSlot>({
          slot: "closeButton",

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
              .closeButton ??
            DEFAULT_DRAWER_RECIPE_STYLES
              .closeButton,
        });

      return (
        <IconButton
          ref={ref}
          ariaLabel={ariaLabel}
          icon={<X size={18} />}
          size="sm"
          variant="ghost"
          onPress={onClose}
          className={
            closeButtonSlot.className
          }
          style={
            closeButtonSlot.style
          }
        />
      );
    }
  );

DrawerClose.displayName =
  "DrawerClose";