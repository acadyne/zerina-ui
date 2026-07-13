// src/primitives/disclosure/Accordion.tsx
import React from "react";
import {
  defineSlotRecipe,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import {
  Collapsible,
  CollapsibleContent,
  type CollapsibleContentProps,
  CollapsibleTrigger,
} from "./Collapsible";
import { Typography } from "../typography";

export type AccordionType =
  | "single"
  | "multiple";

export type AccordionSlot =
  | "root"
  | "item"
  | "trigger"
  | "triggerLabel"
  | "content";

export type AccordionStyles =
  SlotStyleMap<AccordionSlot>;

export type AccordionSlotProps =
  SlotPropsMap<AccordionSlot>;

type AccordionContextValue = {
  type: AccordionType;
  value: string[];

  disabled: boolean;
  collapsible: boolean;

  toggleItem: (
    value: string
  ) => void;

  styles?: AccordionStyles;
  slotProps?: AccordionSlotProps;
};

const AccordionContext =
  React.createContext<
    AccordionContextValue | null
  >(null);

function useAccordionContext() {
  const ctx =
    React.useContext(
      AccordionContext
    );

  if (!ctx) {
    throw new Error(
      "Accordion subcomponents must be used inside <Accordion />"
    );
  }

  return ctx;
}

function useOptionalAccordionContext() {
  return React.useContext(
    AccordionContext
  );
}

type AccordionRecipeVariants =
  Record<never, never>;

type AccordionRecipeState = {
  disabled: boolean;
};

/**
 * La recipe concentra la política visual propia del Accordion.
 *
 * La apertura, presencia y transición siguen delegadas en Collapsible.
 */
const accordionRecipe =
  defineSlotRecipe<
    AccordionSlot,
    AccordionRecipeVariants,
    AccordionRecipeState
  >({
    base: {
      root: {
        width: "100%",
        minWidth: 0,

        display: "flex",
        flexDirection: "column",
      },

      item: {
        width: "100%",
        minWidth: 0,

        borderBottom:
          "1px solid var(--ui-border)",
      },

      trigger: {
        minHeight: 48,

        padding: "0.9rem 0",

        borderRadius:
          "var(--ui-radius-sm)",
      },

      triggerLabel: {
        margin: 0,

        color:
          "var(--ui-text)",
      },

      content: {
        minWidth: 0,

        paddingBottom: "1rem",

        color:
          "var(--ui-text-muted)",

        fontSize:
          "var(--ui-font-size-sm)",

        lineHeight: 1.5,
      },
    },

    resolve: ({
      disabled,
    }) => ({
      item: {
        opacity: disabled
          ? "var(--ui-state-disabled-opacity)"
          : 1,
      },
    }),
  });

export interface AccordionProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
  > {
  children?: React.ReactNode;

  type?: AccordionType;

  value?:
    | string
    | string[];

  defaultValue?:
    | string
    | string[];

  onValueChange?: (
    value:
      | string
      | string[]
  ) => void;

  collapsible?: boolean;
  disabled?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: AccordionStyles;
  slotProps?: AccordionSlotProps;
}

function normalizeValue(
  value:
    | string
    | string[]
    | undefined
): string[] {
  if (
    value === undefined
  ) {
    return [];
  }

  return Array.isArray(value)
    ? value
    : [value];
}

function emitValue(
  type: AccordionType,
  value: string[]
):
  | string
  | string[] {
  return type === "single"
    ? value[0] ?? ""
    : value;
}

export const Accordion =
  React.forwardRef<
    HTMLDivElement,
    AccordionProps
  >(
    (
      {
        children,

        type = "single",

        value,
        defaultValue,

        onValueChange,

        collapsible = false,
        disabled = false,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const isControlled =
        value !== undefined;

      const [
        internalValue,
        setInternalValue,
      ] =
        React.useState<string[]>(
          () =>
            normalizeValue(
              defaultValue
            )
        );

      const currentValue =
        isControlled
          ? normalizeValue(
              value
            )
          : internalValue;

      const toggleItem =
        React.useCallback(
          (
            itemValue:
              string
          ) => {
            if (disabled) {
              return;
            }

            let nextValue:
              string[];

            if (
              type ===
              "multiple"
            ) {
              nextValue =
                currentValue.includes(
                  itemValue
                )
                  ? currentValue.filter(
                      (
                        item
                      ) =>
                        item !==
                        itemValue
                    )
                  : [
                      ...currentValue,
                      itemValue,
                    ];
            } else {
              const isOpen =
                currentValue.includes(
                  itemValue
                );

              nextValue =
                isOpen &&
                collapsible
                  ? []
                  : [
                      itemValue,
                    ];
            }

            if (
              !isControlled
            ) {
              setInternalValue(
                nextValue
              );
            }

            onValueChange?.(
              emitValue(
                type,
                nextValue
              )
            );
          },
          [
            collapsible,
            currentValue,
            disabled,
            isControlled,
            onValueChange,
            type,
          ]
        );

      const ctx =
        React.useMemo<
          AccordionContextValue
        >(
          () => ({
            type,

            value:
              currentValue,

            disabled,
            collapsible,

            toggleItem,

            styles,
            slotProps,
          }),
          [
            type,
            currentValue,
            disabled,
            collapsible,
            toggleItem,
            styles,
            slotProps,
          ]
        );

      const recipeStyles =
        accordionRecipe({
          disabled,
        });

      const rootSlot =
        resolveSlot<AccordionSlot>({
          slot: "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui":
              "accordion",

            "data-ui-accordion-type":
              type,

            "data-ui-accordion-disabled":
              disabled ||
              undefined,
          },

          baseStyle:
            recipeStyles.root,
        });

      return (
        <AccordionContext.Provider
          value={ctx}
        >
          <div
            {...rootSlot}
            {...rest}
            ref={ref}
          >
            {children}
          </div>
        </AccordionContext.Provider>
      );
    }
  );

Accordion.displayName =
  "Accordion";

export interface AccordionItemProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "value"
  > {
  children?: React.ReactNode;

  value: string;
  disabled?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: AccordionStyles;
  slotProps?: AccordionSlotProps;
}

type AccordionItemContextValue = {
  value: string;
  open: boolean;
  disabled: boolean;

  styles?: AccordionStyles;
  slotProps?: AccordionSlotProps;
};

const AccordionItemContext =
  React.createContext<
    AccordionItemContextValue | null
  >(null);

function useAccordionItemContext() {
  const ctx =
    React.useContext(
      AccordionItemContext
    );

  if (!ctx) {
    throw new Error(
      "Accordion item subcomponents must be used inside <AccordionItem />"
    );
  }

  return ctx;
}

function useOptionalAccordionItemContext() {
  return React.useContext(
    AccordionItemContext
  );
}

export const AccordionItem =
  React.forwardRef<
    HTMLDivElement,
    AccordionItemProps
  >(
    (
      {
        children,

        value,
        disabled = false,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const accordion =
        useAccordionContext();

      const open =
        accordion.value.includes(
          value
        );

      const finalDisabled =
        accordion.disabled ||
        disabled;

      const resolvedStyles =
        styles ??
        accordion.styles;

      const resolvedSlotProps =
        slotProps ??
        accordion.slotProps;

      const itemCtx =
        React.useMemo<
          AccordionItemContextValue
        >(
          () => ({
            value,
            open,

            disabled:
              finalDisabled,

            styles:
              resolvedStyles,

            slotProps:
              resolvedSlotProps,
          }),
          [
            value,
            open,
            finalDisabled,
            resolvedStyles,
            resolvedSlotProps,
          ]
        );

      const recipeStyles =
        accordionRecipe({
          disabled:
            finalDisabled,
        });

      const itemSlot =
        resolveSlot<AccordionSlot>({
          slot: "item",

          styles:
            resolvedStyles,

          slotProps:
            resolvedSlotProps,

          className,
          style,

          baseProps: {
            "data-ui":
              "accordion-item",

            "data-open":
              open ||
              undefined,

            "data-disabled":
              finalDisabled ||
              undefined,
          },

          baseStyle:
            recipeStyles.item,
        });

      return (
        <AccordionItemContext.Provider
          value={itemCtx}
        >
          <Collapsible
            open={open}
            disabled={
              finalDisabled
            }
            onOpenChange={() =>
              accordion.toggleItem(
                value
              )
            }
            id={`accordion-${value}`}
          >
            <div
              {...itemSlot}
              {...rest}
              ref={ref}
            >
              {children}
            </div>
          </Collapsible>
        </AccordionItemContext.Provider>
      );
    }
  );

AccordionItem.displayName =
  "AccordionItem";

export interface AccordionTriggerProps {
  children?:
    | React.ReactNode
    | ((
        state: {
          open: boolean;
        }
      ) => React.ReactNode);

  className?: string;
  style?: React.CSSProperties;

  styles?: AccordionStyles;
  slotProps?: AccordionSlotProps;
}

export const AccordionTrigger =
  React.forwardRef<
    HTMLButtonElement,
    AccordionTriggerProps
  >(
    (
      {
        children,

        className = "",
        style,

        styles,
        slotProps,
      },
      ref
    ) => {
      const accordion =
        useOptionalAccordionContext();

      const item =
        useAccordionItemContext();

      const resolvedStyles =
        styles ??
        item.styles ??
        accordion?.styles;

      const resolvedSlotProps =
        slotProps ??
        item.slotProps ??
        accordion?.slotProps;

      const content =
        typeof children ===
        "function"
          ? children({
              open:
                item.open,
            })
          : children;

      const recipeStyles =
        accordionRecipe({
          disabled:
            item.disabled,
        });

      const triggerSlot =
        resolveSlot<AccordionSlot>({
          slot: "trigger",

          styles:
            resolvedStyles,

          slotProps:
            resolvedSlotProps,

          className,
          style,

          baseProps: {
            "data-ui-accordion-trigger":
              "",
          },

          baseStyle:
            recipeStyles.trigger,
        });

      const triggerLabelSlot =
        resolveSlot<AccordionSlot>({
          slot:
            "triggerLabel",

          styles:
            resolvedStyles,

          slotProps:
            resolvedSlotProps,

          baseProps: {
            "data-ui-accordion-trigger-label":
              "",
          },

          baseStyle:
            recipeStyles
              .triggerLabel,
        });

      return (
        <CollapsibleTrigger
          ref={ref}
          className={
            triggerSlot.className
          }
          style={
            triggerSlot.style
          }
        >
          <Typography
            {...triggerLabelSlot}
            as="span"
            size="md"
            weight={750}
          >
            {content}
          </Typography>
        </CollapsibleTrigger>
      );
    }
  );

AccordionTrigger.displayName =
  "AccordionTrigger";

export interface AccordionContentProps
  extends Omit<
    CollapsibleContentProps,
    "children" | "styles"
  > {
  children?: React.ReactNode;

  styles?: AccordionStyles;
  slotProps?: AccordionSlotProps;
}

export const AccordionContent =
  React.forwardRef<
    HTMLDivElement,
    AccordionContentProps
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
      const accordion =
        useOptionalAccordionContext();

      const item =
        useOptionalAccordionItemContext();

      const resolvedStyles =
        styles ??
        item?.styles ??
        accordion?.styles;

      const resolvedSlotProps =
        slotProps ??
        item?.slotProps ??
        accordion?.slotProps;

      const recipeStyles =
        accordionRecipe({
          disabled:
            item?.disabled ??
            accordion?.disabled ??
            false,
        });

      const contentSlot =
        resolveSlot<AccordionSlot>({
          slot: "content",

          styles:
            resolvedStyles,

          slotProps:
            resolvedSlotProps,

          className,
          style,

          baseProps: {
            "data-ui-accordion-content":
              "",
          },

          baseStyle:
            recipeStyles.content,
        });

      return (
        <CollapsibleContent
          ref={ref}
          styles={{
            inner: {
              ...contentSlot.style,
            },
          }}
          slotProps={{
            inner: {
              className:
                contentSlot.className,

              ...contentSlot,
            },
          }}
          {...rest}
        >
          {children}
        </CollapsibleContent>
      );
    }
  );

AccordionContent.displayName =
  "AccordionContent";