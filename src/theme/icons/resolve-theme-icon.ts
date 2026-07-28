// src/theme/icons/resolve-theme-icon.ts

import {
  Sparkles,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import type {
  ThemeIconName,
} from "../contracts/theme.types";

import {
  getBuiltInThemeIcon,
  type ThemeIconRegistry,
} from "./theme-icon.registry";


function getCustomThemeIcon(
  registry:
    ThemeIconRegistry | undefined,
  name:
    ThemeIconName
): LucideIcon | undefined {
  if (
    !registry ||
    !Object.prototype
      .hasOwnProperty
      .call(
        registry,
        name
      )
  ) {
    return undefined;
  }


  return registry[
    name
  ];
}


/**
 * Resolves a theme icon without consulting mutable global state.
 *
 * A local registry has priority over built-in icons, allowing a
 * component instance to override a built-in name without affecting
 * any other application, request, test, or React tree.
 */
export function resolveThemeIcon(
  icon?: ThemeIconName,
  registry?: ThemeIconRegistry
): LucideIcon {
  if (!icon) {
    return Sparkles;
  }


  return (
    getCustomThemeIcon(
      registry,
      icon
    ) ??
    getBuiltInThemeIcon(
      icon
    ) ??
    Sparkles
  );
}