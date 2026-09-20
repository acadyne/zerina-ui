// src/theme/contracts/visual-semantics.ts

export const UI_TONES = [
  "neutral",
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "danger",
] as const;

export type UITone =
  (typeof UI_TONES)[number];


export const UI_SURFACE_ROLES = [
  "canvas",
  "surface",
  "containerLow",
  "container",
  "containerHigh",
] as const;

export type UISurfaceRole =
  (typeof UI_SURFACE_ROLES)[number];


export const UI_ELEVATIONS = [
  0,
  1,
  2,
  3,
  4,
  5,
] as const;

export type UIElevation =
  (typeof UI_ELEVATIONS)[number];


export const UI_TYPOGRAPHY_ROLES = [
  "display",
  "headline",
  "title",
  "body",
  "label",
  "caption",
] as const;

export type UITypographyRole =
  (typeof UI_TYPOGRAPHY_ROLES)[number];


export const UI_SHAPES = [
  "sm",
  "md",
  "lg",
  "xl",
  "full",
] as const;

export type UIShape =
  (typeof UI_SHAPES)[number];
