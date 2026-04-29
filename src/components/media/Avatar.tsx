// src/components/media/Avatar.tsx
import React, { forwardRef, useMemo, useState } from "react";
import { SkeletonCircle } from "../feedback/SkeletonCircle";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  name?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  rounded?: React.CSSProperties["borderRadius"];
  bg?: React.CSSProperties["backgroundColor"];
  color?: React.CSSProperties["color"];
  icon?: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;

  loading?: boolean;
  skeletonAnimated?: boolean;
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
      imgStyle,
      loading = false,
      skeletonAnimated = true,
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

    if (loading) {
      return (
        <div
          ref={ref}
          className={className}
          aria-busy="true"
          data-ui="avatar-loading"
          style={{
            width: px,
            height: px,
            minWidth: px,
            minHeight: px,
            borderRadius: rounded,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
            ...style,
          }}
          {...rest}
        >
          <SkeletonCircle
            size={px}
            animated={skeletonAnimated}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: rounded,
            }}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={className}
        aria-label={accessibleLabel}
        role="img"
        style={{
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
          ...style,
        }}
        {...rest}
      >
        {showImage ? (
          <img
            src={src}
            alt={accessibleLabel}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              ...imgStyle,
            }}
          />
        ) : fallback ? (
          fallback
        ) : icon ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize,
              lineHeight: 1,
            }}
          >
            {icon}
          </span>
        ) : (
          <span
            aria-hidden="true"
            style={{
              fontSize,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {initials}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";