// src/theme/recipes/surface-recipe.ts

import type {
  UIElevation,
  UIShape,
  UISurfaceRole,
} from "../contracts/visual-semantics";


export type UISurfaceBorder =
  | "none"
  | "subtle"
  | "strong";


export interface SurfaceRecipeOptions {
  role?:
    UISurfaceRole;

  elevation?:
    UIElevation;

  shape?:
    UIShape;

  border?:
    UISurfaceBorder;
}


export interface SurfaceRecipeStyle {
  background:
    string;

  color:
    string;

  border:
    string;

  borderRadius:
    string;

  boxShadow:
    string;
}


const SURFACE_BACKGROUND:
  Record<
    UISurfaceRole,
    string
  > = {
    canvas:
      "var(--ui-surface-canvas)",

    surface:
      "var(--ui-surface)",

    containerLow:
      "var(--ui-surface-container-low)",

    container:
      "var(--ui-surface-container)",

    containerHigh:
      "var(--ui-surface-container-high)",
  };


const SURFACE_ELEVATION:
  Record<
    UIElevation,
    string
  > = {
    0:
      "var(--ui-elevation-0)",

    1:
      "var(--ui-elevation-1)",

    2:
      "var(--ui-elevation-2)",

    3:
      "var(--ui-elevation-3)",

    4:
      "var(--ui-elevation-4)",

    5:
      "var(--ui-elevation-5)",
  };


const SURFACE_SHAPE:
  Record<
    UIShape,
    string
  > = {
    sm:
      "var(--ui-radius-sm)",

    md:
      "var(--ui-radius-md)",

    lg:
      "var(--ui-radius-lg)",

    xl:
      "var(--ui-radius-xl)",

    full:
      "var(--ui-radius-full)",
  };


const SURFACE_BORDER:
  Record<
    UISurfaceBorder,
    string
  > = {
    none:
      "transparent",

    subtle:
      "var(--ui-border)",

    strong:
      "var(--ui-border-strong)",
  };


export function surfaceRecipe({
  role = "surface",
  elevation = 0,
  shape = "lg",
  border = "subtle",
}: SurfaceRecipeOptions = {}): SurfaceRecipeStyle {
  return {
    background:
      SURFACE_BACKGROUND[
        role
      ],

    color:
      "var(--ui-text)",

    border:
      `1px solid ${SURFACE_BORDER[
        border
      ]}`,

    borderRadius:
      SURFACE_SHAPE[
        shape
      ],

    boxShadow:
      SURFACE_ELEVATION[
        elevation
      ],
  };
}
