// src/patterns/app-shell/AppShellMobileBar.tsx
import React from "react";
import { getElementRect } from "../../core/dom";
import type { UIPressEvent } from "../../core/interaction";
import { Box } from "../../primitives/layout";
import { BottomNavigation } from "../../primitives/navigation";
import { RecursiveFloatingMenuLayer } from "../../primitives/navigation/RecursiveFloatingMenuLayer";
import type {
  NavigationNode,
} from "../navigation";
import type {
  AppShellViewport,
} from "./AppShell.types";
import {
  isNavigationNodeSelectable,
} from "../navigation";
import { getScaffoldLayer } from "../scaffold/scaffoldLayers";

export interface AppShellMobileBarProps {
  viewport?: AppShellViewport;

  items: NavigationNode[];

  activeId?: string | null;

  height?: number;

  onSelect?: (
    item: NavigationNode
  ) => void;

  className?: string;
  style?: React.CSSProperties;
}

function getNavigationIcon(
  item: NavigationNode
): React.ReactNode {
  return (
    item.icon ??
    "•"
  );
}

export function AppShellMobileBar({
  viewport = "window",

  items,

  activeId,

  height = 68,

  onSelect,

  className = "",
  style,
}: AppShellMobileBarProps) {
  const containerRef =
    React.useRef<HTMLDivElement | null>(
      null
    );

  const [
    openItemId,
    setOpenItemId,
  ] =
    React.useState<string | null>(
      null
    );

  const [
    anchorX,
    setAnchorX,
  ] =
    React.useState(0);

  const isContained =
    viewport === "contained";

  const openItem =
    React.useMemo(() => {
      return (
        items.find(
          (item) =>
            item.id ===
            openItemId
        ) ?? null
      );
    }, [
      items,
      openItemId,
    ]);

  const updateAnchor =
    React.useCallback(
      (
        event: UIPressEvent<HTMLElement>
      ): void => {
        const triggerRect =
          getElementRect(
            event.currentTarget
          );

        const containerRect =
          getElementRect(
            containerRef.current
          );

        setAnchorX(
          triggerRect.left -
          containerRect.left +
          triggerRect.width / 2
        );
      },
      []
    );

  const handleRootPress =
    React.useCallback(
      (
        item: NavigationNode,
        event: UIPressEvent<HTMLElement>
      ): void => {
        if (item.disabled) {
          return;
        }

        updateAnchor(event);

        const children =
          item.children ?? [];

        if (
          children.length > 0
        ) {
          event.preventDefault();

          setOpenItemId(
            (current) =>
              current === item.id
                ? null
                : item.id
          );

          return;
        }

        setOpenItemId(null);

        if (
          isNavigationNodeSelectable(
            item
          )
        ) {
          onSelect?.(item);
        }
      },
      [
        onSelect,
        updateAnchor,
      ]
    );

  const renderMobileMenuItem =
    React.useCallback(
      (
        item: NavigationNode
      ) => {
        const active =
          activeId === item.id;

        const iconContent =
          getNavigationIcon(item);

        return (
          <button
            key={item.id}
            type="button"
            disabled={
              item.disabled
            }
            onClick={() => {
              const children =
                item.children ?? [];

              if (
                children.length > 0
              ) {
                return;
              }

              if (
                !isNavigationNodeSelectable(
                  item
                )
              ) {
                return;
              }

              setOpenItemId(null);

              onSelect?.(item);
            }}
            style={{
              width: "100%",
              minHeight: 42,

              display: "flex",
              alignItems: "center",

              gap: "0.65rem",

              padding:
                "0.55rem 0.7rem",

              borderRadius:
                "var(--ui-radius-md)",

              border: active
                ? "1px solid color-mix(in srgb, var(--ui-primary) 30%, var(--ui-border))"
                : "1px solid transparent",

              background:
                active
                  ? "color-mix(in srgb, var(--ui-primary) 16%, transparent)"
                  : "transparent",

              color: active
                ? "var(--ui-text)"
                : "var(--ui-text-muted)",

              cursor:
                item.disabled
                  ? "not-allowed"
                  : "pointer",

              opacity:
                item.disabled
                  ? "var(--ui-state-disabled-opacity)"
                  : 1,

              textAlign: "left",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 26,
                height: 26,

                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexShrink: 0,
              }}
            >
              {iconContent}
            </span>

            <span
              style={{
                flex: 1,
                minWidth: 0,

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",

                fontWeight:
                  active
                    ? 800
                    : 700,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      },
      [
        activeId,
        onSelect,
      ]
    );

  return (
    <Box
      ref={containerRef}
      className={
        className
      }
      style={{
        position:
          isContained
            ? "absolute"
            : "fixed",

        left: 0,
        right: 0,
        bottom: 0,

        zIndex: getScaffoldLayer(
          "navigationMobile"
        ),

        ...style,
      }}
    >
      <Box
        style={{
          position:
            "relative",

          minWidth: 0,
        }}
      >
        <BottomNavigation
          position="static"
          safeArea
          translucent
          height={height}
          value={
            activeId ?? ""
          }
        >
          {items.map(
            (item) => {
              const children =
                item.children ?? [];

              const hasChildren =
                children.length > 0;

              return (
                <BottomNavigation.Item
                  key={
                    item.id
                  }
                  value={
                    item.id
                  }
                  icon={
                    getNavigationIcon(
                      item
                    )
                  }
                  badge={
                    item.badge
                  }
                  disabled={
                    item.disabled
                  }
                  aria-haspopup={
                    hasChildren
                      ? "menu"
                      : undefined
                  }
                  aria-expanded={
                    hasChildren
                      ? openItemId ===
                      item.id
                      : undefined
                  }
                  onPress={(
                    event
                  ) => {
                    handleRootPress(
                      item,
                      event
                    );
                  }}
                >
                  {item.label}
                </BottomNavigation.Item>
              );
            }
          )}
        </BottomNavigation>

        <RecursiveFloatingMenuLayer
          open={
            Boolean(
              openItem
                ?.children
                ?.length
            )
          }
          level={1}
          anchorX={
            anchorX
          }
          containerRef={
            containerRef
          }
          direction="up"
          onDismiss={() =>
            setOpenItemId(
              null
            )
          }
          style={{
            minWidth: 220,
          }}
        >
          {openItem
            ?.children
            ?.map(
              renderMobileMenuItem
            )}
        </RecursiveFloatingMenuLayer>
      </Box>
    </Box>
  );
}

AppShellMobileBar.displayName =
  "AppShellMobileBar";