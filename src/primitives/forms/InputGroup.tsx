import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getElementSize,
  observeElementSizes,
} from "../../core/dom";

import {
  dataAttr,
} from "../../helpers";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  InputGroupContext,
  type InputAdornmentPosition,
  type InputGroupDescendantState,
} from "./input-group-context";

import {
  useFieldState,
} from "./use-field-control";


export type InputGroupSlot =
  "root";

export type InputGroupStyles =
  SlotStyleMap<InputGroupSlot>;

export type InputGroupSlotProps =
  SlotPropsMap<InputGroupSlot>;


export interface InputGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;

  rounded?:
    React.CSSProperties["borderRadius"];

  styles?: InputGroupStyles;
  slotProps?: InputGroupSlotProps;
}


type AdornmentRegistration = {
  id: string;

  position:
    InputAdornmentPosition;

  node:
    HTMLDivElement;

  width:
    number;

  dispose:
    () => void;
};


type AdornmentLayout = {
  startWidth: number;
  endWidth: number;

  offsets:
    Readonly<Record<string, number>>;
};


type AggregatedInteractionState = {
  focused: boolean;
  focusVisible: boolean;
};


type InputGroupCSSProperties =
  React.CSSProperties & {
    "--ui-input-group-radius"?:
      React.CSSProperties["borderRadius"];

    "--ui-input-group-start-size"?:
      string;

    "--ui-input-group-end-size"?:
      string;
  };


const EMPTY_ADORNMENT_LAYOUT:
  AdornmentLayout = {
    startWidth: 0,
    endWidth: 0,
    offsets: {},
  };


function sortByDocumentOrder(
  first:
    AdornmentRegistration,
  second:
    AdornmentRegistration
): number {
  if (
    first.node ===
    second.node
  ) {
    return 0;
  }

  const position =
    first.node
      .compareDocumentPosition(
        second.node
      );

  if (
    position &
    4
  ) {
    return -1;
  }

  if (
    position &
    2
  ) {
    return 1;
  }

  return 0;
}


export const InputGroup =
  forwardRef<
    HTMLDivElement,
    InputGroupProps
  >(
    (
      {
        children,

        className = "",
        style,

        invalid,
        disabled,
        required,
        readOnly,

        rounded =
          "var(--ui-radius-md)",

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const state =
        useFieldState({
          invalid,
          disabled,
          required,
          readOnly,
        });


      const descendantsRef =
        useRef<
          Map<
            string,
            InputGroupDescendantState
          >
        >(
          new Map()
        );


      const adornmentsRef =
        useRef<
          Map<
            string,
            AdornmentRegistration
          >
        >(
          new Map()
        );


      const [
        interaction,
        setInteraction,
      ] =
        useState<
          AggregatedInteractionState
        >({
          focused: false,
          focusVisible: false,
        });


      const [
        adornmentLayout,
        setAdornmentLayout,
      ] =
        useState<AdornmentLayout>(
          EMPTY_ADORNMENT_LAYOUT
        );


      const synchronizeInteraction =
        useCallback(() => {
          let focused = false;
          let focusVisible = false;

          descendantsRef.current
            .forEach(
              (descendant) => {
                focused =
                  focused ||
                  descendant.focused;

                focusVisible =
                  focusVisible ||
                  descendant.focusVisible;
              }
            );

          setInteraction(
            (current) =>
              current.focused ===
                focused &&
              current.focusVisible ===
                focusVisible
                ? current
                : {
                    focused,
                    focusVisible,
                  }
          );
        }, []);


      const updateDescendantState =
        useCallback(
          (
            id: string,
            nextState:
              InputGroupDescendantState
          ) => {
            descendantsRef.current
              .set(
                id,
                nextState
              );

            synchronizeInteraction();
          },
          [
            synchronizeInteraction,
          ]
        );


      const removeDescendantState =
        useCallback(
          (
            id: string
          ) => {
            descendantsRef.current
              .delete(id);

            synchronizeInteraction();
          },
          [
            synchronizeInteraction,
          ]
        );


      const recalculateAdornmentLayout =
        useCallback(() => {
          const registrations =
            Array.from(
              adornmentsRef.current
                .values()
            );

          const start =
            registrations
              .filter(
                (registration) =>
                  registration.position ===
                  "start"
              )
              .sort(
                sortByDocumentOrder
              );

          const end =
            registrations
              .filter(
                (registration) =>
                  registration.position ===
                  "end"
              )
              .sort(
                sortByDocumentOrder
              );

          const offsets:
            Record<string, number> = {};

          let startWidth = 0;

          start.forEach(
            (registration) => {
              offsets[
                registration.id
              ] =
                startWidth;

              startWidth +=
                registration.width;
            }
          );

          let endWidth = 0;

          [...end]
            .reverse()
            .forEach(
              (registration) => {
                offsets[
                  registration.id
                ] =
                  endWidth;

                endWidth +=
                  registration.width;
              }
            );

          setAdornmentLayout({
            startWidth,
            endWidth,
            offsets,
          });
        }, []);


      const registerAdornment =
        useCallback(
          (
            id: string,
            position:
              InputAdornmentPosition,
            node:
              HTMLDivElement
          ) => {
            const previous =
              adornmentsRef.current
                .get(id);

            previous?.dispose();

            const registration:
              AdornmentRegistration = {
                id,
                position,
                node,
                width: 0,
                dispose: () => {
                  // Se sustituye después
                  // de crear el observer.
                },
              };


            const update = () => {
              const nextWidth =
                Math.ceil(
                  getElementSize(
                    node
                  ).width
                );

              if (
                registration.width ===
                nextWidth
              ) {
                return;
              }

              registration.width =
                nextWidth;

              recalculateAdornmentLayout();
            };


            adornmentsRef.current
              .set(
                id,
                registration
              );

            registration.dispose =
              observeElementSizes(
                [node],
                update
              );

            update();

            return () => {
              const current =
                adornmentsRef.current
                  .get(id);

              if (
                current !==
                registration
              ) {
                return;
              }

              current.dispose();

              adornmentsRef.current
                .delete(id);

              recalculateAdornmentLayout();
            };
          },
          [
            recalculateAdornmentLayout,
          ]
        );


      const getAdornmentOffset =
        useCallback(
          (
            id: string
          ) =>
            adornmentLayout
              .offsets[id] ??
            0,
          [
            adornmentLayout.offsets,
          ]
        );


      const contextValue =
        useMemo(
          () => ({
            disabled:
              state.disabled,

            invalid:
              state.invalid,

            required:
              state.required,

            readOnly:
              state.readOnly,

            updateDescendantState,
            removeDescendantState,

            registerAdornment,
            getAdornmentOffset,

            startAdornmentWidth:
              adornmentLayout
                .startWidth,

            endAdornmentWidth:
              adornmentLayout
                .endWidth,
          }),
          [
            adornmentLayout.endWidth,
            adornmentLayout.startWidth,
            getAdornmentOffset,
            registerAdornment,
            removeDescendantState,
            state.disabled,
            state.invalid,
            state.readOnly,
            state.required,
            updateDescendantState,
          ]
        );


      const groupVariables:
        InputGroupCSSProperties = {
          "--ui-input-group-radius":
            rounded,

          "--ui-input-group-start-size":
            `${adornmentLayout.startWidth}px`,

          "--ui-input-group-end-size":
            `${adornmentLayout.endWidth}px`,
        };


      const rootSlot =
        resolveSlot<InputGroupSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui":
              "input-group",

            "data-invalid":
              dataAttr(
                state.invalid
              ),

            "data-disabled":
              dataAttr(
                state.disabled
              ),

            "data-required":
              dataAttr(
                state.required
              ),

            "data-readonly":
              dataAttr(
                state.readOnly
              ),

            "data-focused":
              dataAttr(
                interaction.focused
              ),

            "data-focus-visible":
              dataAttr(
                interaction
                  .focusVisible
              ),

            "data-has-start-adornment":
              dataAttr(
                adornmentLayout
                  .startWidth >
                  0
              ),

            "data-has-end-adornment":
              dataAttr(
                adornmentLayout
                  .endWidth >
                  0
              ),
          },

          baseStyle: {
            position:
              "relative",

            width:
              "100%",

            display:
              "flex",

            alignItems:
              "stretch",

            minWidth:
              0,

            ...groupVariables,
          },
        });


      return (
        <InputGroupContext.Provider
          value={
            contextValue
          }
        >
          <div
            {...rootSlot}
            ref={ref}
            {...rest}
          >
            {children}
          </div>
        </InputGroupContext.Provider>
      );
    }
  );


InputGroup.displayName =
  "InputGroup";
