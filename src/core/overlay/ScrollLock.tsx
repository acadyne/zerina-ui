// src/core/overlay/ScrollLock.tsx

import React from "react";
import {
  acquireBodyScrollLock,
  releaseBodyScrollLock,
} from "../dom";
import { useOverlayInstanceContext } from "./DismissableLayer";

export const ScrollLock: React.FC = () => {
  const { interactive, ownerDocument } = useOverlayInstanceContext();
  const [lockToken] = React.useState(() =>
    Symbol("overlay-scroll-lock")
  );

  React.useEffect(() => {
    if (!interactive || !ownerDocument) {
      return;
    }

    acquireBodyScrollLock(ownerDocument, lockToken);

    return () => {
      releaseBodyScrollLock(ownerDocument, lockToken);
    };
  }, [interactive, lockToken, ownerDocument]);

  return null;
};

ScrollLock.displayName = "ScrollLock";
