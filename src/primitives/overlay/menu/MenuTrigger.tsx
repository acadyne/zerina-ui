import React from "react";

import {
  resolveSlot,
} from "../../../helpers/css";

import {
  setRef,
} from "../../../core/interaction/events";

import type {
  UIPressEvent,
} from "../../../core/interaction";

import {
  useMenuContext,
} from "./menu.context";

import type {
  MenuSlot,
  MenuTriggerProps,
  TriggerChildProps,
} from "./menu.types";


export const MenuTrigger = React.forwardRef<HTMLElement, MenuTriggerProps>(
  (
    {
      children,
      asChild = true,
      className = "",
      style,
      styles,
      slotProps,
    },
    ref
  ) => {
    const ctx = useMenuContext();

    const focusTimerRef =
      React.useRef<number | null>(null);

    const {
      focusFirst,
      focusLast,
      onOpenChange,
    } = ctx;

    const triggerSlot = resolveSlot<MenuSlot>({
      slot: "trigger",
      styles: styles ?? ctx.styles,
      slotProps: slotProps ?? ctx.slotProps,
      className,
      style,
    });

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        ctx.setAnchorNode(node);
        setRef(ref, node);
        setRef(
          (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref,
          node
        );
      },
      [children, ctx, ref]
    );

    React.useEffect(() => {
      return () => {
        if (focusTimerRef.current !== null) {
          window.clearTimeout(
            focusTimerRef.current
          );
        }
      };
    }, []);

    const scheduleFocus =
      React.useCallback(
        (focus: () => void) => {
          if (focusTimerRef.current !== null) {
            window.clearTimeout(
              focusTimerRef.current
            );
          }

          focusTimerRef.current =
            window.setTimeout(() => {
              focusTimerRef.current = null;
              focus();
            }, 0);
        },
        []
      );

    const openAndFocusFirst =
      React.useCallback(() => {
        onOpenChange?.(true);
        scheduleFocus(focusFirst);
      }, [
        focusFirst,
        onOpenChange,
        scheduleFocus,
      ]);

    const openAndFocusLast =
      React.useCallback(() => {
        onOpenChange?.(true);
        scheduleFocus(focusLast);
      }, [
        focusLast,
        onOpenChange,
        scheduleFocus,
      ]);



    if (asChild && React.isValidElement<TriggerChildProps>(children)) {
      return React.cloneElement(children, {
        ref: setRefs,
        id: ctx.triggerId,
        className: [children.props.className, triggerSlot.className]
          .filter(Boolean)
          .join(" "),
        style: {
          ...children.props.style,
          ...triggerSlot.style,
        },
        "aria-haspopup": "menu",
        "aria-expanded": ctx.open,
        "aria-controls": ctx.open ? ctx.contentId : undefined,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          children.props.onClick?.(event);
          ctx.onOpenChange?.(!ctx.open);
        },

        onPress: (event: UIPressEvent<HTMLElement>) => {
          children.props.onPress?.(event);
          ctx.onOpenChange?.(!ctx.open);
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          children.props.onKeyDown?.(event);

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            ctx.onOpenChange?.(!ctx.open);
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            openAndFocusFirst();
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            openAndFocusLast();
          }
        },
      } as TriggerChildProps & { ref: React.Ref<HTMLElement> });
    }

    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        id={ctx.triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={ctx.open}
        aria-controls={ctx.open ? ctx.contentId : undefined}
        className={triggerSlot.className}
        style={triggerSlot.style}
        onClick={() => ctx.onOpenChange?.(!ctx.open)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            ctx.onOpenChange?.(!ctx.open);
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            openAndFocusFirst();
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            openAndFocusLast();
          }
        }}
      >
        {children}
      </button>
    );
  }
);

MenuTrigger.displayName = "MenuTrigger";