// src/primitives/navigation/navigation-rail/navigationRail.utils.ts
import { cssSize } from "../../../helpers/css";
import type { NavigationRailBadgeOffset } from "./navigationRail.types";

export { cssSize };

export function getOffsetTransform(
  offset?: NavigationRailBadgeOffset
): string | undefined {
  if (!offset?.x && !offset?.y) return undefined;

  const x = offset.x === undefined ? "0px" : cssSize(offset.x);
  const y = offset.y === undefined ? "0px" : cssSize(offset.y);

  return `translate(${x}, ${y})`;
}