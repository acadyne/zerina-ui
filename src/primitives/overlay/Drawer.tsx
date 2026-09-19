// src/primitives/overlay/Drawer.tsx
import React from "react";

import {
  hasRenderableNode,
} from "../../core/react/nodePresence";
import { resolveOverlayId } from "../../core/overlay/overlayId";
import { X } from "lucide-react";
import {
  getLayerZIndex,
} from "../../core/overlay";
import type {
  UIOverlayPlacement,
} from "../../core/motion/motion.overlay";
import {
  defineSlotRecipe,
  resolveContextualSlot,
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { maxSafeAreaOffset } from "../../helpers/safeArea";
import { IconButton } from "../forms";
import { Box, Flex } from "../layout";
import { Typography } from "../typography";

import {
  ModalOverlayRuntime,
} from "./shared/ModalOverlayRuntime";

export type DrawerPlacement =
  UIOverlayPlacement;

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
      background: "var(--ui-interaction-overlay)",
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

    /*
     * Estos defaults viven en la recipe: styles y slotProps deben poder
     * reemplazarlos sin que Flex los imponga de nuevo desde JSX.
     */
    header: {
      padding:
        `${maxSafeAreaOffset("1rem", "top")} 1rem 0.85rem`,

      borderBottom:
        "1px solid var(--ui-border)",

      minWidth: 0,

      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "0.75rem",
    },

    title: {
      margin: 0,

      color: "var(--ui-text)",

      fontSize: "1.05rem",
      fontWeight: 800,
      lineHeight: 1.2,
    },

    /*
     * La semántica del párrafo permanece en JSX; tamaño y color son
     * defaults visuales y deben seguir la precedencia del slot.
     */
    description: {
      margin: "0.35rem 0 0",

      color: "var(--ui-text-muted)",
      fontSize: "var(--ui-font-size-sm)",
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
        `0.85rem 1rem ${maxSafeAreaOffset("1rem", "bottom")}`,

      borderTop:
        "1px solid var(--ui-border)",

      minWidth: 0,

      alignItems: "center",
      justifyContent: "flex-end",
      gap: "0.75rem",
      flexWrap: "wrap",
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

  /**
   * Escape experto: `false` transfiere al consumidor la entrada inicial de
   * foco, que debe permanecer dentro del Drawer modal.
   */
  autoFocus?: boolean;

  /** Desactívalo solo si otro owner restaurará el foco al cerrar. */
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
      resolveOverlayId(
        overlayIdProp,
        reactId,
        "drawer"
      );

    const titleId =
      `${overlayId}-title`;

    const descriptionId =
      `${overlayId}-description`;

    const hasTitle =
      hasRenderableNode(title);

    const hasDescription =
      hasRenderableNode(description);

    const hasHeader =
      hasTitle ||
      hasDescription ||
      showCloseButton;

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
      resolveContextualSlot<DrawerSlot>({
        slot: "root",
        styles,
        slotProps,

        baseProps: {
          "data-ui-drawer-root":
            "",

          "data-open":
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

    return (
      <DrawerContext.Provider
        value={contextValue}
      >
        <ModalOverlayRuntime
          open={open}
          overlayId={
            overlayId
          }
          onDismiss={
            handleClose
          }
          closeOnEscape={
            closeOnEscape
          }
          closeOnPointerDownOutside={
            closeOnPointerDownOutside
          }
          autoFocus={
            autoFocus
          }
          restoreFocus={
            restoreFocus
          }
          initialFocusRef={
            initialFocusRef
          }
          portalled={
            portalled
          }
          container={
            container
          }
          rootSlot={
            toMotionSlotProps(
              rootSlot,
            )
          }
          backdropSlot={
            toMotionSlotProps(
              backdropSlot,
            )
          }
          dismissableLayerSlot={
            positionerSlot
          }
          focusScopeSlot={
            focusScopeSlot
          }
          panelSlot={
            toMotionSlotProps(
              panelSlot,
            )
          }
          panelAs="aside"
          panelKind="drawer"
          panelPlacement={
            placement
          }
          labelledBy={
            hasTitle
              ? titleId
              : undefined
          }
          describedBy={
            hasDescription
              ? descriptionId
              : undefined
          }
        >
          {hasHeader ? (
            <DrawerHeader>
              <Box
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {hasTitle ? (
                  <DrawerTitle
                    id={titleId}
                  >
                    {title}
                  </DrawerTitle>
                ) : null}

                {hasDescription ? (
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
        </ModalOverlayRuntime>
      </DrawerContext.Provider>
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
        resolveContextualSlot<DrawerSlot>({
          slot: "header",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

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
        resolveContextualSlot<DrawerSlot>({
          slot: "body",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

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
        resolveContextualSlot<DrawerSlot>({
          slot: "footer",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

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
        resolveContextualSlot<DrawerSlot>({
          slot: "title",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

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
        resolveContextualSlot<DrawerSlot>({
          slot: "description",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

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
        resolveContextualSlot<DrawerSlot>({
          slot: "closeButton",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

          className,
          style,

          baseStyle:
            ctx?.recipeStyles
              .closeButton ??
            DEFAULT_DRAWER_RECIPE_STYLES
              .closeButton,
        });

      /*
       * size y variant definen el control de cierre especializado;
       * el slot solo personaliza su presentación.
       */
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
