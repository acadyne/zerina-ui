// src/theme/icons/resolve-theme-icon.ts

import {
  Sparkles,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  THEME_ICON_REGISTRY,
} from "./theme-icon.registry";

import type {
  ThemeIconName,
} from "./theme-icon.types";


export function resolveThemeIcon(
  icon?: ThemeIconName
): LucideIcon {
  if (!icon) {
    return Sparkles;
  }

  return (
    THEME_ICON_REGISTRY[icon] ??
    Sparkles
  );
}