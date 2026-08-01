// src/core/overlay/ScrollLock.tsx

import React from "react";
import {
  acquireBodyScrollLock,
  releaseBodyScrollLock,
} from "../dom";

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
    /*
     * El bloqueo pertenece a cada modal activo, no solo al overlay superior.
     * El registro global deduplica por overlayId y restaura el body únicamente
     * después de liberar el último lock, incluso con desmontaje fuera de orden.
     */
    React.useEffect(() => {
      if (
        !enabled ||
        !active
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
      overlayId,
    ]);

    return null;
  };

ScrollLock.displayName =
  "ScrollLock";