import {
  getDeepActiveElement,
  getNodeEventRoot,
  isComposedDescendantOf,
} from "../../dom";

/**
 * Intenta mover el foco y confirma el resultado en el árbol compuesto.
 *
 * focus() no garantiza que el navegador acepte el target. La verificación
 * posterior distingue un intento imperativo de un foco realmente observado,
 * incluyendo hosts que delegan el foco hacia su shadow tree.
 *
 * La operación usa exclusivamente el Document y el Window propietarios del
 * target. No consulta objetos ni constructores globales y no cruza iframes al
 * resolver el active element profundo.
 */
export function attemptFocus(
  target: HTMLElement,
  options?: FocusOptions
): boolean {
  if (!target.isConnected) {
    return false;
  }

  const ownerDocument =
    target.ownerDocument;

  const ownerWindow =
    ownerDocument.defaultView;

  /*
   * HTMLElement debe validarse contra el realm propietario. Los elementos de
   * iframes no son instancias del constructor de la ventana principal.
   */
  if (
    !ownerWindow ||
    !(
      target instanceof
        ownerWindow.HTMLElement
    )
  ) {
    return false;
  }

  try {
    /*
     * No se sintetizan opciones: omitir el argumento conserva exactamente la
     * semántica previa de target.focus().
     */
    if (options) {
      target.focus(options);
    } else {
      target.focus();
    }
  } catch {
    return false;
  }

  /*
   * Un handler síncrono de focus puede desconectar o trasladar el nodo. El root
   * solo se obtiene después de confirmar nuevamente conexión y pertenencia.
   */
  if (
    !target.isConnected ||
    target.ownerDocument !==
      ownerDocument
  ) {
    return false;
  }

  const root =
    getNodeEventRoot(target);

  const active =
    getDeepActiveElement(root);

  return !!(
    active &&
    isComposedDescendantOf(
      active,
      target
    )
  );
}
