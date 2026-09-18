import {
  act,
  type ReactNode,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  OverlayProvider,
} from "../../src/core/overlay";

import {
  FormDialog,
} from "../../src/patterns/FormDialog";

import {
  TargetFormDialog,
} from "../../src/patterns/TargetFormDialog";

import type {
  ModalState,
} from "../../src/patterns/state";

import {
  clickElement,
  renderDOM,
} from "./react-dom-test-utils";


function renderWithOverlay(
  node:
    ReactNode,
): void {
  renderDOM(
    <OverlayProvider
      ownerDocument={
        document
      }
    >
      {node}
    </OverlayProvider>,
  );
}


function getButtonByText(
  text:
    string,
): HTMLButtonElement {
  const button =
    Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        "button",
      ),
    ).find(
      (
        candidate,
      ) =>
        candidate.textContent ===
        text,
    );

  if (!button) {
    throw new Error(
      `Button "${text}" was not found.`,
    );
  }

  return button;
}


function getForm():
  HTMLFormElement {
  const form =
    document.querySelector<HTMLFormElement>(
      "form",
    );

  if (!form) {
    throw new Error(
      "Dialog form was not found.",
    );
  }

  return form;
}


describe(
  "FormDialog / TargetFormDialog phase A contracts",
  () => {
    it.each([
      [
        "zero",
        0,
      ],
      [
        "empty string",
        "",
      ],
      [
        "false",
        false,
      ],
    ])(
      "treats %s as a valid target for renderables and submit",
      (
        _label,
        target,
      ) => {
        const onSubmit =
          vi.fn();

        const state:
          ModalState<
            | number
            | string
            | boolean
          > = {
            isOpen:
              true,

            target,
          };


        renderWithOverlay(
          <TargetFormDialog
            state={state}
            title="Editar"
            targetLabel={(
              current,
            ) => (
              <span
                data-testid="target-label"
              >
                {`target:${String(current)}`}
              </span>
            )}
            onSubmit={
              onSubmit
            }
          >
            {(
              current,
            ) => (
              <span
                data-testid="target-body"
              >
                {`body:${String(current)}`}
              </span>
            )}
          </TargetFormDialog>,
        );


        expect(
          document.querySelector(
            '[data-testid="target-label"]',
          )?.textContent,
        ).toBe(
          `target:${String(target)}`,
        );

        expect(
          document.querySelector(
            '[data-testid="target-body"]',
          )?.textContent,
        ).toBe(
          `body:${String(target)}`,
        );


        const submit =
          getButtonByText(
            "Guardar",
          );

        expect(
          submit.disabled,
        ).toBe(
          false,
        );


        act(
          () => {
            getForm().dispatchEvent(
              new Event(
                "submit",
                {
                  bubbles:
                    true,

                  cancelable:
                    true,
                },
              ),
            );
          },
        );


        expect(
          onSubmit,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onSubmit.mock
            .calls[0]?.[0],
        ).toBe(
          target,
        );
      },
    );


    it(
      "cancels and requests close exactly once from the Cancel button",
      () => {
        const onCancel =
          vi.fn();

        const onOpenChange =
          vi.fn();


        renderWithOverlay(
          <TargetFormDialog
            state={{
              isOpen:
                true,

              target:
                0,
            }}
            title="Editar"
            onSubmit={() => {
              // no-op
            }}
            onCancel={
              onCancel
            }
            onOpenChange={
              onOpenChange
            }
          />,
        );


        clickElement(
          getButtonByText(
            "Cancelar",
          ),
        );


        expect(
          onCancel,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onCancel,
        ).toHaveBeenCalledWith(
          0,
        );

        expect(
          onOpenChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onOpenChange,
        ).toHaveBeenCalledWith(
          false,
        );
      },
    );


    it(
      "cancels and requests close exactly once from Dialog dismiss",
      () => {
        const onCancel =
          vi.fn();

        const onOpenChange =
          vi.fn();


        renderWithOverlay(
          <TargetFormDialog
            state={{
              isOpen:
                true,

              target:
                0,
            }}
            title="Editar"
            onSubmit={() => {
              // no-op
            }}
            onCancel={
              onCancel
            }
            onOpenChange={
              onOpenChange
            }
          />,
        );


        act(
          () => {
            document.dispatchEvent(
              new KeyboardEvent(
                "keydown",
                {
                  key:
                    "Escape",

                  bubbles:
                    true,

                  cancelable:
                    true,
                },
              ),
            );
          },
        );


        expect(
          onCancel,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onCancel,
        ).toHaveBeenCalledWith(
          0,
        );

        expect(
          onOpenChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onOpenChange,
        ).toHaveBeenCalledWith(
          false,
        );
      },
    );


    it(
      "renders numeric ReactNode content instead of dropping it by truthiness",
      () => {
        renderWithOverlay(
          <FormDialog
            open
            title="Valores"
            description={
              0
            }
            targetLabel={
              0
            }
            error={
              0
            }
            footer={
              0
            }
          />,
        );


        const alert =
          document.querySelector(
            '[role="alert"]',
          );

        expect(
          alert?.textContent,
        ).toBe(
          "0",
        );


        const description =
          document.querySelector(
            "p",
          );

        expect(
          description?.textContent,
        ).toBe(
          "00",
        );


        expect(
          document.querySelectorAll(
            "button",
          ),
        ).toHaveLength(
          0,
        );
      },
    );


    it(
      "does not materialize textual dialog regions for empty strings",
      () => {
        renderWithOverlay(
          <FormDialog
            open
            title="Vacío"
            description=""
            targetLabel=""
            error=""
          />,
        );


        expect(
          document.querySelector(
            '[role="alert"]',
          ),
        ).toBeNull();

        expect(
          document.querySelector(
            "p",
          ),
        ).toBeNull();
      },
    );
  },
);
