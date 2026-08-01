import React from "react";
import {
  acquireBodyScrollLock,
  releaseBodyScrollLock,
} from "../dom";
import { useOverlayInstanceContext } from "./DismissableLayer";

export const ScrollLock: React.FC = () => {
  const { enabled, ownerDocument } = useOverlayInstanceContext();
  const [lockToken] = React.useState(() =>
    Symbol("overlay-scroll-lock")
  );

  React.useEffect(() => {
    if (!enabled || !ownerDocument) {
      return;
    }

    acquireBodyScrollLock(ownerDocument, lockToken);

    return () => {
      releaseBodyScrollLock(ownerDocument, lockToken);
    };
  }, [enabled, lockToken, ownerDocument]);

  return null;
};

ScrollLock.displayName = "ScrollLock";
