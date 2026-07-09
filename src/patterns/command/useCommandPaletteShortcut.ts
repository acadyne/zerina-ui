// src/patterns/command/useCommandPaletteShortcut.ts
import React from "react";

export interface UseCommandPaletteShortcutOptions {
  enabled?: boolean;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  key?: string;

  /**
   * Permite ⌘ + key en macOS.
   */
  metaKey?: boolean;

  /**
   * Permite Ctrl + key en Windows/Linux.
   */
  ctrlKey?: boolean;

  /**
   * Evita abrir el palette cuando el foco está dentro de inputs,
   * textareas, selects o elementos contentEditable.
   */
  ignoreEditableTargets?: boolean;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  const tagName = target.tagName.toLowerCase();

  return tagName === "input" || tagName === "textarea" || tagName === "select";
}

export function useCommandPaletteShortcut({
  enabled = true,
  open,
  onOpenChange,
  key = "k",
  metaKey = true,
  ctrlKey = true,
  ignoreEditableTargets = true,
}: UseCommandPaletteShortcutOptions) {
  React.useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      const normalizedKey = event.key.toLowerCase();
      const expectedKey = key.toLowerCase();

      if (normalizedKey !== expectedKey) return;

      const modifierMatches =
        (metaKey && event.metaKey) || (ctrlKey && event.ctrlKey);

      if (!modifierMatches) return;

      if (ignoreEditableTargets && isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();

      onOpenChange?.(!(open ?? false));
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    enabled,
    open,
    onOpenChange,
    key,
    metaKey,
    ctrlKey,
    ignoreEditableTargets,
  ]);
}