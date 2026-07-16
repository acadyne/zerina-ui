// src/core/overlay/FocusScope.tsx
import React from "react";
import { useIsOverlayTopmost } from "./OverlayProvider";
import { setRef } from "../interaction/events";

function isElementVisible(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);

  if (style.display === "none") return false;
  if (style.visibility === "hidden") return false;
  if (el.hasAttribute("hidden")) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;

  if (style.position === "fixed") return true;
  return el.offsetParent !== null;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => {
      if (el.hasAttribute("disabled")) return false;
      if (el.getAttribute("aria-hidden") === "true") return false;
      if (!isElementVisible(el)) return false;
      return true;
    }
  );
}

function getBestInitialFocusTarget(
  focusable: HTMLElement[],
  fallback: HTMLElement
): HTMLElement {
  return (
    focusable.find((el) => el.tagName === "INPUT") ||
    focusable.find((el) => el.tagName === "TEXTAREA") ||
    focusable.find((el) => el.tagName === "SELECT") ||
    focusable.find((el) => el.tagName === "BUTTON") ||
    focusable[0] ||
    fallback
  );
}



export interface FocusScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  overlayId: string;
  enabled?: boolean;

  contain?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;

  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export const FocusScope = React.forwardRef<HTMLDivElement, FocusScopeProps>(
  (
    {
      children,
      overlayId,
      enabled = true,
      contain = true,
      autoFocus = true,
      restoreFocus = true,
      initialFocusRef,
      ...rest
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const lastActiveRef = React.useRef<HTMLElement | null>(null);
    const hasAutoFocusedRef = React.useRef(false);
    const isTopmost = useIsOverlayTopmost(overlayId);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        setRef(ref, node);
      },
      [ref]
    );

    React.useLayoutEffect(() => {
      if (!enabled) return;

      lastActiveRef.current = document.activeElement as HTMLElement | null;
      hasAutoFocusedRef.current = false;
    }, [enabled]);

    React.useEffect(() => {
      if (!enabled) return;
      if (!autoFocus) return;
      if (!isTopmost) return;
      if (hasAutoFocusedRef.current) return;

      const id = window.requestAnimationFrame(() => {
        const container = localRef.current;
        if (!container) return;

        const explicitTarget = initialFocusRef?.current;
        if (explicitTarget && container.contains(explicitTarget)) {
          explicitTarget.focus();
          hasAutoFocusedRef.current = true;
          return;
        }

        const focusable = getFocusableElements(container);
        const target = getBestInitialFocusTarget(focusable, container);

        target.focus();
        hasAutoFocusedRef.current = true;
      });

      return () => {
        window.cancelAnimationFrame(id);
      };
    }, [enabled, autoFocus, isTopmost, initialFocusRef]);

    React.useEffect(() => {
      if (!enabled) return;
      if (!contain) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isTopmost) return;
        if (event.key !== "Tab") return;

        const container = localRef.current;
        if (!container) return;

        const focusable = getFocusableElements(container);

        if (!focusable.length) {
          event.preventDefault();
          container.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const activeInside = !!active && container.contains(active);

        if (!activeInside) {
          event.preventDefault();
          first.focus();
          return;
        }

        if (event.shiftKey) {
          if (active === first) {
            event.preventDefault();
            last.focus();
          }
          return;
        }

        if (active === last) {
          event.preventDefault();
          first.focus();
        }
      };

      const handleFocusIn = (event: FocusEvent) => {
        if (!isTopmost) return;

        const container = localRef.current;
        if (!container) return;

        const target = event.target as Node | null;
        if (target && container.contains(target)) return;

        const focusable = getFocusableElements(container);
        const nextTarget = getBestInitialFocusTarget(focusable, container);
        nextTarget.focus();
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("focusin", handleFocusIn);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("focusin", handleFocusIn);
      };
    }, [enabled, contain, isTopmost]);

    React.useEffect(() => {
      return () => {
        if (!enabled) return;
        if (!restoreFocus) return;

        const target = lastActiveRef.current;
        if (!target || typeof target.focus !== "function") return;

        requestAnimationFrame(() => {
          target.focus();
        });
      };
    }, [enabled, restoreFocus]);

    return (
      <div ref={setRefs} tabIndex={-1} {...rest}>
        {children}
      </div>
    );
  }
);

FocusScope.displayName = "FocusScope";