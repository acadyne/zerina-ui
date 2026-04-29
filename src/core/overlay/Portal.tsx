// src/core/overlay/Portal.tsx
import React from "react";
import { createPortal } from "react-dom";
import { useOverlayContext } from "./OverlayProvider";

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
  const { portalRoot } = useOverlayContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (disabled) {
    return <>{children}</>;
  }

  if (!mounted) {
    return null;
  }

  const target = container ?? portalRoot;

  if (!target) {
    return null;
  }

  return createPortal(children, target);
};

Portal.displayName = "Portal";