// src/patterns/command/CommandPalette.tsx
import React from "react";
import { Search } from "lucide-react";
import { usePress } from "../../core/interaction";
import {
  cssSize,
  resolveMergedSlot,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Box, Flex } from "../../primitives/layout";
import { Input } from "../../primitives/forms";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../primitives/overlay";
import { Typography } from "../../primitives/typography";

export interface CommandPaletteItem {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  keywords?: string[];
  disabled?: boolean;
  group?: string;
  meta?: Record<string, unknown>;
  onSelect?: (item: CommandPaletteItem) => void;
}

export type CommandPaletteSlot =
  | "dialog"
  | "header"
  | "title"
  | "search"
  | "searchIcon"
  | "input"
  | "body"
  | "list"
  | "group"
  | "groupLabel"
  | "groupItems"
  | "item"
  | "activeItem"
  | "itemContent"
  | "itemIcon"
  | "itemText"
  | "itemLabel"
  | "itemDescription"
  | "empty";

export type CommandPaletteStyles = SlotStyleMap<CommandPaletteSlot>;

export type CommandPaletteSlotProps = SlotPropsMap<CommandPaletteSlot>;

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;

  items: CommandPaletteItem[];

  title?: React.ReactNode;
  placeholder?: string;
  emptyLabel?: React.ReactNode;

  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  closeOnSelect?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: CommandPaletteStyles;
  slotProps?: CommandPaletteSlotProps;
}

export type CommandTriggerSize = "sm" | "md" | "lg";
export type CommandTriggerTone = "default" | "subtle";

export interface CommandTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  placeholder?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  children?: React.ReactNode;

  size?: CommandTriggerSize;
  tone?: CommandTriggerTone;
  maxWidth?: number | string;
  fullWidth?: boolean;
}

const COMMAND_TRIGGER_SIZE_MAP: Record<
  CommandTriggerSize,
  {
    height: number;
    paddingInline: string;
    fontSize: string;
    iconSize: number;
    shortcutPadding: string;
  }
> = {
  sm: {
    height: 34,
    paddingInline: "0.75rem",
    fontSize: "var(--ui-font-size-sm)",
    iconSize: 15,
    shortcutPadding: "0.06rem 0.36rem",
  },
  md: {
    height: 38,
    paddingInline: "0.85rem",
    fontSize: "var(--ui-font-size-sm)",
    iconSize: 16,
    shortcutPadding: "0.1rem 0.42rem",
  },
  lg: {
    height: 44,
    paddingInline: "1rem",
    fontSize: "var(--ui-font-size-md)",
    iconSize: 18,
    shortcutPadding: "0.14rem 0.48rem",
  },
};

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function getItemSearchText(item: CommandPaletteItem): string {
  return [
    item.id,
    typeof item.label === "string" ? item.label : "",
    typeof item.description === "string" ? item.description : "",
    item.group ?? "",
    ...(item.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function itemMatchesSearch(item: CommandPaletteItem, search: string): boolean {
  const normalizedSearch = normalizeSearchValue(search);

  if (!normalizedSearch) return true;

  return getItemSearchText(item).includes(normalizedSearch);
}

function getCommandPaletteDomId(prefix: string, id: string): string {
  return `${prefix}-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function groupItems(items: CommandPaletteItem[]): Array<{
  group: string | null;
  items: CommandPaletteItem[];
}> {
  const groups = new Map<string | null, CommandPaletteItem[]>();

  for (const item of items) {
    const group = item.group ?? null;
    const current = groups.get(group) ?? [];
    current.push(item);
    groups.set(group, current);
  }

  return Array.from(groups.entries()).map(([group, groupedItems]) => ({
    group,
    items: groupedItems,
  }));
}

export function CommandPalette({
  open,
  onOpenChange,

  items,

  title = "Comandos",
  placeholder = "Buscar comando…",
  emptyLabel = "Sin resultados",

  value,
  defaultValue = "",
  onValueChange,

  closeOnSelect = true,

  className = "",
  style,

  styles,
  slotProps,
}: CommandPaletteProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const reactId = React.useId();
  const idPrefix = React.useMemo(
    () => `ui-command-palette-${reactId.replace(/:/g, "")}`,
    [reactId]
  );
  const inputId = `${idPrefix}-input`;
  const listId = `${idPrefix}-list`;

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const searchValue = value ?? internalValue;

  const filteredItems = React.useMemo(
    () => items.filter((item) => itemMatchesSearch(item, searchValue)),
    [items, searchValue]
  );

  const groupedItems = React.useMemo(
    () => groupItems(filteredItems),
    [filteredItems]
  );

  const selectableItems = React.useMemo(
    () => filteredItems.filter((item) => !item.disabled),
    [filteredItems]
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;

    const firstSelectable = selectableItems[0];
    setActiveId(firstSelectable?.id ?? null);
  }, [open, selectableItems]);

  const setSearchValue = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  const selectItem = React.useCallback(
    (item: CommandPaletteItem) => {
      if (item.disabled) return;

      item.onSelect?.(item);

      if (closeOnSelect) {
        onOpenChange?.(false);
      }
    },
    [closeOnSelect, onOpenChange]
  );

  const moveActive = React.useCallback(
    (direction: 1 | -1) => {
      if (selectableItems.length === 0) return;

      const currentIndex = selectableItems.findIndex(
        (item) => item.id === activeId
      );

      const nextIndex =
        currentIndex === -1
          ? direction === 1
            ? 0
            : selectableItems.length - 1
          : (currentIndex + direction + selectableItems.length) %
          selectableItems.length;

      setActiveId(selectableItems[nextIndex]?.id ?? null);
    },
    [activeId, selectableItems]
  );

  const activeItem = React.useMemo(
    () => selectableItems.find((item) => item.id === activeId) ?? null,
    [activeId, selectableItems]
  );

  const activeOptionId = activeItem
    ? getCommandPaletteDomId(`${idPrefix}-option`, activeItem.id)
    : undefined;

  const dialogSlot = resolveSlot<CommandPaletteSlot>({
    slot: "dialog",
    styles,
    slotProps,
    className,
    style,
    baseProps: {
      "data-ui-command-palette": "",
    },
    baseStyle: {
      overflow: "hidden",
    },
  });

  const headerSlot = resolveSlot<CommandPaletteSlot>({
    slot: "header",
    styles,
    slotProps,
    baseProps: {
      "data-ui-command-palette-header": "",
    },
    baseStyle: {
      padding: "0.85rem",
      gap: "0.75rem",
    },
  });

  const titleSlot = resolveSlot<CommandPaletteSlot>({
    slot: "title",
    styles,
    slotProps,
    baseProps: {
      "data-ui-command-palette-title": "",
    },
    baseStyle: {
      fontSize: "0.95rem",
    },
  });

  const searchSlot = resolveSlot<CommandPaletteSlot>({
    slot: "search",
    styles,
    slotProps,
    baseProps: {
      "data-ui-command-palette-search": "",
    },
    baseStyle: {
      position: "relative",
      minWidth: 0,
    },
  });

  const searchIconSlot = resolveSlot<CommandPaletteSlot>({
    slot: "searchIcon",
    styles,
    slotProps,
    baseProps: {
      "aria-hidden": true,
      "data-ui-command-palette-search-icon": "",
    },
    baseStyle: {
      position: "absolute",
      left: "0.85rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--ui-text-muted)",
      display: "inline-flex",
      alignItems: "center",
      pointerEvents: "none",
    },
  });

  const inputSlot = resolveSlot<CommandPaletteSlot>({
    slot: "input",
    styles,
    slotProps,
    baseProps: {
      id: inputId,
      role: "searchbox",
      "aria-controls": listId,
      "aria-activedescendant": activeOptionId,
      "aria-autocomplete": "list",
      "data-ui-command-palette-input": "",
    },
    baseStyle: {
      height: 42,
    },
  });

  const bodySlot = resolveSlot<CommandPaletteSlot>({
    slot: "body",
    styles,
    slotProps,
    baseProps: {
      "data-ui-command-palette-body": "",
    },
    baseStyle: {
      padding: "0.45rem",
    },
  });

  const listSlot = resolveSlot<CommandPaletteSlot>({
    slot: "list",
    styles,
    slotProps,
    baseProps: {
      id: listId,
      role: "listbox",
      "aria-label": "Resultados de comandos",
      "data-ui-command-palette-list": "",
    },
    baseStyle: {
      maxHeight: "min(56vh, 460px)",
      overflow: "auto",
      overscrollBehavior: "contain",
      WebkitOverflowScrolling: "touch",
      padding: "0.25rem",
    },
  });

  const emptySlot = resolveSlot<CommandPaletteSlot>({
    slot: "empty",
    styles,
    slotProps,
    baseProps: {
      "data-ui-command-palette-empty": "",
    },
    baseStyle: {
      padding: "2.25rem 1rem",
      textAlign: "center",
      color: "var(--ui-text-muted)",
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      initialFocusRef={inputRef}
    >
      <DialogContent {...dialogSlot}>
        <DialogHeader {...headerSlot}>
          <DialogTitle {...titleSlot}>{title}</DialogTitle>

          <Box {...searchSlot}>
            <Box {...searchIconSlot}>
              <Search size={17} />
            </Box>

            <Input
              ref={inputRef}
              value={searchValue}
              placeholder={placeholder}
              leftPadding="2.35rem"
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveActive(1);
                  return;
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveActive(-1);
                  return;
                }

                if (event.key === "Enter") {
                  event.preventDefault();

                  if (activeItem) {
                    selectItem(activeItem);
                  }
                }
              }}
              {...inputSlot}
            />
          </Box>
        </DialogHeader>

        <DialogBody {...bodySlot}>
          <Box {...listSlot}>
            {groupedItems.length > 0 ? (
              groupedItems.map((group) => {
                const groupSlot = resolveSlot<CommandPaletteSlot>({
                  slot: "group",
                  styles,
                  slotProps,
                  baseProps: {
                    "data-ui-command-palette-group": "",
                    "data-ui-command-palette-group-name":
                      group.group ?? undefined,
                  },
                });

                const groupLabelSlot = resolveSlot<CommandPaletteSlot>({
                  slot: "groupLabel",
                  styles,
                  slotProps,
                  baseProps: {
                    "data-ui-command-palette-group-label": "",
                  },
                  baseStyle: {
                    padding: "0.6rem 0.65rem 0.35rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  },
                });

                const groupItemsSlot = resolveSlot<CommandPaletteSlot>({
                  slot: "groupItems",
                  styles,
                  slotProps,
                  baseProps: {
                    "data-ui-command-palette-group-items": "",
                  },
                  baseStyle: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  },
                });

                return (
                  <Box key={group.group ?? "__ungrouped"} {...groupSlot}>
                    {group.group ? (
                      <Typography
                        as="div"
                        size="xs"
                        weight={800}
                        color="var(--ui-text-muted)"
                        {...groupLabelSlot}
                      >
                        {group.group}
                      </Typography>
                    ) : null}

                    <Box {...groupItemsSlot}>
                      {group.items.map((item) => {
                        const active = item.id === activeId;
                        const itemDomId = getCommandPaletteDomId(
                          `${idPrefix}-option`,
                          item.id
                        );
                        const itemSlot = resolveMergedSlot<CommandPaletteSlot>({
                          slots: active ? ["item", "activeItem"] : ["item"],
                          styles,
                          slotProps,
                          baseProps: {
                            id: itemDomId,
                            role: "option",
                            "aria-selected": active,
                            "data-ui-command-palette-item": "",
                            "data-ui-command-palette-item-active":
                              active || undefined,
                            "data-ui-command-palette-item-disabled":
                              item.disabled || undefined,
                          },
                          baseStyle: {
                            width: "100%",
                            minWidth: 0,
                            display: "block",
                            textAlign: "left",
                            border: "1px solid",
                            borderColor: active
                              ? "color-mix(in srgb, var(--ui-primary) 36%, var(--ui-border))"
                              : "transparent",
                            borderRadius: "var(--ui-radius-lg)",
                            padding: "0.65rem 0.7rem",
                            background: item.disabled
                              ? "transparent"
                              : active
                                ? "color-mix(in srgb, var(--ui-primary) 12%, transparent)"
                                : "transparent",
                            color: item.disabled
                              ? "var(--ui-text-muted)"
                              : "var(--ui-text)",
                            opacity: item.disabled ? 0.56 : 1,
                            cursor: item.disabled ? "not-allowed" : "pointer",
                          },
                        });

                        const itemContentSlot =
                          resolveSlot<CommandPaletteSlot>({
                            slot: "itemContent",
                            styles,
                            slotProps,
                            baseProps: {
                              "data-ui-command-palette-item-content": "",
                            },
                            baseStyle: {
                              minWidth: 0,
                            },
                          });

                        const itemIconSlot = resolveSlot<CommandPaletteSlot>({
                          slot: "itemIcon",
                          styles,
                          slotProps,
                          baseProps: {
                            "aria-hidden": true,
                            "data-ui-command-palette-item-icon": "",
                          },
                          baseStyle: {
                            width: 30,
                            height: 30,
                            minWidth: 30,
                            borderRadius: "var(--ui-radius-md)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid var(--ui-border)",
                            background:
                              "color-mix(in srgb, var(--ui-surface-2) 78%, transparent)",
                            flexShrink: 0,
                          },
                        });

                        const itemTextSlot = resolveSlot<CommandPaletteSlot>({
                          slot: "itemText",
                          styles,
                          slotProps,
                          baseProps: {
                            "data-ui-command-palette-item-text": "",
                          },
                          baseStyle: {
                            minWidth: 0,
                            flex: "1 1 auto",
                          },
                        });

                        const itemLabelSlot = resolveSlot<CommandPaletteSlot>({
                          slot: "itemLabel",
                          styles,
                          slotProps,
                          baseProps: {
                            "data-ui-command-palette-item-label": "",
                          },
                          baseStyle: {
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        });

                        const itemDescriptionSlot =
                          resolveSlot<CommandPaletteSlot>({
                            slot: "itemDescription",
                            styles,
                            slotProps,
                            baseProps: {
                              "data-ui-command-palette-item-description": "",
                            },
                            baseStyle: {
                              marginTop: "0.18rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            },
                          });

                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={item.disabled}
                            onMouseEnter={() => {
                              if (!item.disabled) {
                                setActiveId(item.id);
                              }
                            }}
                            onClick={() => selectItem(item)}
                            {...itemSlot}
                          >
                            <Flex align="center" gap="0.7rem" {...itemContentSlot}>
                              {item.icon ? (
                                <Box {...itemIconSlot}>{item.icon}</Box>
                              ) : null}

                              <Box {...itemTextSlot}>
                                <Typography
                                  as="div"
                                  size="sm"
                                  weight={700}
                                  {...itemLabelSlot}
                                >
                                  {item.label}
                                </Typography>

                                {item.description ? (
                                  <Typography
                                    as="div"
                                    size="xs"
                                    color="var(--ui-text-muted)"
                                    {...itemDescriptionSlot}
                                  >
                                    {item.description}
                                  </Typography>
                                ) : null}
                              </Box>
                            </Flex>
                          </button>
                        );
                      })}
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box {...emptySlot}>
                <Typography as="div" size="sm" weight={700}>
                  {emptyLabel}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

CommandPalette.displayName = "CommandPalette";

export function CommandTrigger({
  placeholder = "Buscar, navegar o ejecutar comando…",
  icon,
  shortcut,
  children,

  size = "sm",
  tone = "subtle",
  maxWidth,
  fullWidth = true,

  className = "",
  style,

  disabled,

  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,

  onFocus,
  onBlur,

  onKeyDown,
  onKeyUp,

  onClick,

  ...rest
}: CommandTriggerProps) {
  const sizeStyles = COMMAND_TRIGGER_SIZE_MAP[size];

  const press = usePress<HTMLButtonElement>({
    disabled,
    nativeInteractive: true,

    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,

    onFocus,
    onBlur,

    onKeyDown,
    onKeyUp,

    onClick,
  });

  const interactive =
    press.state.hovered ||
    press.state.focused;

  const SearchIcon = (
    <Search
      size={sizeStyles.iconSize}
      style={{
        display: "block",
      }}
    />
  );

  return (
    <button
      {...rest}
      {...press.pressProps}
      type="button"
      disabled={disabled}
      className={className}
      data-ui-command-trigger=""
      data-ui-command-trigger-size={size}
      data-ui-command-trigger-tone={tone}
      data-ui-command-trigger-hovered={
        press.state.hovered || undefined
      }
      data-ui-command-trigger-focused={
        press.state.focused || undefined
      }
      data-ui-command-trigger-focus-visible={
        press.state.focusVisible || undefined
      }
      data-ui-command-trigger-pressed={
        press.state.pressed || undefined
      }
      style={{
        width: fullWidth
          ? "100%"
          : undefined,
        maxWidth:
          maxWidth !== undefined
            ? cssSize(maxWidth)
            : undefined,
        height: sizeStyles.height,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        paddingInline:
          sizeStyles.paddingInline,
        borderRadius: "9999px",
        border: "1px solid",
        borderColor: interactive
          ? "color-mix(in srgb, var(--ui-primary) 34%, var(--ui-border))"
          : "var(--ui-border)",
        background:
          tone === "default"
            ? interactive
              ? "color-mix(in srgb, var(--ui-surface-2) 92%, var(--ui-primary) 8%)"
              : "var(--ui-surface)"
            : interactive
              ? "color-mix(in srgb, var(--ui-primary) 8%, var(--ui-surface-2))"
              : "color-mix(in srgb, var(--ui-surface-2) 76%, transparent)",
        color: interactive
          ? "var(--ui-text)"
          : "var(--ui-text-muted)",
        font: "inherit",
        cursor: disabled
          ? "not-allowed"
          : "pointer",
        opacity: disabled
          ? 0.56
          : 1,
        boxSizing: "border-box",
        outline: "none",
        boxShadow:
          press.state.focusVisible
            ? "0 0 0 3px color-mix(in srgb, var(--ui-primary) 18%, transparent)"
            : "none",
        transition:
          "border-color var(--ui-duration-fast) var(--ui-ease-standard), background var(--ui-duration-fast) var(--ui-ease-standard), color var(--ui-duration-fast) var(--ui-ease-standard), box-shadow var(--ui-duration-fast) var(--ui-ease-standard)",
        ...style,
      }}
    >
      <Flex
        align="center"
        gap="0.5rem"
        style={{
          minWidth: 0,
          flex: "1 1 auto",
        }}
      >
        <Box
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            flexShrink: 0,
            opacity: interactive
              ? 0.9
              : 0.72,
          }}
        >
          {icon ?? SearchIcon}
        </Box>

        <Box
          as="span"
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize:
              sizeStyles.fontSize,
            lineHeight: 1.3,
          }}
        >
          {children ?? placeholder}
        </Box>
      </Flex>

      {shortcut ? (
        <Box
          as="span"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            minWidth: 0,
            padding:
              sizeStyles.shortcutPadding,
            borderRadius:
              "var(--ui-radius-md)",
            border:
              "1px solid var(--ui-border)",
            background: interactive
              ? "color-mix(in srgb, var(--ui-surface) 86%, transparent)"
              : "color-mix(in srgb, var(--ui-surface) 72%, transparent)",
            color:
              "var(--ui-text-muted)",
            fontSize:
              "var(--ui-font-size-xs)",
            lineHeight: 1.35,
            boxShadow: interactive
              ? "var(--ui-shadow-sm)"
              : "none",
          }}
        >
          {shortcut}
        </Box>
      ) : null}
    </button>
  );
}

CommandTrigger.displayName = "CommandTrigger";