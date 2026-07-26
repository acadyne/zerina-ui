// src/theme/icons/theme-icon.registry.ts

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
} from "../contracts/theme.types";


export interface RegisterThemeIconOptions {
  overwrite?: boolean;
}


const themeIconRegistry =
  new Map<
    ThemeIconName,
    LucideIcon
  >([
    [
      "sun",
      Sun,
    ],

    [
      "moon",
      Moon,
    ],

    [
      "sparkles",
      Sparkles,
    ],

    [
      "spring",
      Flower2,
    ],

    [
      "summer",
      SunMedium,
    ],

    [
      "autumn",
      Leaf,
    ],

    [
      "winter",
      Snowflake,
    ],

    [
      "palette",
      Palette,
    ],
  ]);


export function getThemeIcon(
  name: ThemeIconName
): LucideIcon | undefined {
  return themeIconRegistry.get(name);
}


export function registerThemeIcon(
  name: ThemeIconName,
  icon: LucideIcon,
  options: RegisterThemeIconOptions = {}
): void {
  const registeredIcon =
    themeIconRegistry.get(name);


  if (!registeredIcon) {
    themeIconRegistry.set(
      name,
      icon
    );

    return;
  }


  if (registeredIcon === icon) {
    return;
  }


  if (!options.overwrite) {
    throw new Error(
      `Theme icon "${name}" is already registered. ` +
      "Pass { overwrite: true } to replace it."
    );
  }


  themeIconRegistry.set(
    name,
    icon
  );
}