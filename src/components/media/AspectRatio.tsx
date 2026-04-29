// src/components/media/AspectRatio.tsx
import React, { forwardRef, useMemo } from "react";

type RatioValue = number | `${number}/${number}` | `${number}:${number}`;

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  ratio?: RatioValue;
  className?: string;
  style?: React.CSSProperties;

  w?: React.CSSProperties["width"];
  h?: React.CSSProperties["height"];
  minH?: React.CSSProperties["minHeight"];
  maxH?: React.CSSProperties["maxHeight"];

  rounded?: React.CSSProperties["borderRadius"];
  overflow?: React.CSSProperties["overflow"];
  bg?: React.CSSProperties["backgroundColor"];
}

function normalizeRatio(ratio: RatioValue): number {
  if (typeof ratio === "number") {
    return ratio > 0 ? ratio : 16 / 9;
  }

  if (ratio.includes("/")) {
    const [w, h] = ratio.split("/").map(Number);
    if (w > 0 && h > 0) return w / h;
  }

  if (ratio.includes(":")) {
    const [w, h] = ratio.split(":").map(Number);
    if (w > 0 && h > 0) return w / h;
  }

  return 16 / 9;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  (
    {
      children,
      ratio = "16/9",
      className = "",
      style,

      w = "100%",
      h,
      minH,
      maxH,

      rounded,
      overflow = "hidden",
      bg,

      ...rest
    },
    ref
  ) => {
    const resolvedRatio = useMemo(() => normalizeRatio(ratio), [ratio]);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: "relative",
          width: w,
          height: h,
          minHeight: minH,
          maxHeight: maxH,
          aspectRatio: `${resolvedRatio}`,
          borderRadius: rounded,
          overflow,
          background: bg,
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";