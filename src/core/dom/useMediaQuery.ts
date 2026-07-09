// src/core/dom/useMediaQuery.ts
import React from "react";

export interface UseMediaQueryOptions {
  /**
   * true:
   *   Lee matchMedia durante el primer render del cliente.
   *
   * false:
   *   Usa defaultMatches en el primer render y actualiza después del mount.
   *   Útil para SSR.
   */
  initializeWithValue?: boolean;
}

function getMatches(query: string, defaultMatches: boolean): boolean {
  if (typeof window === "undefined") {
    return defaultMatches;
  }

  if (typeof window.matchMedia !== "function") {
    return defaultMatches;
  }

  return window.matchMedia(query).matches;
}

export function useMediaQuery(
  query: string,
  defaultMatches = false,
  options: UseMediaQueryOptions = {}
): boolean {
  const { initializeWithValue = true } = options;

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (!initializeWithValue) {
      return defaultMatches;
    }

    return getMatches(query, defaultMatches);
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const mediaQueryList = window.matchMedia(query);

    const update = () => {
      setMatches(mediaQueryList.matches);
    };

    update();

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", update);

      return () => {
        mediaQueryList.removeEventListener("change", update);
      };
    }

    mediaQueryList.addListener(update);

    return () => {
      mediaQueryList.removeListener(update);
    };
  }, [query]);

  return matches;
}

export function getMediaQueryMatchesForClientOnly(
  query: string,
  defaultMatches = false
): boolean {
  return getMatches(query, defaultMatches);
}