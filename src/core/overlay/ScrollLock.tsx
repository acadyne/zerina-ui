// src/core/overlay/ScrollLock.tsx

import React from "react";
import {
  acquireBodyScrollLock,
  releaseBodyScrollLock,
} from "../dom";
import { useIsOverlayTopmost } from "./OverlayProvider";

export interface ScrollLockProps {
  overlayId: string;
  enabled?: boolean;
  active?: boolean;
}

export const ScrollLock:
  React.FC<ScrollLockProps> = ({
    overlayId,
    enabled = true,
    active = true,
  }) => {
    const isTopmost =
      useIsOverlayTopmost(
        overlayId
      );

    React.useEffect(() => {
      if (
        !enabled ||
        !active ||
        !isTopmost
      ) {
        return;
      }

      acquireBodyScrollLock(
        overlayId
      );

      return () => {
        releaseBodyScrollLock(
          overlayId
        );
      };
    }, [
      active,
      enabled,
      isTopmost,
      overlayId,
    ]);

    return null;
  };

ScrollLock.displayName =
  "ScrollLock";