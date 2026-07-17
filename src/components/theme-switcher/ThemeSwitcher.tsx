// src/components/theme-switcher/ThemeSwitcher.tsx

import React from "react";

import {
  Sparkles,
} from "lucide-react";

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


  const ThemeIcon =
    theme.metadata?.icon ??
    Sparkles;


  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
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
            item.metadata?.icon ??
            Sparkles;


          const active =
            item.name === theme.name;


          return (
            <MenuItem
              key={item.name}
              onSelect={() => {
                setTheme(item.name);
                setOpen(false);
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