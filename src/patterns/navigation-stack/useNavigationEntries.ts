import React from "react";

import type {
  NavigationStackEntry,
  NavigationStackParams,
  NavigationStackTransitionDirection,
} from "./navigationStack.types";


export interface UseNavigationEntriesOptions {
  initialName:
    | string
    | null;

  initialParams?:
    NavigationStackParams;

  entries?:
    NavigationStackEntry[];

  transitionDirection?:
    NavigationStackTransitionDirection;

  onEntriesChange?: (
    entries:
      NavigationStackEntry[],

    transitionDirection:
      NavigationStackTransitionDirection,
  ) => void;
}


/**
 * Owner único del historial compartido por NavigationStack y TabScaffold.
 *
 * Conoce únicamente:
 *
 * - IDs de entries;
 * - controlled/uncontrolled;
 * - fallback/empty normalization;
 * - transition direction;
 * - mutaciones del historial.
 *
 * No conoce screens, tabs, layout ni políticas de selección de tab.
 */
export function useNavigationEntries({
  initialName,
  initialParams,

  entries:
    controlledEntries,

  transitionDirection:
    controlledTransitionDirection,

  onEntriesChange,
}: UseNavigationEntriesOptions) {
  const entryId =
    React.useId()
      .replace(
        /:/g,
        "",
      );


  const entrySequenceRef =
    React.useRef(
      1,
    );


  const createEntry =
    React.useCallback(
      (
        name:
          string,

        params?:
          NavigationStackParams,
      ): NavigationStackEntry => {
        const key =
          `${entryId}-${entrySequenceRef.current}`;

        entrySequenceRef.current +=
          1;


        return {
          key,
          name,
          params,
        };
      },
      [
        entryId,
      ],
    );


  const fallbackEntry =
    React.useMemo<
      NavigationStackEntry | null
    >(
      () =>
        initialName !==
        null
          ? {
              key:
                `${entryId}-fallback`,

              name:
                initialName,

              params:
                initialParams,
            }
          : null,
      [
        entryId,
        initialName,
        initialParams,
      ],
    );


  const isControlled =
    controlledEntries !==
    undefined;


  const [
    internalEntries,
    setInternalEntries,
  ] =
    React.useState<
      NavigationStackEntry[]
    >(
      () =>
        fallbackEntry
          ? [
              fallbackEntry,
            ]
          : [],
    );


  const [
    internalTransitionDirection,
    setInternalTransitionDirection,
  ] =
    React.useState<
      NavigationStackTransitionDirection
    >(
      "replace",
    );


  const providedEntries =
    controlledEntries !==
    undefined
      ? controlledEntries
      : internalEntries;


  const entries =
    providedEntries.length >
    0
      ? providedEntries
      : fallbackEntry
        ? [
            fallbackEntry,
          ]
        : [];


  const transitionDirection:
    NavigationStackTransitionDirection =
    controlledEntries !==
    undefined
      ? controlledTransitionDirection ??
        "replace"
      : internalTransitionDirection;


  const normalizeEntries =
    React.useCallback(
      (
        nextEntries:
          NavigationStackEntry[],
      ):
        NavigationStackEntry[] => {
        if (
          nextEntries.length >
          0
        ) {
          return nextEntries;
        }


        if (
          initialName ===
          null
        ) {
          return [];
        }


        return [
          createEntry(
            initialName,
            initialParams,
          ),
        ];
      },
      [
        createEntry,
        initialName,
        initialParams,
      ],
    );


  const setEntries =
    React.useCallback(
      (
        nextEntries:
          NavigationStackEntry[],

        nextTransitionDirection:
          NavigationStackTransitionDirection,
      ) => {
        const normalizedEntries =
          normalizeEntries(
            nextEntries,
          );


        if (
          !isControlled
        ) {
          setInternalEntries(
            normalizedEntries,
          );

          setInternalTransitionDirection(
            nextTransitionDirection,
          );
        }


        onEntriesChange?.(
          normalizedEntries,
          nextTransitionDirection,
        );
      },
      [
        isControlled,
        normalizeEntries,
        onEntriesChange,
      ],
    );


  const updateEntries =
    React.useCallback(
      (
        updater:
          | NavigationStackEntry[]
          | ((
              currentEntries:
                NavigationStackEntry[],
            ) =>
              NavigationStackEntry[]),

        nextTransitionDirection:
          NavigationStackTransitionDirection,
      ) => {
        const nextEntries =
          typeof updater ===
          "function"
            ? updater(
                entries,
              )
            : updater;


        setEntries(
          nextEntries,
          nextTransitionDirection,
        );
      },
      [
        entries,
        setEntries,
      ],
    );


  const currentIndex =
    Math.max(
      0,
      entries.length - 1,
    );


  const current =
    entries[
      currentIndex
    ] ??
    null;


  const canGoBack =
    entries.length >
    1;


  const push =
    React.useCallback(
      (
        name:
          string,

        params?:
          NavigationStackParams,
      ) => {
        updateEntries(
          (
            currentEntries,
          ) => [
            ...currentEntries,

            createEntry(
              name,
              params,
            ),
          ],
          "forward",
        );
      },
      [
        createEntry,
        updateEntries,
      ],
    );


  const replace =
    React.useCallback(
      (
        name:
          string,

        params?:
          NavigationStackParams,
      ) => {
        updateEntries(
          (
            currentEntries,
          ) => [
            ...currentEntries.slice(
              0,
              -1,
            ),

            createEntry(
              name,
              params,
            ),
          ],
          "replace",
        );
      },
      [
        createEntry,
        updateEntries,
      ],
    );


  const pop =
    React.useCallback(
      () => {
        if (
          entries.length <=
          1
        ) {
          return;
        }


        updateEntries(
          entries.slice(
            0,
            -1,
          ),
          "back",
        );
      },
      [
        entries,
        updateEntries,
      ],
    );


  const popToRoot =
    React.useCallback(
      () => {
        if (
          entries.length <=
          1
        ) {
          return;
        }


        const rootEntry =
          entries[
            0
          ];


        if (
          !rootEntry
        ) {
          return;
        }


        updateEntries(
          [
            rootEntry,
          ],
          "back",
        );
      },
      [
        entries,
        updateEntries,
      ],
    );


  const reset =
    React.useCallback(
      (
        name:
          string,

        params?:
          NavigationStackParams,
      ) => {
        updateEntries(
          [
            createEntry(
              name,
              params,
            ),
          ],
          "replace",
        );
      },
      [
        createEntry,
        updateEntries,
      ],
    );


  return {
    entries,
    transitionDirection,

    current,
    currentIndex,
    canGoBack,

    createEntry,
    setEntries,
    updateEntries,

    push,
    replace,
    pop,
    popToRoot,
    reset,
  } as const;
}
