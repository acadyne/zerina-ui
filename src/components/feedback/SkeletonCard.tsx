// src/components/feedback/SkeletonCard.tsx
import React from "react";
import {
  Card,
  CardBody,
  type CardProps,
} from "../display/Card";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { SkeletonBlock } from "./SkeletonBlock";
import { SkeletonCircle } from "./SkeletonCircle";
import { SkeletonText } from "./SkeletonText";

export type SkeletonCardSlot =
  | "root"
  | "body"
  | "header"
  | "avatar"
  | "headerText"
  | "media"
  | "content";

export type SkeletonCardStyles =
  SlotStyleMap<SkeletonCardSlot>;

export type SkeletonCardSlotProps =
  SlotPropsMap<SkeletonCardSlot>;

export interface SkeletonCardProps
  extends Omit<
    CardProps,
    "children" | "p" | "styles" | "slotProps"
  > {
  avatar?: boolean;
  media?: boolean;
  lines?: number;
  animated?: boolean;

  p?: React.CSSProperties["padding"];

  styles?: SkeletonCardStyles;
  slotProps?: SkeletonCardSlotProps;
}

export const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  SkeletonCardProps
>(
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

      styles,
      slotProps,

      ...rest
    },
    ref
  ) => {
    const safeLines = Math.max(1, lines);

    const rootSlot = resolveSlot<SkeletonCardSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,

      baseProps: {
        "aria-hidden": true,
        "data-ui-skeleton-card": "",
        "data-ui-skeleton-card-avatar":
          avatar || undefined,
        "data-ui-skeleton-card-media":
          media || undefined,
      },
    });

    const bodySlot = resolveSlot<SkeletonCardSlot>({
      slot: "body",
      styles,
      slotProps,
    });

    const headerSlot = resolveSlot<SkeletonCardSlot>({
      slot: "header",
      styles,
      slotProps,

      baseStyle: {
        display: "flex",
        alignItems: "center",
        gap: "0.85rem",
        minWidth: 0,
        marginBottom:
          media
            ? "1rem"
            : "0.85rem",
      },
    });

    const avatarSlot = resolveSlot<SkeletonCardSlot>({
      slot: "avatar",
      styles,
      slotProps,
    });

    const headerTextSlot =
      resolveSlot<SkeletonCardSlot>({
        slot: "headerText",
        styles,
        slotProps,

        baseStyle: {
          flex: 1,
          minWidth: 0,
        },
      });

    const mediaSlot = resolveSlot<SkeletonCardSlot>({
      slot: "media",
      styles,
      slotProps,

      baseStyle: {
        marginBottom: "1rem",
      },
    });

    const contentSlot = resolveSlot<SkeletonCardSlot>({
      slot: "content",
      styles,
      slotProps,
    });

    return (
      <Card
        {...rest}
        {...toMotionSlotProps(rootSlot)}
        ref={ref}
        rounded={rounded}
        bordered={bordered}
      >
        <CardBody
          {...bodySlot}
          p={p}
        >
          <div {...headerSlot}>
            {avatar ? (
              <SkeletonCircle
                {...avatarSlot}
                size={42}
                animated={animated}
              />
            ) : null}

            <div {...headerTextSlot}>
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
              {...mediaSlot}
              height={160}
              rounded="var(--ui-radius-lg)"
              animated={animated}
            />
          ) : null}

          <SkeletonText
            {...contentSlot}
            lines={safeLines}
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