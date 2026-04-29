// src/helpers/css.ts
import React from "react";

export function cx(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function cssVar(name: string, fallback?: string): string {
  const normalized = name.startsWith("--") ? name : `--${name}`;
  return fallback
    ? `var(${normalized}, ${fallback})`
    : `var(${normalized})`;
}

export function px(value?: number | string): string | number | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function mergeStyles(
  ...styles: Array<React.CSSProperties | undefined>
): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

export function omitUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}