// src/components/media/Avatar.tsx
import React, { forwardRef, useMemo, useState } from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { SkeletonCircle } from "../feedback/SkeletonCircle";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

export type AvatarSlot =
  | "root"
  | "image"
  | "fallback"
  | "icon"
  | "initials"
  | "skeleton";

export type AvatarStyles = SlotStyleMap<AvatarSlot>;

export type AvatarSlotProps = SlotPropsMap<AvatarSlot>;

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  name?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  rounded?: React.CSSProperties["borderRadius"];
  bg?: React.CSSProperties["background"];
  color?: React.CSSProperties["color"];
  icon?: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  loading?: boolean;
  skeletonAnimated?: boolean;

  styles?: AvatarStyles;
  slotProps?: AvatarSlotProps;
}

const sizeMap: Record<Exclude<AvatarSize, number>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 68,
};

function getInitials(name?: string): string {
  if (!name?.trim()) return "?";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      name,
      src,
      alt,
      size = "md",
      rounded = "var(--ui-radius-full)",
      bg = "var(--ui-surface-3)",
      color = "var(--ui-text)",
      icon,
      fallback,
      className = "",
      style,
      loading = false,
      skeletonAnimated = true,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const [imgError, setImgError] = useState(false);

    const px = typeof size === "number" ? size : sizeMap[size];
    const initials = useMemo(() => getInitials(name), [name]);

    const fontSize = useMemo(() => {
      if (px <= 24) return "0.7rem";
      if (px <= 32) return "0.78rem";
      if (px <= 40) return "0.9rem";
      if (px <= 52) return "1rem";
      return "1.15rem";
    }, [px]);

    const accessibleLabel = alt ?? name ?? "Avatar";
    const showImage = Boolean(src) && !imgError;

    const rootSlot = resolveSlot<AvatarSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "aria-label": accessibleLabel,
        role: "img",
        "data-ui-avatar": "",
        "data-ui-avatar-loading": loading || undefined,
      },
      baseStyle: {
        width: px,
        height: px,
        minWidth: px,
        minHeight: px,
        borderRadius: rounded,
        background: bg,
        color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        userSelect: "none",
        flexShrink: 0,
        border: "1px solid var(--ui-border)",
        boxShadow: "var(--ui-shadow-sm)",
      },
    });

    const imageSlot = resolveSlot<AvatarSlot>({
      slot: "image",
      styles,
      slotProps,
      baseStyle: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      },
    });

    const fallbackSlot = resolveSlot<AvatarSlot>({
      slot: "fallback",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        lineHeight: 1,
      },
    });

    const iconSlot = resolveSlot<AvatarSlot>({
      slot: "icon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        lineHeight: 1,
      },
    });

    const initialsSlot = resolveSlot<AvatarSlot>({
      slot: "initials",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        fontSize,
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: "0.02em",
      },
    });

    const skeletonSlot = resolveSlot<AvatarSlot>({
      slot: "skeleton",
      styles,
      slotProps,
      baseStyle: {
        width: "100%",
        height: "100%",
        borderRadius: rounded,
      },
    });

    if (loading) {
      return (
        <div
          {...rootSlot}
          ref={ref}
          aria-busy="true"
          data-ui="avatar-loading"
          {...rest}
        >
          <SkeletonCircle
            size={px}
            animated={skeletonAnimated}
            className={skeletonSlot.className}
            style={skeletonSlot.style}
          />
        </div>
      );
    }

    return (
      <div
        {...rootSlot}
        ref={ref}
        {...rest}
      >
        {showImage ? (
          <img
            {...imageSlot}
            src={src}
            alt={accessibleLabel}
            onError={() => setImgError(true)}
          />
        ) : fallback ? (
          <span {...fallbackSlot}>{fallback}</span>
        ) : icon ? (
          <span {...iconSlot}>{icon}</span>
        ) : (
          <span {...initialsSlot}>{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";