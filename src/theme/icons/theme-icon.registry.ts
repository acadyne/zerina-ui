// src/theme/icons/theme-icon.registry.ts

import {
  Flower2,
  Leaf,
  Moon,
  Palette,
  Snowflake,
  Sparkles,
  Sun,
  SunMedium,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import type {
  ThemeIconName,
} from "../contracts/theme.types";


/**
 * Provider-independent collection of theme icons.
 *
 * Consumers may supply a local registry to ThemeSwitcher or
 * resolveThemeIcon(). The registry is never mutated by Zerina UI.
 */
export type ThemeIconRegistry =
  Readonly<
    Record<
      ThemeIconName,
      LucideIcon
    >
  >;


const BUILT_IN_THEME_ICONS:
  ThemeIconRegistry =
  Object.freeze({
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
  });


export function getBuiltInThemeIcon(
  name: ThemeIconName
): LucideIcon | undefined {
  return BUILT_IN_THEME_ICONS[
    name
  ];
}