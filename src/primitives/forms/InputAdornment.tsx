import React, {
  forwardRef,
  useCallback,
  useId,
  useState,
} from "react";
import { useIsomorphicLayoutEffect } from "../../core/react/useIsomorphicLayoutEffect";

import {
  setRef,
} from "../../core/interaction/events";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  useInputGroupContext,
  type InputAdornmentPosition as InputGroupAdornmentPosition,
} from "./input-group-context";


export type InputAdornmentPosition =
  InputGroupAdornmentPosition;


export type InputAdornmentSlot =
  "root";

export type InputAdornmentStyles =
  SlotStyleMap<InputAdornmentSlot>;

export type InputAdornmentSlotProps =
  SlotPropsMap<InputAdornmentSlot>;


export interface InputAdornmentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?:
    React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  position?:
    InputAdornmentPosition;

  width?:
    React.CSSProperties["width"];

  pointerEvents?:
    React.CSSProperties["pointerEvents"];

  styles?:
    InputAdornmentStyles;

  slotProps?:
    InputAdornmentSlotProps;
}


export const InputAdornment =
  forwardRef<
    HTMLDivElement,
    InputAdornmentProps
  >(
    (
      {
        children,

        className = "",
        style,

        position =
          "end",

        width,

        pointerEvents =
          "auto",

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const context =
        useInputGroupContext();

      const adornmentId =
        useId();

      const [
        node,
        setNode,
      ] =
        useState<
          HTMLDivElement | null
        >(null);


      const setRefs =
        useCallback(
          (
            nextNode:
              HTMLDivElement | null
          ) => {
            setNode(
              (currentNode) =>
                currentNode ===
                  nextNode
                  ? currentNode
                  : nextNode
            );

            setRef(
              ref,
              nextNode
            );
          },
          [
            ref,
          ]
        );


      const registerAdornment =
        context?.registerAdornment;


      useIsomorphicLayoutEffect(() => {
        if (
          !node ||
          !registerAdornment
        ) {
          return;
        }

        return registerAdornment(
          adornmentId,
          position,
          node
        );
      }, [
        adornmentId,
        node,
        position,
        registerAdornment,
      ]);


      const offset =
        context?.getAdornmentOffset(
          adornmentId
        ) ??
        0;


      const rootSlot =
        resolveSlot<InputAdornmentSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui":
              "input-adornment",

            "data-position":
              position,
          },

          baseStyle: {
            position:
              "absolute",

            top:
              0,

            bottom:
              0,

            insetInlineStart:
              position ===
              "start"
                ? offset
                : undefined,

            insetInlineEnd:
              position ===
              "end"
                ? offset
                : undefined,

            zIndex:
              1,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap:
              "0.35rem",

            width,

            minWidth:
              0,

            paddingInline:
              "0.25rem",

            pointerEvents,
          },
        });


      return (
        <div
          {...rootSlot}
          ref={setRefs}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );


InputAdornment.displayName =
  "InputAdornment";
