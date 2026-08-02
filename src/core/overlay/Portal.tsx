// src/core/overlay/Portal.tsx

import React from "react";
import { createPortal } from "react-dom";
import {
  retainOverlayPortalContainer,
  type OverlayPortalToken,
} from "./OverlayDocumentRegistry";
import { useOverlayContext } from "./OverlayProvider";

export interface OverlayPortalContextValue {
  container: Element | DocumentFragment;
  ownerDocument: Document;
  sourceDocument: Document | null;
}

const OverlayPortalContext =
  React.createContext<OverlayPortalContextValue | null>(null);

export interface PortalProps {
  children?: React.ReactNode;
  container?: Element | DocumentFragment | null;
  disabled?: boolean;
}

export const Portal: React.FC<PortalProps> = ({
  children,
  container,
  disabled = false,
}) => {
  const { portalRoot, ownerDocument: sourceDocument } = useOverlayContext();
  const [portalToken] = React.useState<OverlayPortalToken>(() =>
    Symbol("overlay-portal")
  );
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const target = mounted && !disabled
    ? container ?? portalRoot
    : null;

  React.useEffect(() => {
    if (!target) {
      return;
    }

    return retainOverlayPortalContainer(target, portalToken);
  }, [portalToken, target]);

  if (disabled) {
    return <>{children}</>;
  }

  if (!target || !target.ownerDocument) {
    return null;
  }

  const contextValue: OverlayPortalContextValue = {
    container: target,
    ownerDocument: target.ownerDocument,
    sourceDocument,
  };

  return createPortal(
    <OverlayPortalContext.Provider value={contextValue}>
      {children}
    </OverlayPortalContext.Provider>,
    target
  );
};

Portal.displayName = "Portal";

export function useOverlayPortalContext(): OverlayPortalContextValue | null {
  return React.useContext(OverlayPortalContext);
}
