// src/primitives/disclosure/Accordion.tsx
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  type CollapsibleContentProps,
  CollapsibleTrigger,
} from "./Collapsible";
import { Typography } from "../typography";

export type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  type: AccordionType;
  value: string[];
  disabled: boolean;
  collapsible: boolean;
  toggleItem: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);

  if (!ctx) {
    throw new Error("Accordion subcomponents must be used inside <Accordion />");
  }

  return ctx;
}

export interface AccordionProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
  > {
  children?: React.ReactNode;
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function normalizeValue(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function emitValue(type: AccordionType, value: string[]): string | string[] {
  return type === "single" ? value[0] ?? "" : value;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
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
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = React.useState<string[]>(() =>
      normalizeValue(defaultValue)
    );

    const currentValue = isControlled ? normalizeValue(value) : internalValue;

    const toggleItem = React.useCallback(
      (itemValue: string) => {
        if (disabled) return;

        let nextValue: string[];

        if (type === "multiple") {
          nextValue = currentValue.includes(itemValue)
            ? currentValue.filter((item) => item !== itemValue)
            : [...currentValue, itemValue];
        } else {
          const isOpen = currentValue.includes(itemValue);
          nextValue = isOpen && collapsible ? [] : [itemValue];
        }

        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(emitValue(type, nextValue));
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

    const ctx = React.useMemo<AccordionContextValue>(
      () => ({
        type,
        value: currentValue,
        disabled,
        collapsible,
        toggleItem,
      }),
      [type, currentValue, disabled, collapsible, toggleItem]
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div
          ref={ref}
          className={className}
          data-ui="accordion"
          style={{
            width: "100%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            ...style,
          }}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

export interface AccordionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> {
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type AccordionItemContextValue = {
  value: string;
  open: boolean;
  disabled: boolean;
};

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const ctx = React.useContext(AccordionItemContext);

  if (!ctx) {
    throw new Error(
      "Accordion item subcomponents must be used inside <AccordionItem />"
    );
  }

  return ctx;
}

export const AccordionItem = React.forwardRef<
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
      ...rest
    },
    ref
  ) => {
    const accordion = useAccordionContext();
    const open = accordion.value.includes(value);
    const finalDisabled = accordion.disabled || disabled;

    const itemCtx = React.useMemo<AccordionItemContextValue>(
      () => ({
        value,
        open,
        disabled: finalDisabled,
      }),
      [value, open, finalDisabled]
    );

    return (
      <AccordionItemContext.Provider value={itemCtx}>
        <Collapsible
          open={open}
          disabled={finalDisabled}
          onOpenChange={() => accordion.toggleItem(value)}
          id={`accordion-${value}`}
        >
          <div
            ref={ref}
            className={className}
            data-ui="accordion-item"
            data-open={open || undefined}
            data-disabled={finalDisabled || undefined}
            style={{
              width: "100%",
              minWidth: 0,
              borderBottom: "1px solid var(--ui-border)",
              opacity: finalDisabled ? "var(--ui-state-disabled-opacity)" : 1,
              ...style,
            }}
            {...rest}
          >
            {children}
          </div>
        </Collapsible>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps {
  children?: React.ReactNode | ((state: { open: boolean }) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, className = "", style }, ref) => {
  const item = useAccordionItemContext();

  const content =
    typeof children === "function" ? children({ open: item.open }) : children;

  return (
    <CollapsibleTrigger
      ref={ref}
      className={className}
      style={{
        minHeight: 48,
        padding: "0.9rem 0",
        borderRadius: "var(--ui-radius-sm)",
        ...style,
      }}
    >
      <Typography
        as="span"
        size="md"
        weight={750}
        style={{
          margin: 0,
          color: "var(--ui-text)",
        }}
      >
        {content}
      </Typography>
    </CollapsibleTrigger>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps
  extends Omit<CollapsibleContentProps, "children"> {
  children?: React.ReactNode;
}

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(
  (
    {
      children,
      styles,
      ...rest
    },
    ref
  ) => {
    return (
      <CollapsibleContent
        ref={ref}
        styles={{
          ...styles,
          inner: {
            paddingBottom: "1rem",
            color: "var(--ui-text-muted)",
            fontSize: "var(--ui-font-size-sm)",
            lineHeight: 1.5,
            minWidth: 0,
            ...styles?.inner,
          },
        }}
        {...rest}
      >
        {children}
      </CollapsibleContent>
    );
  }
);

AccordionContent.displayName = "AccordionContent";