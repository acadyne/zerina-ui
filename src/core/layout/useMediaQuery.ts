// src/core/layout/useMediaQuery.ts
import React from "react";

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
  defaultMatches = false
): boolean {
  const [matches, setMatches] = React.useState<boolean>(() =>
    getMatches(query, defaultMatches)
  );

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