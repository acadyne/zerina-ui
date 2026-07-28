// src/components/theme-switcher/ThemeSwitcher.tsx

import React from "react";

import {
  Button,
} from "../../primitives/forms";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "../../primitives/overlay";

import {
  resolveThemeIcon,
  useUITheme,
  type ThemeIconRegistry,
} from "../../theme";


export interface ThemeSwitcherProps {
  className?: string;

  style?: React.CSSProperties;

  /**
   * Prefix displayed before the active theme label.
   *
   * Pass null to render only the active theme label.
   */
  label?: React.ReactNode;

  /**
   * Component-local icon registry.
   *
   * Custom entries override built-in icon names only for this
   * ThemeSwitcher instance.
   */
  icons?: ThemeIconRegistry;
}


export function ThemeSwitcher({
  className,
  style,
  label = "Theme",
  icons,
}: ThemeSwitcherProps) {
  const {
    resolvedTheme,
    themes,
    setTheme,
  } = useUITheme();


  const [
    open,
    setOpen,
  ] =
    React.useState(
      false
    );


  const selectedIndex =
    themes.findIndex(
      (item) =>
        item.name ===
        resolvedTheme.name
    );


  const ThemeIcon =
    resolveThemeIcon(
      resolvedTheme.metadata
        .icon,
      icons
    );


  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
      initialFocusIndex={
        selectedIndex
      }
    >
      <MenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          leftIcon={
            <ThemeIcon
              size={16}
            />
          }
          className={className}
          style={style}
        >
          {label
            ? (
                <>
                  {label}:{" "}
                </>
              )
            : null}

          {
            resolvedTheme
              .metadata
              .label ??
            resolvedTheme.name
          }
        </Button>
      </MenuTrigger>


      <MenuContent
        placement="bottom-end"
        style={{
          minWidth:
            "220px",

          padding:
            "0.4rem",

          background:
            "var(--ui-surface)",

          border:
            "1px solid var(--ui-border)",

          borderRadius:
            "var(--ui-radius-lg)",

          boxShadow:
            "var(--ui-shadow-lg)",
        }}
      >
        {themes.map(
          (item) => {
            const Icon =
              resolveThemeIcon(
                item.metadata
                  ?.icon,
                icons
              );


            const active =
              item.name ===
              resolvedTheme.name;


            return (
              <MenuItem
                key={
                  item.name
                }
                onSelect={() => {
                  setTheme(
                    item.name
                  );

                  setOpen(
                    false
                  );
                }}
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    "0.55rem",

                  fontWeight:
                    active
                      ? 700
                      : 500,

                  background:
                    active
                      ? "color-mix(in srgb, var(--ui-primary) 12%, transparent)"
                      : undefined,
                }}
              >
                <Icon
                  size={16}
                />

                <span>
                  {
                    item.metadata
                      ?.label ??
                    item.name
                  }
                </span>
              </MenuItem>
            );
          }
        )}
      </MenuContent>
    </Menu>
  );
}


ThemeSwitcher.displayName =
  "ThemeSwitcher";