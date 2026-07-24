// src/patterns/actions/ActionSheet.tsx

import React from "react";
import type { UIPressEvent } from "../../core/interaction";
import { Box, List } from "../../primitives/layout";
import {
  BottomSheet,
  BottomSheetBody,
  type BottomSheetProps,
} from "../../primitives/overlay";

export type ActionSheetTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export interface ActionSheetProps
  extends Omit<BottomSheetProps, "children"> {
  children?: React.ReactNode;

  /**
   * Cierra automáticamente el ActionSheet después de ejecutar
   * la acción de un item, salvo que el evento sea cancelado.
   */
  closeOnPress?: boolean;
}

export interface ActionSheetItemProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "title" | "onClick"
  > {
  children?: React.ReactNode;

  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;

  tone?: ActionSheetTone;

  disabled?: boolean;
  destructive?: boolean;

  closeOnPress?: boolean;

  onPress?: (
    event: UIPressEvent<HTMLElement>
  ) => void;

  onLongPress?: (
    event: UIPressEvent<HTMLElement>
  ) => void;
}

export interface ActionSheetSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> { }

export type ActionSheetSectionProps =
  React.ComponentPropsWithoutRef<
    typeof List.Section
  >;

type ActionSheetContextValue = {
  closeOnPress: boolean;
  requestClose: () => void;
};

const ActionSheetContext =
  React.createContext<ActionSheetContextValue | null>(
    null
  );

type ActionSheetComponent =
  React.FC<ActionSheetProps> & {
    Item: React.FC<ActionSheetItemProps>;
    Separator: React.FC<ActionSheetSeparatorProps>;
    Section: React.FC<ActionSheetSectionProps>;
  };

function getToneColor(
  tone: ActionSheetTone
): React.CSSProperties["color"] {
  if (tone === "danger") {
    return "var(--ui-danger)";
  }

  if (tone === "primary") {
    return "var(--ui-primary)";
  }

  if (tone === "success") {
    return "var(--ui-success)";
  }

  if (tone === "warning") {
    return "var(--ui-warning)";
  }

  return "var(--ui-text)";
}

function getToneBackground(
  tone: ActionSheetTone
): string | undefined {
  if (tone === "danger") {
    return "color-mix(in srgb, var(--ui-danger) 8%, transparent)";
  }

  if (tone === "primary") {
    return "color-mix(in srgb, var(--ui-primary) 8%, transparent)";
  }

  return undefined;
}

function hasRenderableNode(
  node: React.ReactNode
): boolean {
  return (
    node !== null &&
    node !== undefined &&
    typeof node !== "boolean"
  );
}

export const ActionSheet = (({
  children,
  closeOnPress = true,
  onOpenChange,
  showHandle = true,
  showCloseButton = true,
  maxHeight = "min(82dvh, 720px)",
  ...rest
}: ActionSheetProps) => {
  const requestClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const value =
    React.useMemo<ActionSheetContextValue>(
      () => ({
        closeOnPress,
        requestClose,
      }),
      [closeOnPress, requestClose]
    );

  return (
    <ActionSheetContext.Provider value={value}>
      <BottomSheet
        {...rest}
        onOpenChange={onOpenChange}
        showHandle={showHandle}
        showCloseButton={showCloseButton}
        maxHeight={maxHeight}
      >
        <BottomSheetBody
          style={{
            padding: "0.75rem",
          }}
        >
          <List
            variant="plain"
            density="comfortable"
            spacing="0.4rem"
          >
            {children}
          </List>
        </BottomSheetBody>
      </BottomSheet>
    </ActionSheetContext.Provider>
  );
}) as ActionSheetComponent;

ActionSheet.Item = function ActionSheetItem({
  children,
  label,
  description,
  icon,
  tone = "neutral",
  destructive = false,
  disabled = false,
  closeOnPress,
  onPress,
  onLongPress,
  style,
  ...rest
}: ActionSheetItemProps) {
  const context =
    React.useContext(ActionSheetContext);

  const resolvedTone: ActionSheetTone =
    destructive ? "danger" : tone;

  const shouldCloseOnPress =
    closeOnPress ??
    context?.closeOnPress ??
    true;

  const itemLabel = children ?? label;

  const handlePress = React.useCallback(
    (
      event: UIPressEvent<HTMLElement>
    ): void => {
      onPress?.(event);

      if (
        event.defaultPrevented ||
        !shouldCloseOnPress
      ) {
        return;
      }

      context?.requestClose();
    },
    [
      context,
      onPress,
      shouldCloseOnPress,
    ]
  );

  return (
    <List.Item
      {...rest}
      leading={
        hasRenderableNode(icon) ? (
          <Box
            style={{
              color:
                getToneColor(resolvedTone),
            }}
          >
            {icon}
          </Box>
        ) : undefined
      }
      title={
        hasRenderableNode(
          itemLabel
        ) ? (
          <Box
            style={{
              color:
                getToneColor(resolvedTone),

              fontWeight:
                "var(--ui-font-weight-bold)",
            }}
          >
            {itemLabel}
          </Box>
        ) : undefined
      }
      description={description}
      disabled={disabled}
      onPress={handlePress}
      onLongPress={onLongPress}
      style={{
        background:
          getToneBackground(resolvedTone),

        ...style,
      }}
    />
  );
};

ActionSheet.Separator =
  function ActionSheetSeparator({
    style,
    ...rest
  }: ActionSheetSeparatorProps) {
    return (
      <Box
        role="separator"
        aria-orientation="horizontal"
        style={{
          height: 1,
          background: "var(--ui-border)",
          marginBlock: "0.35rem",
          ...style,
        }}
        {...rest}
      />
    );
  };

ActionSheet.Section =
  function ActionSheetSection({
    children,
    label,
    description,
    ...rest
  }: ActionSheetSectionProps) {
    return (
      <List.Section
        {...rest}
        label={
          hasRenderableNode(label)
            ? label
            : undefined
        }
        description={
          hasRenderableNode(
            description
          )
            ? description
            : undefined
        }
      >
        {children}
      </List.Section>
    );
  };

ActionSheet.displayName = "ActionSheet";
