// src/primitives/disclosure/Collapsible.tsx
import React from "react";
import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  MotionPresenceGroup,
  getCollapsibleContentVariants,
  getCollapsibleTriggerIconVariants,
  useOptionalUIMotion,
} from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Box, Flex } from "../layout";
import { setRef } from "../../core/interaction/events";

export type CollapsibleSlot =
  | "trigger"
  | "triggerContent"
  | "triggerIcon"
  | "content"
  | "inner";

export type CollapsibleStyles =
  SlotStyleMap<CollapsibleSlot>;

export type CollapsibleSlotProps =
  SlotPropsMap<CollapsibleSlot>;

const COLLAPSIBLE_BASE_STYLES = {
  trigger: {
    width: "100%",
    minWidth: 0,

    border: "none",
    borderRadius: "var(--ui-radius-sm)",

    background: "transparent",
    color: "var(--ui-text)",

    padding: 0,

    textAlign: "left",
    font: "inherit",

    outline: "none",

    WebkitTapHighlightColor: "transparent",
  },

  triggerContent: {
    flex: 1,
    minWidth: 0,
  },

  triggerIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    flexShrink: 0,

    color: "var(--ui-text-muted)",
  },

  content: {
    overflow: "hidden",
    minWidth: 0,
  },

  inner: {
    minWidth: 0,
  },
} satisfies Record<
  CollapsibleSlot,
  React.CSSProperties
>;

type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;

  contentId: string;
  triggerId: string;

  onOpenChange?: (
    open: boolean
  ) => void;
};

const CollapsibleContext =
  React.createContext<
    CollapsibleContextValue | null
  >(null);

function useCollapsibleContext() {
  const ctx =
    React.useContext(
      CollapsibleContext
    );

  if (!ctx) {
    throw new Error(
      "Collapsible subcomponents must be used inside <Collapsible />"
    );
  }

  return ctx;
}

type TriggerChildProps = {
  id?: string;
  disabled?: boolean;

  className?: string;
  style?: React.CSSProperties;

  "aria-expanded"?: boolean;
  "aria-controls"?: string;

  onClick?:
  React.MouseEventHandler<HTMLElement>;

  onKeyDown?:
  React.KeyboardEventHandler<HTMLElement>;
};

export interface CollapsibleProps {
  children?: React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;

  onOpenChange?: (
    open: boolean
  ) => void;

  disabled?: boolean;
  id?: string;
}

export const Collapsible:
  React.FC<CollapsibleProps> = ({
    children,

    open,
    defaultOpen = false,

    onOpenChange,

    disabled = false,
    id,
  }) => {
    const reactId =
      React.useId().replace(
        /:/g,
        ""
      );

    const baseId =
      id ??
      `collapsible-${reactId}`;

    const isControlled =
      open !== undefined;

    const [
      internalOpen,
      setInternalOpen,
    ] = React.useState(
      defaultOpen
    );

    const currentOpen =
      isControlled
        ? Boolean(open)
        : internalOpen;

    const handleOpenChange =
      React.useCallback(
        (
          nextOpen: boolean
        ) => {
          if (disabled) {
            return;
          }

          if (
            !isControlled
          ) {
            setInternalOpen(
              nextOpen
            );
          }

          onOpenChange?.(
            nextOpen
          );
        },
        [
          disabled,
          isControlled,
          onOpenChange,
        ]
      );

    const value =
      React.useMemo<
        CollapsibleContextValue
      >(
        () => ({
          open:
            currentOpen,

          disabled,

          triggerId:
            `${baseId}-trigger`,

          contentId:
            `${baseId}-content`,

          onOpenChange:
            handleOpenChange,
        }),
        [
          baseId,
          currentOpen,
          disabled,
          handleOpenChange,
        ]
      );

    return (
      <CollapsibleContext.Provider
        value={value}
      >
        {children}
      </CollapsibleContext.Provider>
    );
  };

Collapsible.displayName =
  "Collapsible";

export interface CollapsibleTriggerProps {
  children?:
  | React.ReactNode
  | ((
    state: {
      open: boolean;
    }
  ) => React.ReactNode);

  asChild?: boolean;

  className?: string;
  style?: React.CSSProperties;

  showIcon?: boolean;

  styles?: CollapsibleStyles;
  slotProps?: CollapsibleSlotProps;
}

export const CollapsibleTrigger =
  React.forwardRef<
    HTMLButtonElement,
    CollapsibleTriggerProps
  >(
    (
      {
        children,

        asChild = false,

        className = "",
        style,

        showIcon = true,

        styles,
        slotProps,
      },
      ref
    ) => {
      const ctx =
        useCollapsibleContext();

      const motionState =
        useOptionalUIMotion();

      const handleToggle =
        React.useCallback(() => {
          ctx.onOpenChange?.(
            !ctx.open
          );
        }, [
          ctx.onOpenChange,
          ctx.open,
        ]);

      const content =
        typeof children ===
          "function"
          ? children({
            open: ctx.open,
          })
          : children;

      const triggerSlot =
        resolveSlot<CollapsibleSlot>({
          slot: "trigger",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-collapsible-trigger":
              "",

            "data-open":
              ctx.open ||
              undefined,

            "data-disabled":
              ctx.disabled ||
              undefined,
          },

          baseStyle:
            COLLAPSIBLE_BASE_STYLES.trigger,
        });

      const triggerContentSlot =
        resolveSlot<CollapsibleSlot>({
          slot:
            "triggerContent",

          styles,
          slotProps,

          baseStyle:
            COLLAPSIBLE_BASE_STYLES
              .triggerContent,
        });

      const triggerIconSlot =
        resolveSlot<CollapsibleSlot>({
          slot:
            "triggerIcon",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden": true,

            "data-ui-collapsible-trigger-icon":
              "",
          },

          baseStyle:
            COLLAPSIBLE_BASE_STYLES
              .triggerIcon,
        });

      const triggerIconVariants =
        getCollapsibleTriggerIconVariants();

      const {
        onClick:
        triggerSlotOnClick,
        onKeyDown:
        triggerSlotOnKeyDown,
        ...triggerSlotRest
      } = triggerSlot;

      if (
        asChild &&
        React.isValidElement<
          TriggerChildProps
        >(content)
      ) {
        const childDisabled =
          ctx.disabled ||
          Boolean(
            content.props.disabled
          );

        const mergedClassName = [
          triggerSlotRest.className,
          content.props.className,
        ]
          .filter(Boolean)
          .join(" ") ||
          undefined;

        const mergedStyle = {
          ...triggerSlotRest.style,
          ...content.props.style,
        };

        return React.cloneElement(
          content,
          {
            ...triggerSlotRest,

            ref: (
              node:
                | HTMLElement
                | null
            ) => {
              setRef(
                ref as React.Ref<HTMLElement>,
                node
              );

              setRef(
                (
                  content as React.ReactElement & {
                    ref?: React.Ref<HTMLElement>;
                  }
                ).ref,
                node
              );
            },

            id: ctx.triggerId,

            disabled:
              childDisabled,

            "aria-disabled":
              childDisabled ||
              undefined,

            "aria-expanded":
              ctx.open,

            "aria-controls":
              ctx.contentId,

            "data-disabled":
              childDisabled ||
              undefined,

            className:
              mergedClassName,

            style:
              mergedStyle,

            onClick: (
              event:
                React.MouseEvent<HTMLElement>
            ) => {
              content.props
                .onClick?.(
                  event
                );

              if (
                event.defaultPrevented
              ) {
                return;
              }

              triggerSlotOnClick?.(
                event
              );

              if (
                event.defaultPrevented ||
                childDisabled
              ) {
                return;
              }

              handleToggle();
            },

            onKeyDown: (
              event:
                React.KeyboardEvent<HTMLElement>
            ) => {
              content.props
                .onKeyDown?.(
                  event
                );

              if (
                event.defaultPrevented
              ) {
                return;
              }

              triggerSlotOnKeyDown?.(
                event
              );
            },
          } as TriggerChildProps & {
            ref: React.Ref<HTMLElement>;
          }
        );
      }

      return (
        <button
          {...triggerSlotRest}
          ref={ref}
          id={ctx.triggerId}
          type="button"
          aria-expanded={
            ctx.open
          }
          aria-controls={
            ctx.contentId
          }
          disabled={
            ctx.disabled
          }
          onClick={(event) => {
            triggerSlotOnClick?.(
              event
            );

            if (
              event.defaultPrevented ||
              ctx.disabled
            ) {
              return;
            }

            handleToggle();
          }}
          onKeyDown={
            triggerSlotOnKeyDown
          }
        >
          <Flex
            align="center"
            justify="space-between"
            gap="0.75rem"
          >
            <Box
              {...triggerContentSlot}
            >
              {content}
            </Box>

            {showIcon ? (
              <motion.span
                {...toMotionSlotProps(
                  triggerIconSlot
                )}
                variants={
                  triggerIconVariants
                }
                initial={false}
                animate={
                  ctx.open
                    ? "open"
                    : "closed"
                }
                transition={motionState.getTransition(
                  motionState.effectiveLevel,
                  ctx.open
                    ? "expand"
                    : "collapse"
                )}
              >
                <ChevronDown
                  size={18}
                />
              </motion.span>
            ) : null}
          </Flex>
        </button>
      );
    }
  );

CollapsibleTrigger.displayName =
  "CollapsibleTrigger";

export interface CollapsibleContentProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "children"
    | "ref"
    | "initial"
    | "animate"
    | "exit"
    | "variants"
    | "transition"
    | "custom"
    | "style"
    | "className"
  > {
  children?: React.ReactNode;

  forceMount?: boolean;
  unmountOnExit?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: CollapsibleStyles;
  slotProps?: CollapsibleSlotProps;
}

export const CollapsibleContent =
  React.forwardRef<
    HTMLDivElement,
    CollapsibleContentProps
  >(
    (
      {
        children,

        forceMount = false,
        unmountOnExit = true,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const ctx =
        useCollapsibleContext();

      const motionState =
        useOptionalUIMotion();

      const shouldRender =
        forceMount ||
        ctx.open ||
        !unmountOnExit;

      const contentSlot =
        resolveSlot<CollapsibleSlot>({
          slot: "content",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-collapsible-content":
              "",

            "data-open":
              ctx.open ||
              undefined,
          },

          baseStyle:
            COLLAPSIBLE_BASE_STYLES.content,
        });

      const innerSlot =
        resolveSlot<CollapsibleSlot>({
          slot: "inner",

          styles,
          slotProps,

          baseProps: {
            "data-ui-collapsible-inner":
              "",
          },

          baseStyle:
            COLLAPSIBLE_BASE_STYLES.inner,
        });

      const contentVariants =
        getCollapsibleContentVariants();

      const content =
        shouldRender ? (
          <motion.div
            {...rest}
            {...toMotionSlotProps(
              contentSlot
            )}
            key="collapsible-content"
            id={ctx.contentId}
            role="region"
            aria-labelledby={
              ctx.triggerId
            }
            ref={ref}
            variants={
              contentVariants
            }
            initial={false}
            animate={
              ctx.open
                ? "open"
                : "closed"
            }
            exit="exit"
            transition={motionState.getTransition(
              motionState.effectiveLevel,
              ctx.open
                ? "expand"
                : "collapse"
            )}
          >
            <div
              {...innerSlot}
            >
              {children}
            </div>
          </motion.div>
        ) : null;

      if (
        !unmountOnExit ||
        forceMount
      ) {
        return content;
      }

      return (
        <MotionPresenceGroup
          initial={false}
        >
          {ctx.open
            ? content
            : null}
        </MotionPresenceGroup>
      );
    }
  );

CollapsibleContent.displayName =
  "CollapsibleContent";