import React from "react";
import {
  acquireOverlayRoot,
  releaseOverlayRoot,
  type OverlayProviderToken,
} from "./OverlayDocumentRegistry";

type OverlayContextValue = {
  portalRoot: HTMLElement | null;
  ownerDocument: Document | null;
  providerToken: OverlayProviderToken;
};

const OverlayContext = React.createContext<OverlayContextValue | null>(null);

const DEFAULT_ROOT_ID = "ui-overlay-root";

function getDefaultDocument(): Document | null {
  return typeof document === "undefined"
    ? null
    : document;
}

export interface OverlayProviderProps {
  children: React.ReactNode;
  rootId?: string;

  /**
   * Documento propietario del portal root por defecto. Es necesario cuando
   * el provider no pertenece al mismo Document que el módulo que lo ejecuta,
   * porque un provider no produce por sí mismo ningún nodo del que inferirlo.
   */
  ownerDocument?: Document | null;
}

export const OverlayProvider: React.FC<OverlayProviderProps> = ({
  children,
  rootId = DEFAULT_ROOT_ID,
  ownerDocument: ownerDocumentProp,
}) => {
  const [providerToken] = React.useState<OverlayProviderToken>(() =>
    Symbol("overlay-provider")
  );

  const [environment, setEnvironment] = React.useState<{
    portalRoot: HTMLElement | null;
    ownerDocument: Document | null;
  }>({
    portalRoot: null,
    ownerDocument: ownerDocumentProp ?? null,
  });

  React.useEffect(() => {
    const ownerDocument = ownerDocumentProp ?? getDefaultDocument();

    if (!ownerDocument) {
      setEnvironment({
        portalRoot: null,
        ownerDocument: null,
      });

      return;
    }

    const portalRoot = acquireOverlayRoot(
      ownerDocument,
      rootId,
      providerToken
    );

    setEnvironment({
      portalRoot,
      ownerDocument,
    });

    return () => {
      releaseOverlayRoot(ownerDocument, rootId, providerToken);
    };
  }, [ownerDocumentProp, providerToken, rootId]);

  const value = React.useMemo<OverlayContextValue>(
    () => ({
      portalRoot: environment.portalRoot,
      ownerDocument: environment.ownerDocument,
      providerToken,
    }),
    [environment.ownerDocument, environment.portalRoot, providerToken]
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
};

export function useOverlayContext(): OverlayContextValue {
  const context = React.useContext(OverlayContext);

  if (!context) {
    throw new Error("useOverlayContext must be used inside <OverlayProvider />");
  }

  return context;
}
