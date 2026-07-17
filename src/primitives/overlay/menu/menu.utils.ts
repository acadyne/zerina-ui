// src/primitives/overlay/menu/menu.utils.ts

import type React from "react";

import type {
  FloatingPlacement,
} from "../../../core/overlay";


export function getFloatingSide(
  placement: FloatingPlacement
):
  | "top"
  | "bottom"
  | "left"
  | "right" {
  return placement.split("-")[0] as
    | "top"
    | "bottom"
    | "left"
    | "right";
}


export function getMenuTransformOrigin(
  placement: FloatingPlacement
): React.CSSProperties["transformOrigin"] {
  switch (placement) {
    case "top":
      return "bottom center";

    case "top-start":
      return "bottom left";

    case "top-end":
      return "bottom right";

    case "bottom":
      return "top center";

    case "bottom-start":
      return "top left";

    case "bottom-end":
      return "top right";

    case "left":
      return "center right";

    case "left-start":
      return "top right";

    case "left-end":
      return "bottom right";

    case "right":
      return "center left";

    case "right-start":
      return "top left";

    case "right-end":
      return "bottom left";

    default:
      return "top left";
  }
}