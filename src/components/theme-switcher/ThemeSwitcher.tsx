// src/components/theme-switcher/ThemeSwitcher.tsx

import React from "react";

import {
  Sparkles,
} from "lucide-react";

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
        <button
          type="button"
          className={className}
          style={style}
        >
          <ThemeIcon size={16} />

          <span>
            {label}:{" "}
            {
              theme.metadata?.label ??
              theme.name
            }
          </span>
        </button>
      </MenuTrigger>


      <MenuContent>
        {themes.map((item) => {
          const Icon =
            item.metadata?.icon ??
            Sparkles;


          return (
            <MenuItem
              key={item.name}
              onSelect={() => {
                setTheme(item.name);
                setOpen(false);
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