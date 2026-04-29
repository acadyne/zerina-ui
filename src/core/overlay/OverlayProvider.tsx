// src/core/overlay/OverlayProvider.tsx
import React from "react";

type OverlayId = string;

type RegisteredOverlay = {
  id: OverlayId;
  layer: number;
  order: number;
};

type OverlayContextValue = {
  portalRoot: HTMLElement | null;
  registerOverlay: (id: OverlayId, layer: number) => void;
  unregisterOverlay: (id: OverlayId) => void;
  isTopmost: (id: OverlayId) => boolean;
  getTopmostId: () => OverlayId | null;
};

const OverlayContext = React.createContext<OverlayContextValue | null>(null);

const DEFAULT_ROOT_ID = "ui-overlay-root";

function canUseDOM(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getOrCreateOverlayRoot(rootId: string): {
  node: HTMLElement | null;
  created: boolean;
} {
  if (!canUseDOM()) {
    return { node: null, created: false };
  }

  const existing = document.getElementById(rootId);
  if (existing) {
    return { node: existing, created: false };
  }

  const root = document.createElement("div");
  root.id = rootId;
  root.setAttribute("data-ui-overlay-root", rootId);
  document.body.appendChild(root);

  return { node: root, created: true };
}

function compareOverlays(a: RegisteredOverlay, b: RegisteredOverlay): number {
  if (a.layer !== b.layer) {
    return a.layer - b.layer;
  }

  return a.order - b.order;
}

export interface OverlayProviderProps {
  children: React.ReactNode;
  rootId?: string;
}

export const OverlayProvider: React.FC<OverlayProviderProps> = ({
  children,
  rootId = DEFAULT_ROOT_ID,
}) => {
  const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null);
  const overlaysRef = React.useRef<RegisteredOverlay[]>([]);
  const orderRef = React.useRef(0);
  const createdRootRef = React.useRef<HTMLElement | null>(null);
  const [, forceRender] = React.useReducer((value) => value + 1, 0);

  React.useEffect(() => {
    const { node, created } = getOrCreateOverlayRoot(rootId);

    setPortalRoot(node);
    createdRootRef.current = created ? node : null;

    return () => {
      const createdRoot = createdRootRef.current;

      if (createdRoot && createdRoot.parentNode) {
        createdRoot.parentNode.removeChild(createdRoot);
      }

      createdRootRef.current = null;
      setPortalRoot(null);
    };
  }, [rootId]);

  const registerOverlay = React.useCallback((id: OverlayId, layer: number) => {
    const existing = overlaysRef.current.find((item) => item.id === id);

    if (existing) {
      if (existing.layer !== layer) {
        existing.layer = layer;
        forceRender();
      }
      return;
    }

    orderRef.current += 1;
    overlaysRef.current = [
      ...overlaysRef.current,
      {
        id,
        layer,
        order: orderRef.current,
      },
    ];

    forceRender();
  }, []);

  const unregisterOverlay = React.useCallback((id: OverlayId) => {
    const next = overlaysRef.current.filter((item) => item.id !== id);

    if (next.length === overlaysRef.current.length) {
      return;
    }

    overlaysRef.current = next;
    forceRender();
  }, []);

  const getTopmostId = React.useCallback((): OverlayId | null => {
    if (!overlaysRef.current.length) {
      return null;
    }

    let topmost = overlaysRef.current[0];

    for (let i = 1; i < overlaysRef.current.length; i += 1) {
      const current = overlaysRef.current[i];
      if (compareOverlays(topmost, current) < 0) {
        topmost = current;
      }
    }

    return topmost?.id ?? null;
  }, []);

  const isTopmost = React.useCallback(
    (id: OverlayId) => getTopmostId() === id,
    [getTopmostId]
  );

  const value = React.useMemo<OverlayContextValue>(
    () => ({
      portalRoot,
      registerOverlay,
      unregisterOverlay,
      isTopmost,
      getTopmostId,
    }),
    [portalRoot, registerOverlay, unregisterOverlay, isTopmost, getTopmostId]
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
};

export function useOverlayContext(): OverlayContextValue {
  const ctx = React.useContext(OverlayContext);

  if (!ctx) {
    throw new Error("useOverlayContext must be used inside <OverlayProvider />");
  }

  return ctx;
}

export function useOverlayRegistration(
  id: string,
  layer: number,
  enabled = true
) {
  const { registerOverlay, unregisterOverlay } = useOverlayContext();

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    registerOverlay(id, layer);

    return () => {
      unregisterOverlay(id);
    };
  }, [enabled, id, layer, registerOverlay, unregisterOverlay]);
}

export function useIsOverlayTopmost(id: string): boolean {
  const { isTopmost } = useOverlayContext();
  return isTopmost(id);
}