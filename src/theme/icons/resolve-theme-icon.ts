// src/theme/icons/resolve-theme-icon.ts

import {
  Sparkles,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  getThemeIcon,
} from "./theme-icon.registry";

import type {
  ThemeIconName,
} from "../contracts/theme.types";

export function resolveThemeIcon(
  icon?: ThemeIconName
): LucideIcon {
  if (!icon) {
    return Sparkles;
  }

  return (
    getThemeIcon(icon) ??
    Sparkles
  );
}