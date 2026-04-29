// src/primitives/navigation/RecursiveFloatingMenuLayer.tsx

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DismissableLayer, getLayerZIndex } from "../../core/overlay";
import { useOptionalUIMotion } from "../../core/motion";

export interface RecursiveFloatingMenuLayerProps {
  open: boolean;
  level: number;
  anchorX: number;
  containerRef: React.RefObject<HTMLElement | null>;
  direction?: "up" | "down";
  edgeMargin?: number;
  onDismiss?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export const RecursiveFloatingMenuLayer: React.FC<
  RecursiveFloatingMenuLayerProps
> = ({
  open,
  level,
  anchorX,
  containerRef,
  direction = "up",
  edgeMargin = 10,
  onDismiss,
  children,
  className = "",
  style,
}) => {
  const overlayId = React.useId().replace(/:/g, "");
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [left, setLeft] = React.useState<number>(0);

  const motionState = useOptionalUIMotion();

  const variants = motionState.getVariants(
    direction === "up" ? "slide-up" : "slide-down",
    motionState.effectiveLevel
  );

  const transition = motionState.getTransition(
    motionState.effectiveLevel,
    "slide"
  );

  const updatePosition = React.useCallback(() => {
    const containerEl = containerRef.current;
    const panelEl = panelRef.current;

    if (!open || !containerEl || !panelEl) return;

    const containerRect = containerEl.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();

    const minLeft = edgeMargin;
    const maxLeft = Math.max(
      edgeMargin,
      containerRect.width - panelRect.width - edgeMargin
    );

    const nextLeft = clamp(anchorX - panelRect.width / 2, minLeft, maxLeft);
    setLeft(nextLeft);
  }, [anchorX, containerRef, edgeMargin, open]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition, children]);

  React.useEffect(() => {
    if (!open) return;

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener("resize", handleResize);

    const containerEl = containerRef.current;
    containerEl?.addEventListener("scroll", handleScroll, { passive: true });

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updatePosition())
        : null;

    if (containerEl) ro?.observe(containerEl);
    if (panelRef.current) ro?.observe(panelRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerEl?.removeEventListener("scroll", handleScroll);
      ro?.disconnect();
    };
  }, [open, updatePosition, containerRef]);

  const verticalOffsetRem = level * 2.2;
  const zIndex = getLayerZIndex("popover") + level;

  return (
    <AnimatePresence>
      {open ? (
        <DismissableLayer
          overlayId={`recursive-floating-menu-${overlayId}`}
          layer={zIndex}
          enabled={open}
          dismissOnEscape
          dismissOnPointerDownOutside
          onDismiss={onDismiss}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex,
          }}
        >
          <motion.div
            ref={panelRef}
            className={className}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            style={{
              position: "absolute",
              left,
              top: direction === "down" ? `${verticalOffsetRem}rem` : undefined,
              bottom: direction === "up" ? `${verticalOffsetRem}rem` : undefined,
              pointerEvents: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              padding: "0.75rem",
              maxWidth: "calc(100vw - 20px)",
              border: "1px solid var(--ui-border)",
              borderRadius: "var(--ui-radius-lg)",
              background: "var(--ui-surface)",
              color: "var(--ui-text)",
              boxShadow: "var(--ui-shadow-lg)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              transformOrigin:
                direction === "up" ? "bottom center" : "top center",
              ...style,
            }}
          >
            {children}
          </motion.div>
        </DismissableLayer>
      ) : null}
    </AnimatePresence>
  );
};

RecursiveFloatingMenuLayer.displayName = "RecursiveFloatingMenuLayer";