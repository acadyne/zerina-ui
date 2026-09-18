import type {
  ReactNode,
} from "react";


/**
 * Indica si un ReactNode representa una rama que debe materializar
 * estructura de interfaz.
 *
 * React ignora null, undefined y booleanos durante el render. El número 0
 * sí es contenido válido y debe conservarse.
 *
 * El string vacío se considera presente aquí para conservar el contrato
 * general de los componentes existentes. Los consumidores que necesiten
 * contenido textual no vacío deben usar hasNonEmptyRenderableNode.
 */
export function hasRenderableNode(
  node: ReactNode,
): boolean {
  return (
    node !== null &&
    node !== undefined &&
    typeof node !== "boolean"
  );
}


/**
 * Variante para contratos donde una cadena vacía tampoco debe generar
 * estructura ni asociaciones semánticas.
 */
export function hasNonEmptyRenderableNode(
  node: ReactNode,
): boolean {
  return (
    hasRenderableNode(node) &&
    node !== ""
  );
}
