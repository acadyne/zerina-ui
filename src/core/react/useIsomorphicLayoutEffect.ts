import * as React from "react";

/**
 * Ejecuta efectos de ownership en la fase de commit del navegador.
 *
 * Mutar generaciones durante render no es seguro: React puede descartar
 * esa renderización y dejar invalidado trabajo perteneciente al último commit.
 */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
