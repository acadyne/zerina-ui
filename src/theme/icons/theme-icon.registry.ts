import {
  Sparkles,
  Sun,
  Moon,
  Flower2,
  SunMedium,
  Leaf,
  Snowflake,
  Palette,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import type {
  ThemeIconName,
} from "./theme-icon.types";


export const THEME_ICON_REGISTRY:
  Record<
    ThemeIconName,
    LucideIcon
  > = {
    sun:
      Sun,

    moon:
      Moon,

    sparkles:
      Sparkles,

    spring:
      Flower2,

    summer:
      SunMedium,

    autumn:
      Leaf,

    winter:
      Snowflake,

    palette:
      Palette,
  };


export function registerThemeIcon(
  name: ThemeIconName,
  icon: LucideIcon
): void {
  THEME_ICON_REGISTRY[name] = icon;
}