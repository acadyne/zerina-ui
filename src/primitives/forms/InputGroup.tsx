// src/primitives/forms/InputGroup.tsx
import React, {
  Children,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getElementSize,
  observeElementSizes,
} from "../../core/dom";
import {
  defineSlotRecipe,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { FormControlContext } from "./FormControl";
import { setRef } from "../../core/interaction/events";

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

  isInvalid?: boolean;
  isDisabled?: boolean;

  rounded?:
  React.CSSProperties["borderRadius"];

  styles?: InputGroupStyles;
  slotProps?: InputGroupSlotProps;
}

type MeasuredNodeMap =
  Map<number, HTMLDivElement>;

type SupportedControlKind =
  | "input"
  | "textarea"
  | "select";

type InputSlotKind =
  "input-right-element";

type ControlSize =
  | "sm"
  | "md"
  | "lg";

const CONTROL_BASE_RIGHT_PADDING:
  Record<ControlSize, string> = {
  sm: "0.75rem",
  md: "0.9rem",
  lg: "1rem",
};

type SupportedControlProps = {
  size?: ControlSize;

  rightPadding?:
  | number
  | string;

  indicatorOffset?:
  | number
  | string;

  rounded?:
  React.CSSProperties["borderRadius"];

  isInvalid?: boolean;
  isDisabled?: boolean;

  variant?:
  | "outline"
  | "unstyled";
};

type RightElementProps = {
  ref?: React.Ref<HTMLDivElement>;
};

type UIElementType =
  React.ElementType & {
    __UI_CONTROL_KIND?:
    SupportedControlKind;

    __UI_SLOT_KIND?:
    InputSlotKind;

    displayName?: string;
    name?: string;
  };

type UIElementWithMarkers<
  P = Record<string, unknown>,
> = React.ReactElement<P> & {
  type: UIElementType;
};

function isReactElementWithMarkers(
  value: React.ReactNode
): value is UIElementWithMarkers {
  return (
    isValidElement(value) &&
    typeof value.type !== "string"
  );
}

function getControlKind(
  element: UIElementWithMarkers
):
  | SupportedControlKind
  | undefined {
  return element.type
    .__UI_CONTROL_KIND;
}

function getSlotKind(
  element: UIElementWithMarkers
):
  | InputSlotKind
  | undefined {
  return element.type
    .__UI_SLOT_KIND;
}

function isRightElement(
  element: UIElementWithMarkers
): element is UIElementWithMarkers<RightElementProps> {
  return (
    getSlotKind(element) ===
    "input-right-element"
  );
}

function isSupportedControl(
  element: UIElementWithMarkers
): element is UIElementWithMarkers<SupportedControlProps> {
  const kind =
    getControlKind(element);

  return (
    kind === "input" ||
    kind === "textarea" ||
    kind === "select"
  );
}

function getControlSize(
  element:
    UIElementWithMarkers<SupportedControlProps>
): ControlSize {
  const size =
    element.props.size;

  return size === "sm" ||
    size === "lg"
    ? size
    : "md";
}

type InputGroupRecipeVariants =
  Record<never, never>;

type InputGroupRecipeState = {
  rounded:
  React.CSSProperties["borderRadius"];

  invalid: boolean;
  disabled: boolean;
};

const inputGroupRecipe =
  defineSlotRecipe<
    InputGroupSlot,
    InputGroupRecipeVariants,
    InputGroupRecipeState
  >({
    base: {
      root: {
        position: "relative",

        width: "100%",

        display: "flex",
        alignItems: "stretch",

        minWidth: 0,

        background:
          "var(--ui-surface)",

        transition:
          "border-color var(--ui-duration-normal) var(--ui-ease-standard), " +
          "box-shadow var(--ui-duration-normal) var(--ui-ease-standard), " +
          "opacity var(--ui-duration-normal) var(--ui-ease-standard), " +
          "background var(--ui-duration-normal) var(--ui-ease-standard)",
      },
    },

    resolve: ({
      rounded,
      invalid,
      disabled,
    }) => ({
      root: {
        borderRadius:
          rounded,

        border:
          `1px solid ${invalid
            ? "var(--ui-danger)"
            : "var(--ui-border)"
          }`,

        opacity: disabled
          ? "var(--ui-state-disabled-opacity, 0.65)"
          : 1,
      },
    }),
  });

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

        isInvalid,
        isDisabled,

        rounded =
        "var(--ui-radius-md)",

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const ctx =
        useContext(
          FormControlContext
        );

      const [
        rightWidth,
        setRightWidth,
      ] = useState(0);

      const rightElementNodesRef =
        useRef<MeasuredNodeMap>(
          new Map()
        );

      const finalInvalid =
        isInvalid ??
        ctx?.isInvalid ??
        false;

      const finalDisabled =
        isDisabled ??
        ctx?.isDisabled ??
        false;

      const rightElementCount =
        useMemo(() => {
          let count = 0;

          Children.forEach(
            children,
            (child) => {
              if (
                isReactElementWithMarkers(
                  child
                ) &&
                isRightElement(
                  child
                )
              ) {
                count += 1;
              }
            }
          );

          return count;
        }, [children]);

      useEffect(() => {
        const nodes =
          Array.from(
            rightElementNodesRef
              .current
              .values()
          );

        const update = () => {
          const total =
            nodes.reduce(
              (
                accumulated,
                node
              ) =>
                accumulated +
                Math.ceil(
                  getElementSize(
                    node
                  ).width
                ),
              0
            );

          setRightWidth(
            (currentWidth) =>
              currentWidth === total
                ? currentWidth
                : total
          );
        };

        update();

        return observeElementSizes(
          nodes,
          update
        );
      }, [
        children,
        rightElementCount,
      ]);

      const resolvedChildren =
        useMemo(() => {
          const extraRightSpace =
            rightWidth > 0
              ? `${rightWidth + 12}px`
              : undefined;

          return Children.map(
            children,
            (
              child,
              index
            ) => {
              if (
                !isReactElementWithMarkers(
                  child
                )
              ) {
                return child;
              }

              if (
                isRightElement(
                  child
                )
              ) {
                const originalRef =
                  child.props.ref;

                return React.cloneElement(
                  child,
                  {
                    ref: (
                      node:
                        | HTMLDivElement
                        | null
                    ) => {
                      if (node) {
                        rightElementNodesRef
                          .current
                          .set(
                            index,
                            node
                          );
                      } else {
                        rightElementNodesRef
                          .current
                          .delete(
                            index
                          );
                      }

                      setRef(
                        originalRef,
                        node
                      );
                    },
                  }
                );
              }

              if (
                !isSupportedControl(
                  child
                )
              ) {
                return child;
              }

              const controlKind =
                getControlKind(
                  child
                );

              const size =
                getControlSize(
                  child
                );

              const basePadding =
                CONTROL_BASE_RIGHT_PADDING[
                size
                ];

              const currentRightPadding =
                child.props
                  .rightPadding;

              const commonInjectedProps:
                SupportedControlProps = {
                isInvalid:
                  child.props
                    .isInvalid ??
                  finalInvalid,

                isDisabled:
                  child.props
                    .isDisabled ??
                  finalDisabled,

                variant:
                  child.props
                    .variant ??
                  "unstyled",
              };

              if (
                controlKind ===
                "select"
              ) {
                return React.cloneElement(
                  child,
                  {
                    ...commonInjectedProps,

                    rightPadding:
                      currentRightPadding ??
                      (
                        extraRightSpace
                          ? `calc(${extraRightSpace} + ${basePadding} + 1rem)`
                          : undefined
                      ),

                    indicatorOffset:
                      extraRightSpace
                        ? `calc(${extraRightSpace} + 10px)`
                        : child.props
                          .indicatorOffset,

                    rounded:
                      child.props
                        .rounded ??
                      rounded,
                  }
                );
              }

              if (
                controlKind ===
                "input" ||
                controlKind ===
                "textarea"
              ) {
                return React.cloneElement(
                  child,
                  {
                    ...commonInjectedProps,

                    rightPadding:
                      currentRightPadding ??
                      (
                        extraRightSpace
                          ? `calc(${extraRightSpace} + ${basePadding})`
                          : undefined
                      ),
                  }
                );
              }

              return child;
            }
          );
        }, [
          children,
          rightWidth,
          finalInvalid,
          finalDisabled,
          rounded,
        ]);

      const recipeStyles =
        inputGroupRecipe({
          rounded,

          invalid:
            finalInvalid,

          disabled:
            finalDisabled,
        });

      const rootSlot =
        resolveSlot<InputGroupSlot>({
          slot: "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui":
              "input-group",

            "data-invalid":
              finalInvalid ||
              undefined,

            "data-disabled":
              finalDisabled ||
              undefined,
          },

          baseStyle:
            recipeStyles.root,
        });

      return (
        <div
          {...rootSlot}
          ref={ref}
          {...rest}
        >
          {resolvedChildren}
        </div>
      );
    }
  );

InputGroup.displayName =
  "InputGroup";