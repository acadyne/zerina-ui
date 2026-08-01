// src/core/overlay/OverlayProvider.tsx
import React from "react";
import { assertValidOverlayId } from "./overlayId";

type OverlayId = string;
type OverlayOwner = symbol;

type RegisteredOverlay = {
  id: OverlayId;
  owner: OverlayOwner;
  layer: number;
  order: number;
};

type OverlayContextValue = {
  portalRoot: HTMLElement | null;
  registerOverlay: (
    id: OverlayId,
    layer: number,
    owner: OverlayOwner
  ) => void;

  unregisterOverlay: (
    id: OverlayId,
    owner: OverlayOwner
  ) => void;
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

  /*
   * El orden del registro decide qué overlay posee Escape, focus trap y
   * descarte exterior. Debe vivir en estado para propagar ese ownership;
   * una ref permitiría que los consumidores conservaran snapshots obsoletos.
   */
  const [overlays, setOverlays] =
    React.useState<RegisteredOverlay[]>([]);

  const orderRef = React.useRef(0);

  /*
   * El mapa permite distinguir una actualización legítima del mismo overlay
   * de dos instancias que intentan compartir ID. Sin owner, el segundo overlay
   * se fusionaría silenciosamente con el primero y podría liberar su registro.
   */
  const overlayOwnersRef =
    React.useRef<
      Map<
        OverlayId,
        OverlayOwner
      >
    >(new Map());

  const createdRootRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    assertValidOverlayId(
      rootId,
      "OverlayProvider rootId"
    );

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

  const registerOverlay = React.useCallback(
    (
      id: OverlayId,
      layer: number,
      owner: OverlayOwner
    ) => {
      assertValidOverlayId(
        id,
        "OverlayProvider"
      );

      const existingOwner =
        overlayOwnersRef.current.get(
          id
        );

      if (
        existingOwner &&
        existingOwner !== owner
      ) {
        throw new Error(
          `Overlay ID "${id}" is already owned by another mounted overlay.`
        );
      }

      overlayOwnersRef.current.set(
        id,
        owner
      );

      setOverlays((current) => {
        const existing =
          current.find(
            (item) =>
              item.id === id
          );

        if (existing) {
          if (
            existing.owner !== owner
          ) {
            throw new Error(
              `Overlay ID "${id}" is already owned by another mounted overlay.`
            );
          }

          if (
            existing.layer === layer
          ) {
            return current;
          }

          /*
           * Cambiar de layer no equivale a remontar. Se conserva order para
           * no alterar la precedencia temporal entre overlays hermanos.
           */
          return current.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    layer,
                  }
                : item
          );
        }

        orderRef.current += 1;

        return [
          ...current,
          {
            id,
            owner,
            layer,
            order:
              orderRef.current,
          },
        ];
      });
    },
    []
  );

  const unregisterOverlay =
    React.useCallback(
      (
        id: OverlayId,
        owner: OverlayOwner
      ) => {
        const activeOwner =
          overlayOwnersRef.current.get(
            id
          );

        /*
         * Un cleanup obsoleto nunca puede liberar el registro adquirido por
         * otra instancia que reutilizó el ID después de un cambio de montaje.
         */
        if (
          activeOwner !== owner
        ) {
          return;
        }

        overlayOwnersRef.current.delete(
          id
        );

        setOverlays(
          (current) => {
            const next =
              current.filter(
                (item) =>
                  !(
                    item.id === id &&
                    item.owner === owner
                  )
              );

            return next.length ===
              current.length
              ? current
              : next;
          }
        );
      },
      []
    );

  const getTopmostId =
    React.useCallback(
      (): OverlayId | null => {
        if (!overlays.length) {
          return null;
        }

        let topmost =
          overlays[0];

        for (
          let index = 1;
          index < overlays.length;
          index += 1
        ) {
          const current =
            overlays[index];

          if (
            compareOverlays(
              topmost,
              current
            ) < 0
          ) {
            topmost = current;
          }
        }

        return topmost?.id ?? null;
      },
      [overlays]
    );

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
  const {
    registerOverlay,
    unregisterOverlay,
  } = useOverlayContext();

  const [owner] =
    React.useState<OverlayOwner>(
      () =>
        Symbol(
          "overlay-owner"
        )
    );

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    assertValidOverlayId(
      id,
      "useOverlayRegistration"
    );

    registerOverlay(
      id,
      layer,
      owner
    );

    return () => {
      unregisterOverlay(
        id,
        owner
      );
    };
  }, [
    enabled,
    id,
    layer,
    owner,
    registerOverlay,
    unregisterOverlay,
  ]);
}

export function useIsOverlayTopmost(id: string): boolean {
  const { isTopmost } = useOverlayContext();
  return isTopmost(id);
}