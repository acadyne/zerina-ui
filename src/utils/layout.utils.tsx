// src/utils/layout.utils.tsx
import React from "react";

export function normalizeInlineChild(
  child: React.ReactNode,
  align: React.CSSProperties["alignItems"],
  key: React.Key
): React.ReactNode {
  if (child === null || child === undefined || child === false) {
    return null;
  }

  if (React.isValidElement(child)) {
    if (child.key != null) return child;

    return <React.Fragment key={key}>{child}</React.Fragment>;
  }

  return (
    <span
      key={key}
      style={{
        display: "inline-flex",
        alignItems: align,
        minWidth: 0,
      }}
    >
      {child}
    </span>
  );
}