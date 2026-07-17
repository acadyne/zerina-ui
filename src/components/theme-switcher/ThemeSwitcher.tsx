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
  useUITheme,
  resolveThemeIcon,
} from "../../theme";

export interface ThemeSwitcherProps {
  className?: string;

  style?: React.CSSProperties;

  label?: React.ReactNode;
}


export function ThemeSwitcher({
  className,
  style,
  label = "Tema",
}: ThemeSwitcherProps) {
  const {
    theme,
    themes,
    setTheme,
  } = useUITheme();


  const [open, setOpen] =
    React.useState(false);


  const selectedIndex =
    themes.findIndex(
      (item) =>
        item.name === theme.name
    );


  const ThemeIcon =
    resolveThemeIcon(
      theme.metadata?.icon
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
            <ThemeIcon size={16} />
          }
          className={className}
          style={style}
        >
          {label}:{" "}
          {
            theme.metadata?.label ??
            theme.name
          }
        </Button>
      </MenuTrigger>


      <MenuContent
        placement="bottom-end"
        style={{
          minWidth: "220px",
          padding: "0.4rem",

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
        {themes.map((item) => {
          const Icon =
            resolveThemeIcon(
              item.metadata?.icon
            );


          const active =
            item.name === theme.name;


          return (
            <MenuItem
              key={item.name}
              onSelect={() => {
                console.log(
                  "THEME BEFORE CLOSE",
                  document.activeElement
                );

                setTheme(item.name);
                setOpen(false);

                requestAnimationFrame(() => {
                  console.log(
                    "THEME AFTER CLOSE",
                    document.activeElement
                  );
                });
              }}
              style={{
                display: "flex",

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
              <Icon size={16} />

              <span>
                {
                  item.metadata?.label ??
                  item.name
                }
              </span>
            </MenuItem>
          );
        })}
      </MenuContent>
    </Menu>
  );
}


ThemeSwitcher.displayName =
  "ThemeSwitcher";