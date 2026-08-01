// src/core/interaction/focus/useFocusVisible.ts

import React from "react";


type InputModality =
  | "keyboard"
  | "pointer";


interface DocumentInputModalityTracker {
  modality: InputModality;
  references: number;
  dispose: () => void;
}


/*
 * Comparte un único tracker de modalidad por Document.
 * El contador retira los listeners cuando desaparece el último consumidor.
 */
const documentTrackers =
  new WeakMap<
    Document,
    DocumentInputModalityTracker
  >();


function createDocumentTracker(
  ownerDocument: Document
): DocumentInputModalityTracker {
  const tracker:
    DocumentInputModalityTracker = {
      modality:
        "keyboard",

      references:
        0,

      dispose:
        () => undefined,
    };

  const handleKeyDown = (
    event: KeyboardEvent
  ): void => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.isComposing
    ) {
      return;
    }

    tracker.modality =
      "keyboard";
  };

  const handlePointerActivity =
    (): void => {
      tracker.modality =
        "pointer";
    };

  ownerDocument.addEventListener(
    "keydown",
    handleKeyDown,
    true
  );

  ownerDocument.addEventListener(
    "pointerdown",
    handlePointerActivity,
    true
  );

  ownerDocument.addEventListener(
    "pointerover",
    handlePointerActivity,
    true
  );

  tracker.dispose = () => {
    ownerDocument.removeEventListener(
      "keydown",
      handleKeyDown,
      true
    );

    ownerDocument.removeEventListener(
      "pointerdown",
      handlePointerActivity,
      true
    );

    ownerDocument.removeEventListener(
      "pointerover",
      handlePointerActivity,
      true
    );
  };

  return tracker;
}


function getDocumentTracker(
  ownerDocument: Document
): DocumentInputModalityTracker {
  const existing =
    documentTrackers.get(
      ownerDocument
    );

  if (existing) {
    return existing;
  }

  const tracker =
    createDocumentTracker(
      ownerDocument
    );

  documentTrackers.set(
    ownerDocument,
    tracker
  );

  return tracker;
}


function retainDocumentTracker(
  ownerDocument: Document
): {
  tracker: DocumentInputModalityTracker;
  release: () => void;
} {
  const tracker =
    getDocumentTracker(
      ownerDocument
    );

  tracker.references += 1;

  let released = false;

  return {
    tracker,
    release: () => {
      if (released) {
        return;
      }

      released = true;
      tracker.references -= 1;

      if (
        tracker.references > 0
      ) {
        return;
      }

      tracker.dispose();

      documentTrackers.delete(
        ownerDocument
      );
    },
  };
}


export interface UseFocusVisibleOptions<
  TElement extends HTMLElement,
> {
  disabled?: boolean;

  onFocus?:
    React.FocusEventHandler<TElement>;

  onBlur?:
    React.FocusEventHandler<TElement>;
}


export interface UseFocusVisibleResult<
  TElement extends HTMLElement,
> {
  focused: boolean;
  focusVisible: boolean;

  focusProps: Pick<
    React.HTMLAttributes<TElement>,
    "onFocus" | "onBlur"
  >;
}


export function useFocusVisible<
  TElement extends HTMLElement,
>({
  disabled = false,
  onFocus,
  onBlur,
}: UseFocusVisibleOptions<TElement> = {}): UseFocusVisibleResult<TElement> {
  const [
    focused,
    setFocused,
  ] = React.useState(
    false
  );

  const [
    focusVisible,
    setFocusVisible,
  ] = React.useState(
    false
  );

  const retainedTrackerRef = React.useRef<{
    ownerDocument: Document;
    tracker: DocumentInputModalityTracker;
    release: () => void;
  } | null>(null);

  const retainTrackerForDocument = React.useCallback(
    (ownerDocument: Document) => {
      const retained = retainedTrackerRef.current;

      if (retained?.ownerDocument === ownerDocument) {
        return {
          tracker: retained.tracker,
          created: false,
        };
      }

      retained?.release();

      const created = !documentTrackers.has(ownerDocument);
      const next = retainDocumentTracker(ownerDocument);

      retainedTrackerRef.current = {
        ownerDocument,
        tracker: next.tracker,
        release: next.release,
      };

      return {
        tracker: next.tracker,
        created,
      };
    },
    []
  );

  React.useEffect(() => {
    return () => {
      retainedTrackerRef.current?.release();
      retainedTrackerRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!disabled) {
      return;
    }

    retainedTrackerRef.current?.release();
    retainedTrackerRef.current = null;

    setFocused(
      false
    );

    setFocusVisible(
      false
    );
  }, [disabled]);

  const handleFocus =
    React.useCallback(
      (
        event:
          React.FocusEvent<TElement>
      ) => {
        onFocus?.(
          event
        );

        if (
          event.defaultPrevented ||
          disabled
        ) {
          return;
        }

        const {
          tracker,
          created,
        } = retainTrackerForDocument(
          event.currentTarget.ownerDocument
        );

        if (created) {
          try {
            tracker.modality = event.currentTarget.matches(":focus-visible")
              ? "keyboard"
              : "pointer";
          } catch {
            // El estado inicial keyboard es el fallback conservador.
          }
        }

        setFocused(
          true
        );

        setFocusVisible(
          tracker.modality ===
            "keyboard"
        );
      },
      [
        disabled,
        onFocus,
        retainTrackerForDocument,
      ]
    );

  const handleBlur =
    React.useCallback(
      (
        event:
          React.FocusEvent<TElement>
      ) => {
        onBlur?.(
          event
        );

        setFocused(
          false
        );

        setFocusVisible(
          false
        );
      },
      [onBlur]
    );

  return {
    focused,
    focusVisible,

    focusProps: {
      onFocus:
        handleFocus,

      onBlur:
        handleBlur,
    },
  };
}
