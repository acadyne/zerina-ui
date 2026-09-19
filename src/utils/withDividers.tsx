// src/utils/withDividers.tsx
import React from "react";
import {
  hasRenderableNode,
} from "../core/react/nodePresence";

export function withDividers(
  children: React.ReactNode,
  divider?: React.ReactNode
): React.ReactNode[] {
  const items = React.Children.toArray(children);

  if (!hasRenderableNode(divider) || items.length <= 1) {
    return items;
  }

  return items.flatMap((child, index) => {
    if (index === items.length - 1) {
      return [child];
    }

    if (React.isValidElement(divider)) {
      return [
        child,
        React.cloneElement(divider, {
          key: divider.key ?? `divider-${index}`,
        }),
      ];
    }

    return [
      child,
      <React.Fragment key={`divider-${index}`}>{divider}</React.Fragment>,
    ];
  });
}