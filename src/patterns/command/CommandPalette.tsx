// src/patterns/command/CommandPalette.tsx
import React from "react";
import { Search } from "lucide-react";
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
  inputStyle?: React.CSSProperties;
  listStyle?: React.CSSProperties;
}

export interface CommandTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  placeholder?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  children?: React.ReactNode;
}

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
  inputStyle,
  listStyle,
}: CommandPaletteProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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

  React.useEffect(() => {
    if (!open) return;

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [open]);

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

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      initialFocusRef={inputRef}
    >
      <DialogContent
        className={className}
        style={{
          overflow: "hidden",
          ...style,
        }}
      >
        <DialogHeader
          style={{
            padding: "0.85rem",
            gap: "0.75rem",
          }}
        >
          <DialogTitle
            style={{
              fontSize: "0.95rem",
            }}
          >
            {title}
          </DialogTitle>

          <Box
            style={{
              position: "relative",
              minWidth: 0,
            }}
          >
            <Box
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--ui-text-muted)",
                display: "inline-flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
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
              style={{
                height: 42,
                ...inputStyle,
              }}
            />
          </Box>
        </DialogHeader>

        <DialogBody
          style={{
            padding: "0.45rem",
          }}
        >
          <Box
            role="listbox"
            aria-label="Resultados de comandos"
            style={{
              maxHeight: "min(56vh, 460px)",
              overflow: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              padding: "0.25rem",
              ...listStyle,
            }}
          >
            {groupedItems.length > 0 ? (
              groupedItems.map((group) => (
                <Box key={group.group ?? "__ungrouped"}>
                  {group.group ? (
                    <Typography
                      as="div"
                      size="xs"
                      weight={800}
                      color="var(--ui-text-muted)"
                      style={{
                        padding: "0.6rem 0.65rem 0.35rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {group.group}
                    </Typography>
                  ) : null}

                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2rem",
                    }}
                  >
                    {group.items.map((item) => {
                      const active = item.id === activeId;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={active}
                          disabled={item.disabled}
                          onMouseEnter={() => {
                            if (!item.disabled) {
                              setActiveId(item.id);
                            }
                          }}
                          onClick={() => selectItem(item)}
                          style={{
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
                          }}
                        >
                          <Flex
                            align="center"
                            gap="0.7rem"
                            style={{
                              minWidth: 0,
                            }}
                          >
                            {item.icon ? (
                              <Box
                                aria-hidden="true"
                                style={{
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
                                }}
                              >
                                {item.icon}
                              </Box>
                            ) : null}

                            <Box
                              style={{
                                minWidth: 0,
                                flex: "1 1 auto",
                              }}
                            >
                              <Typography
                                as="div"
                                size="sm"
                                weight={700}
                                style={{
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.label}
                              </Typography>

                              {item.description ? (
                                <Typography
                                  as="div"
                                  size="xs"
                                  color="var(--ui-text-muted)"
                                  style={{
                                    marginTop: "0.18rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
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
              ))
            ) : (
              <Box
                style={{
                  padding: "2.25rem 1rem",
                  textAlign: "center",
                  color: "var(--ui-text-muted)",
                }}
              >
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
  icon = <Search size={16} />,
  shortcut,
  children,
  className = "",
  style,
  ...rest
}: CommandTriggerProps) {
  return (
    <button
      type="button"
      className={className}
      style={{
        width: "100%",
        height: 36,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        paddingInline: "0.8rem",
        borderRadius: "9999px",
        border: "1px solid var(--ui-border)",
        background: "color-mix(in srgb, var(--ui-surface-2) 76%, transparent)",
        color: "var(--ui-text-muted)",
        font: "inherit",
        cursor: "pointer",
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
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
          }}
        >
          {icon}
        </Box>

        <Box
          as="span"
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "var(--ui-font-size-sm)",
          }}
        >
          {children ?? placeholder}
        </Box>
      </Flex>

      {shortcut ? (
        <Box
          as="span"
          style={{
            flexShrink: 0,
            minWidth: 0,
            padding: "0.1rem 0.4rem",
            borderRadius: "var(--ui-radius-md)",
            border: "1px solid var(--ui-border)",
            background: "color-mix(in srgb, var(--ui-surface) 80%, transparent)",
            color: "var(--ui-text-muted)",
            fontSize: "var(--ui-font-size-xs)",
            lineHeight: 1.4,
          }}
        >
          {shortcut}
        </Box>
      ) : null}
    </button>
  );
}

CommandTrigger.displayName = "CommandTrigger";