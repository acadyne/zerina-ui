// src/primitives/navigation/navigation-rail/navigationRail.utils.ts
import type { NavigationRailBadgeOffset } from "./navigationRail.types";

export function cssSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export function getOffsetTransform(
  offset?: NavigationRailBadgeOffset
): string | undefined {
  if (!offset?.x && !offset?.y) return undefined;

  const x = offset.x === undefined ? "0px" : cssSize(offset.x);
  const y = offset.y === undefined ? "0px" : cssSize(offset.y);

  return `translate(${x}, ${y})`;
}