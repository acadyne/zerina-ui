// src/components/feedback/SkeletonCard.tsx
import React from "react";
import { Card, CardBody, type CardProps } from "../display/Card";
import { SkeletonBlock } from "./SkeletonBlock";
import { SkeletonCircle } from "./SkeletonCircle";
import { SkeletonText } from "./SkeletonText";

export interface SkeletonCardProps
  extends Omit<CardProps, "children" | "p"> {
  avatar?: boolean;
  media?: boolean;
  lines?: number;
  animated?: boolean;

  p?: React.CSSProperties["padding"];
}

export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      avatar = true,
      media = false,
      lines = 3,
      animated = true,
      p = "1rem",
      rounded = "var(--ui-radius-xl)",
      bordered = true,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={className}
        rounded={rounded}
        bordered={bordered}
        style={style}
        {...rest}
      >
        <CardBody p={p}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              minWidth: 0,
              marginBottom: media ? "1rem" : "0.85rem",
            }}
          >
            {avatar ? <SkeletonCircle size={42} animated={animated} /> : null}

            <div style={{ flex: 1, minWidth: 0 }}>
              <SkeletonText
                lines={2}
                height={10}
                spacing={8}
                lastLineWidth="58%"
                animated={animated}
              />
            </div>
          </div>

          {media ? (
            <SkeletonBlock
              height={160}
              rounded="var(--ui-radius-lg)"
              animated={animated}
              style={{ marginBottom: "1rem" }}
            />
          ) : null}

          <SkeletonText
            lines={lines}
            height={10}
            spacing={8}
            lastLineWidth="72%"
            animated={animated}
          />
        </CardBody>
      </Card>
    );
  }
);

SkeletonCard.displayName = "SkeletonCard";