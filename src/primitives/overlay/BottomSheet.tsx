// src/primitives/overlay/BottomSheet.tsx
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

export type BottomSheetSlot =
  | "root"
  | "backdrop"
  | "positioner"
  | "focusScope"
  | "panel"
  | "handle"
  | "handleIndicator"
  | "header"
  | "title"
  | "description"
  | "closeButton"
  | "body"
  | "footer";

export type BottomSheetStyles =
  SlotStyleMap<BottomSheetSlot>;

export type BottomSheetSlotProps =
  SlotPropsMap<BottomSheetSlot>;

type BottomSheetRecipeVariants =
  Record<never, never>;

type BottomSheetRecipeState = {
  height?: number | string;
  maxHeight: number | string;
};

/**
 * La recipe traduce únicamente las propiedades visuales
 * y estructurales del BottomSheet.
 *
 * Portal, presencia, Motion, dismiss, foco y scroll lock
 * permanecen en sus sistemas correspondientes.
 */
const bottomSheetRecipe =
  defineSlotRecipe<
    BottomSheetSlot,
    BottomSheetRecipeVariants,
    BottomSheetRecipeState
  >({
    base: {
      root: {
        position: "fixed",
        inset: 0,

        zIndex:
          getLayerZIndex("modal"),

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

      positioner: {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,

        zIndex:
          getLayerZIndex("modal"),

        display: "flex",
        justifyContent: "center",

        pointerEvents: "auto",
      },

      focusScope: {
        width: "100%",

        display: "flex",
        justifyContent: "center",

        outline: "none",
      },

      panel: {
        width: "100%",
        minHeight: 0,

        display: "flex",
        flexDirection: "column",

        background:
          "var(--ui-surface)",

        color:
          "var(--ui-text)",

        borderTopLeftRadius:
          "var(--ui-radius-xl)",

        borderTopRightRadius:
          "var(--ui-radius-xl)",

        border:
          "1px solid var(--ui-border)",

        borderBottom: "none",

        boxShadow:
          "var(--ui-shadow-lg)",

        outline: "none",
        overflow: "hidden",

        paddingBottom:
          "env(safe-area-inset-bottom)",
      },

      handle: {
        padding:
          "0.65rem 1rem 0.35rem",
      },

      handleIndicator: {
        width: 42,
        height: 5,

        borderRadius:
          "var(--ui-radius-full)",

        background:
          "var(--ui-border-strong)",

        opacity: 0.8,
      },

      header: {
        padding:
          "0.85rem 1rem",

        borderBottom:
          "1px solid var(--ui-border)",

        minWidth: 0,
      },

      title: {
        margin: 0,

        color:
          "var(--ui-text)",

        fontSize: "1.05rem",
        fontWeight: 800,
        lineHeight: 1.2,
      },

      description: {
        margin:
          "0.35rem 0 0",
      },

      body: {
        flex: 1,
        minHeight: 0,

        overflowY: "auto",
        overflowX: "hidden",

        WebkitOverflowScrolling:
          "touch",

        overscrollBehavior:
          "contain",

        padding: "1rem",
      },

      footer: {
        padding:
          "0.85rem 1rem",

        borderTop:
          "1px solid var(--ui-border)",

        minWidth: 0,
      },
    },

    resolve: ({
      height,
      maxHeight,
    }) => ({
      panel: {
        height,
        maxHeight,
      },
    }),
  });

const DEFAULT_BOTTOM_SHEET_RECIPE_STYLES =
  bottomSheetRecipe({
    height: undefined,
    maxHeight:
      "min(82dvh, 760px)",
  });

type BottomSheetContextValue = {
  onOpenChange?: (
    open: boolean
  ) => void;

  recipeStyles:
  SlotStyleMap<BottomSheetSlot>;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
};

const BottomSheetContext =
  React.createContext<
    BottomSheetContextValue | null
  >(null);

function useOptionalBottomSheetContext() {
  return React.useContext(
    BottomSheetContext
  );
}

export interface BottomSheetProps {
  children?: React.ReactNode;

  open: boolean;

  onOpenChange?: (
    open: boolean
  ) => void;

  title?: React.ReactNode;
  description?: React.ReactNode;

  height?: number | string;
  maxHeight?: number | string;

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

  showHandle?: boolean;
  showCloseButton?: boolean;

  portalled?: boolean;

  container?:
  | Element
  | DocumentFragment
  | null;

  overlayId?: string;

  className?: string;
  style?: React.CSSProperties;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
}

export const BottomSheet:
  React.FC<BottomSheetProps> = ({
    children,
    open,
    onOpenChange,

    title,
    description,

    height,

    maxHeight =
    "min(82dvh, 760px)",

    closeOnEscape = true,

    closeOnPointerDownOutside =
    true,

    lockScroll = true,
    trapFocus = true,
    autoFocus = true,
    restoreFocus = true,

    initialFocusRef,

    showHandle = true,
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
      `bottom-sheet-${reactId}`;

    const titleId =
      `${overlayId}-title`;

    const descriptionId =
      `${overlayId}-description`;

    const handleClose =
      React.useCallback(() => {
        onOpenChange?.(false);
      }, [onOpenChange]);

    const recipeStyles =
      bottomSheetRecipe({
        height,
        maxHeight,
      });

    const contextValue =
      React.useMemo<
        BottomSheetContextValue
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
      resolveSlot<BottomSheetSlot>({
        slot: "root",
        styles,
        slotProps,

        baseProps: {
          "data-ui-bottom-sheet-root":
            "",

          "data-ui-bottom-sheet-open":
            open ||
            undefined,
        },

        baseStyle:
          recipeStyles.root,
      });

    const backdropSlot =
      resolveSlot<BottomSheetSlot>({
        slot: "backdrop",
        styles,
        slotProps,

        baseProps: {
          "aria-hidden": true,

          "data-ui-bottom-sheet-backdrop":
            "",
        },

        baseStyle:
          recipeStyles.backdrop,
      });

    const positionerSlot =
      resolveSlot<BottomSheetSlot>({
        slot: "positioner",
        styles,
        slotProps,

        baseProps: {
          "data-ui-bottom-sheet-positioner":
            "",
        },

        baseStyle:
          recipeStyles.positioner,
      });

    const focusScopeSlot =
      resolveSlot<BottomSheetSlot>({
        slot: "focusScope",
        styles,
        slotProps,

        baseProps: {
          "data-ui-bottom-sheet-focus-scope":
            "",
        },

        baseStyle:
          recipeStyles.focusScope,
      });

    const panelSlot =
      resolveSlot<BottomSheetSlot>({
        slot: "panel",
        styles,
        slotProps,
        className,
        style,

        baseProps: {
          "data-ui-bottom-sheet-panel":
            "",
        },

        baseStyle:
          recipeStyles.panel,
      });

    /*
     * La composición Motion permanece en core/motion.
     * La recipe no define estados animados ni transiciones.
     */
    const content = (
      <BottomSheetContext.Provider
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
             * pertenecen al sistema Overlay.
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
                  as="section"
                  kind="bottom-sheet"
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
                  {showHandle ? (
                    <BottomSheetHandle />
                  ) : null}

                  {title ||
                    description ||
                    showCloseButton ? (
                    <BottomSheetHeader>
                      <Box
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {title ? (
                          <BottomSheetTitle
                            id={titleId}
                          >
                            {title}
                          </BottomSheetTitle>
                        ) : null}

                        {description ? (
                          <BottomSheetDescription
                            id={
                              descriptionId
                            }
                          >
                            {description}
                          </BottomSheetDescription>
                        ) : null}
                      </Box>

                      {showCloseButton ? (
                        <BottomSheetClose
                          onClose={
                            handleClose
                          }
                        />
                      ) : null}
                    </BottomSheetHeader>
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
      </BottomSheetContext.Provider>
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

BottomSheet.displayName =
  "BottomSheet";

export interface BottomSheetHandleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  indicatorProps?:
  React.HTMLAttributes<HTMLDivElement>;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
}

export const BottomSheetHandle =
  React.forwardRef<
    HTMLDivElement,
    BottomSheetHandleProps
  >(
    (
      {
        indicatorProps,
        className = "",
        style,
        styles,
        slotProps,
        ...rest
      },
      ref
    ) => {
      const ctx =
        useOptionalBottomSheetContext();

      const {
        className:
        indicatorClassName,

        style:
        indicatorStyle,

        ...indicatorRest
      } = indicatorProps ?? {};

      const handleSlot =
        resolveSlot<BottomSheetSlot>({
          slot: "handle",

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
              .handle ??
            DEFAULT_BOTTOM_SHEET_RECIPE_STYLES
              .handle,
        });

      const handleIndicatorSlot =
        resolveSlot<BottomSheetSlot>({
          slot:
            "handleIndicator",

          styles:
            styles ??
            ctx?.styles,

          slotProps:
            slotProps ??
            ctx?.slotProps,

          className:
            indicatorClassName,

          style:
            indicatorStyle,

          baseProps: {
            "aria-hidden": true,
          },

          baseStyle:
            ctx?.recipeStyles
              .handleIndicator ??
            DEFAULT_BOTTOM_SHEET_RECIPE_STYLES
              .handleIndicator,
        });

      return (
        <Flex
          {...handleSlot}
          {...rest}
          ref={ref}
          justify="center"
          align="center"
        >
          <Box
            {...handleIndicatorSlot}
            {...indicatorRest}
          />
        </Flex>
      );
    }
  );

BottomSheetHandle.displayName =
  "BottomSheetHandle";

export interface BottomSheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
}

export const BottomSheetHeader =
  React.forwardRef<
    HTMLDivElement,
    BottomSheetHeaderProps
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
        useOptionalBottomSheetContext();

      const headerSlot =
        resolveSlot<BottomSheetSlot>({
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
            DEFAULT_BOTTOM_SHEET_RECIPE_STYLES
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

BottomSheetHeader.displayName =
  "BottomSheetHeader";

export interface BottomSheetBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
}

export const BottomSheetBody =
  React.forwardRef<
    HTMLDivElement,
    BottomSheetBodyProps
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
        useOptionalBottomSheetContext();

      const bodySlot =
        resolveSlot<BottomSheetSlot>({
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
            DEFAULT_BOTTOM_SHEET_RECIPE_STYLES
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

BottomSheetBody.displayName =
  "BottomSheetBody";

export interface BottomSheetFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
}

export const BottomSheetFooter =
  React.forwardRef<
    HTMLDivElement,
    BottomSheetFooterProps
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
        useOptionalBottomSheetContext();

      const footerSlot =
        resolveSlot<BottomSheetSlot>({
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
            DEFAULT_BOTTOM_SHEET_RECIPE_STYLES
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

BottomSheetFooter.displayName =
  "BottomSheetFooter";

export interface BottomSheetTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
}

export const BottomSheetTitle =
  React.forwardRef<
    HTMLHeadingElement,
    BottomSheetTitleProps
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
        useOptionalBottomSheetContext();

      const titleSlot =
        resolveSlot<BottomSheetSlot>({
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
            DEFAULT_BOTTOM_SHEET_RECIPE_STYLES
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

BottomSheetTitle.displayName =
  "BottomSheetTitle";

export interface BottomSheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
}

export const BottomSheetDescription =
  React.forwardRef<
    HTMLParagraphElement,
    BottomSheetDescriptionProps
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
        useOptionalBottomSheetContext();

      const descriptionSlot =
        resolveSlot<BottomSheetSlot>({
          slot:
            "description",

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
            DEFAULT_BOTTOM_SHEET_RECIPE_STYLES
              .description,
        });

      return (
        <Typography
          {...descriptionSlot}
          {...rest}
          ref={
            ref as React.Ref<HTMLElement>
          }
          as="p"
          size="sm"
          color="var(--ui-text-muted)"
        >
          {children}
        </Typography>
      );
    }
  );

BottomSheetDescription.displayName =
  "BottomSheetDescription";

export interface BottomSheetCloseProps {
  onClose?: () => void;

  ariaLabel?: string;

  className?: string;
  style?: React.CSSProperties;

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
}

export const BottomSheetClose =
  React.forwardRef<
    HTMLButtonElement,
    BottomSheetCloseProps
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
        useOptionalBottomSheetContext();

      const closeButtonSlot =
        resolveSlot<BottomSheetSlot>({
          slot:
            "closeButton",

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
            DEFAULT_BOTTOM_SHEET_RECIPE_STYLES
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

BottomSheetClose.displayName =
  "BottomSheetClose";