import {
  createContext,
} from "react";

import type {
  FieldState,
} from "./field-semantics";


/**
 * Propaga exclusivamente estados semánticos restrictivos.
 *
 * La composición visual de InputGroup permanece separada:
 * padding, radios, indicadores y variantes no forman parte
 * de este contexto.
 */
export const InputGroupContext =
  createContext<
    FieldState | null
  >(null);
