// src/components/display/Tag.tsx
import React from "react";
import {
  hasRenderableNode,
} from "../../core/react/nodePresence";

import {
  usePress,
} from "../../core/interaction";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  interactiveStateRecipe,
} from "../../theme/recipes";

import {
  statusLabelRecipe,
  type StatusLabelColorScheme,
  type StatusLabelVariant,
} from "./status-label-recipe";


export type TagVariant =
  StatusLabelVariant;

export type TagColorScheme =
  StatusLabelColorScheme;

export type TagSlot =
  | "root"
  | "leftIcon"
  | "content"
  | "rightIcon"
  | "removeButton";


export type TagStyles =
  SlotStyleMap<TagSlot>;


export type TagSlotProps =
  SlotPropsMap<TagSlot>;


export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?:
    React.ReactNode;

  variant?:
    TagVariant;

  colorScheme?:
    TagColorScheme;

  rounded?:
    React.CSSProperties["borderRadius"];

  leftIcon?:
    React.ReactNode;

  rightIcon?:
    React.ReactNode;

  onRemove?:
    () => void;

  removable?:
    boolean;

  className?:
    string;

  style?:
    React.CSSProperties;

  styles?:
    TagStyles;

  slotProps?:
    TagSlotProps;
}


export const Tag =
  React.forwardRef<
    HTMLSpanElement,
    TagProps
  >(
    (
      {
        children,

        variant =
          "subtle",

        colorScheme =
          "neutral",

        rounded =
          "var(--ui-radius-full)",

        leftIcon,
        rightIcon,

        onRemove,

        removable =
          false,

        className =
          "",

        style,

        styles,
        slotProps,

        ...rest
      },
      ref,
    ) => {
      const recipeStyles =
        statusLabelRecipe({
          variant,
          colorScheme,
        });


      const showRemove =
        removable ||
        Boolean(
          onRemove,
        );


      const removeButtonSlotProps =
        slotProps?.removeButton;


      const {
        onPointerEnter:
          slotOnPointerEnter,

        onPointerLeave:
          slotOnPointerLeave,

        onPointerDown:
          slotOnPointerDown,

        onPointerUp:
          slotOnPointerUp,

        onPointerCancel:
          slotOnPointerCancel,

        onLostPointerCapture:
          slotOnLostPointerCapture,

        onFocus:
          slotOnFocus,

        onBlur:
          slotOnBlur,

        onKeyDown:
          slotOnKeyDown,

        onKeyUp:
          slotOnKeyUp,

        onClick:
          slotOnClick,
      } =
        removeButtonSlotProps ??
        {};


      const removePress =
        usePress<HTMLButtonElement>({
          disabled:
            !onRemove,

          nativeInteractive:
            true,

          onPress:
            () => {
              onRemove?.();
            },

          onPointerEnter:
            slotOnPointerEnter,

          onPointerLeave:
            slotOnPointerLeave,

          onPointerDown:
            slotOnPointerDown,

          onPointerUp:
            slotOnPointerUp,

          onPointerCancel:
            slotOnPointerCancel,

          onLostPointerCapture:
            slotOnLostPointerCapture,

          onFocus:
            slotOnFocus,

          onBlur:
            slotOnBlur,

          onKeyDown:
            slotOnKeyDown,

          onKeyUp:
            slotOnKeyUp,

          onClick:
            (
              event,
            ) => {
              event.stopPropagation();

              slotOnClick?.(
                event,
              );
            },
        });


      const rootSlot =
        resolveSlot<TagSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-tag":
              "",

            "data-ui-tag-variant":
              variant,

            "data-ui-tag-color-scheme":
              colorScheme,
          },

          baseStyle: {
            ...recipeStyles.root,

            minHeight:
              28,

            padding:
              "0.28rem 0.7rem",

            fontSize:
              "0.78rem",

            fontWeight:
              600,

            borderRadius:
              rounded,

            letterSpacing:
              "0.01em",
          },
        });


      const iconBaseStyle:
        React.CSSProperties = {
          display:
            "inline-flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          flexShrink:
            0,
        };


      const leftIconSlot =
        resolveSlot<TagSlot>({
          slot:
            "leftIcon",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,
          },

          baseStyle:
            iconBaseStyle,
        });


      const contentSlot =
        resolveSlot<TagSlot>({
          slot:
            "content",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.content,
        });


      const rightIconSlot =
        resolveSlot<TagSlot>({
          slot:
            "rightIcon",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,
          },

          baseStyle:
            iconBaseStyle,
        });


      const removeButtonSlot =
        resolveSlot<TagSlot>({
          slot:
            "removeButton",

          styles,
          slotProps,

          baseProps: {
            "data-ui-tag-remove":
              "",

            "data-ui-interactive":
              "",

            "data-ui-interactive-target":
              "",

            "data-disabled":
              !onRemove ||
              undefined,

            "aria-label":
              "Quitar",

            "data-hovered":
              removePress
                .state
                .hovered ||
              undefined,

            "data-pressed":
              removePress
                .state
                .pressed ||
              undefined,

            "data-focused":
              removePress
                .state
                .focused ||
              undefined,

            "data-focus-visible":
              removePress
                .state
                .focusVisible ||
              undefined,
          },

          baseStyle: {
            ...interactiveStateRecipe({
              tone:
                "neutral",

              emphasis:
                "text",
            }),

            marginLeft:
              "0.1rem",

            display:
              "inline-flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            width:
              18,

            height:
              18,

            borderRadius:
              "var(--ui-radius-full)",

            borderWidth:
              0,

            padding:
              0,

            lineHeight:
              1,

            flexShrink:
              0,
          },
        });


      return (
        <span
          {...rootSlot}
          ref={ref}
          {...rest}
        >
          {
            hasRenderableNode(
              leftIcon
            )
              ? (
                  <span
                    {...leftIconSlot}
                  >
                    {leftIcon}
                  </span>
                )
              : null
          }


          <span
            {...contentSlot}
          >
            {children}
          </span>


          {
            hasRenderableNode(
              rightIcon
            )
              ? (
                  <span
                    {...rightIconSlot}
                  >
                    {rightIcon}
                  </span>
                )
              : null
          }


          {
            showRemove
              ? (
                  <button
                    {...removeButtonSlot}
                    {...removePress.pressProps}

                    type="button"

                    disabled={
                      !onRemove
                    }
                  >
                    ×
                  </button>
                )
              : null
          }
        </span>
      );
    },
  );


Tag.displayName =
  "Tag";
