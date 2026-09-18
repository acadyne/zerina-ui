import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MenuRoot,
} from "../../src/primitives/overlay/menu/MenuRoot";

import {
  useMenuContext,
} from "../../src/primitives/overlay/menu/menu.context";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function FocusIntentProbe({
  open,
}: {
  open:
    boolean;
}) {
  const ctx =
    useMenuContext();

  const firstRef =
    useRef<HTMLButtonElement>(
      null,
    );

  const lastRef =
    useRef<HTMLButtonElement>(
      null,
    );

  const scope =
    useMemo(
      () =>
        Symbol(
          "menu-test-scope",
        ),
      [],
    );

  const firstToken =
    useMemo(
      () =>
        Symbol(
          "menu-first",
        ),
      [],
    );

  const lastToken =
    useMemo(
      () =>
        Symbol(
          "menu-last",
        ),
      [],
    );


  useEffect(
    () => {
      const first =
        firstRef.current;

      const last =
        lastRef.current;

      if (
        !open ||
        !first ||
        !last
      ) {
        return;
      }

      ctx.registerItem({
        token:
          firstToken,

        node:
          first,

        disabled:
          false,

        textValue:
          "First",

        collectionScope:
          scope,
      });

      ctx.registerItem({
        token:
          lastToken,

        node:
          last,

        disabled:
          false,

        textValue:
          "Last",

        collectionScope:
          scope,
      });

      return () => {
        ctx.unregisterItem(
          firstToken,
        );

        ctx.unregisterItem(
          lastToken,
        );
      };
    },
    [
      ctx.registerItem,
      ctx.unregisterItem,
      firstToken,
      lastToken,
      open,
      scope,
    ],
  );


  return (
    <>
      <button
        ref={firstRef}
        data-testid="first-item"
        type="button"
      >
        First
      </button>

      <button
        ref={lastRef}
        data-testid="last-item"
        type="button"
      >
        Last
      </button>

      <button
        data-testid="request-last"
        type="button"
        onClick={() => {
          ctx.requestOpen(
            "last",
          );
        }}
      >
        Request last
      </button>

      <button
        data-testid="focus-initial"
        type="button"
        onClick={() => {
          ctx.focusInitial();
        }}
      >
        Focus initial
      </button>
    </>
  );
}


function MenuIntentHarness({
  acceptRequest,
}: {
  acceptRequest:
    boolean;
}) {
  const [
    open,
    setOpen,
  ] =
    useState(false);


  return (
    <>
      <button
        data-testid="programmatic-open"
        type="button"
        onClick={() => {
          setOpen(
            true,
          );
        }}
      >
        Programmatic open
      </button>

      <MenuRoot
        open={open}
        initialFocusIndex={
          0
        }
        onOpenChange={(
          nextOpen,
        ) => {
          if (
            !nextOpen
          ) {
            setOpen(
              false,
            );

            return;
          }

          if (
            acceptRequest
          ) {
            setOpen(
              true,
            );
          }
        }}
      >
        <FocusIntentProbe
          open={open}
        />
      </MenuRoot>
    </>
  );
}


describe(
  "Menu open-intent epoch",
  () => {
    it(
      "invalidates a focus intent when a controlled open request is rejected",
      () => {
        const container =
          renderDOM(
            <MenuIntentHarness
              acceptRequest={
                false
              }
            />,
          );

        clickElement(
          getByTestId(
            container,
            "request-last",
          ),
        );

        clickElement(
          getByTestId(
            container,
            "programmatic-open",
          ),
        );

        clickElement(
          getByTestId(
            container,
            "focus-initial",
          ),
        );

        expect(
          document.activeElement,
        ).toBe(
          getByTestId(
            container,
            "first-item",
          ),
        );
      },
    );


    it(
      "preserves the focus intent when the controlled open request is accepted",
      () => {
        const container =
          renderDOM(
            <MenuIntentHarness
              acceptRequest
            />,
          );

        clickElement(
          getByTestId(
            container,
            "request-last",
          ),
        );

        clickElement(
          getByTestId(
            container,
            "focus-initial",
          ),
        );

        expect(
          document.activeElement,
        ).toBe(
          getByTestId(
            container,
            "last-item",
          ),
        );
      },
    );
  },
);
