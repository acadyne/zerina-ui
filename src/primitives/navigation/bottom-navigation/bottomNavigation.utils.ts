// src/primitives/navigation/bottom-navigation/bottomNavigation.utils.ts
import { cssSize } from "../../../helpers/css";
import type { BottomNavigationBadgeOffset } from "./bottomNavigation.types";

export { cssSize };

export function getOffsetTransform(
  offset?: BottomNavigationBadgeOffset
): string | undefined {
  if (!offset?.x && !offset?.y) return undefined;

  const x = offset.x === undefined ? "0px" : cssSize(offset.x);
  const y = offset.y === undefined ? "0px" : cssSize(offset.y);

  return `translate(${x}, ${y})`;
}