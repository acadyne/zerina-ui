import {
  type ReactNode,
} from "react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  OverlayProvider,
} from "../../src/core/overlay";

import {
  ActionDialog,
} from "../../src/patterns/ActionDialog";

import {
  ConfirmDialog,
} from "../../src/patterns/ConfirmDialog";

import {
  TargetFormDialog,
} from "../../src/patterns/TargetFormDialog";

import type {
  ModalState,
} from "../../src/patterns/state";

import {
  renderDOM,
} from "./react-dom-test-utils";


type DialogTarget = {
  id:
    string;

  label:
    string;
};


const openState:
  ModalState<DialogTarget> = {
    isOpen:
      true,

    target: {
      id:
        "target-1",

      label:
        "Target One",
    },
  };


/*
 * This fixture is intentionally never rendered.
 *
 * Its purpose is compile-time regression coverage under the workspace
 * `strict` tsconfig: every callback parameter must be contextually typed
 * from the dialog target. If any render prop becomes a ReactNode/function
 * union again, these parameters regress to implicit `any` and typecheck
 * fails.
 */
function ContextualTypingFixture():
  ReactNode {
  return (
    <>
      <ConfirmDialog
        state={openState}
        title="Confirm"
        onConfirm={(
          target,
        ) => {
          void target.id;
        }}
        renderDescription={(
          target,
        ) =>
          target.label
        }
        renderTargetLabel={(
          target,
        ) =>
          target.id
        }
        renderBody={(
          target,
        ) => (
          <span>
            {target.label}
          </span>
        )}
        renderFooter={(
          target,
        ) => (
          <span>
            {target.id}
          </span>
        )}
      />

      <ActionDialog
        state={openState}
        title="Action"
        onAction={(
          target,
        ) => {
          void target.label;
        }}
        renderDescription={(
          target,
        ) =>
          target.id
        }
        renderTargetLabel={(
          target,
        ) =>
          target.label
        }
        renderBody={(
          target,
        ) => (
          <span>
            {target.id}
          </span>
        )}
        renderFooter={(
          target,
        ) => (
          <span>
            {target.label}
          </span>
        )}
      />

      <TargetFormDialog
        state={openState}
        title="Form"
        onSubmit={(
          target,
          event,
        ) => {
          void target.id;
          void event.currentTarget;
        }}
        renderDescription={(
          target,
        ) =>
          target.label
        }
        renderTargetLabel={(
          target,
        ) =>
          target.id
        }
        renderBody={(
          target,
        ) => (
          <span>
            {target.label}
          </span>
        )}
        renderFooter={(
          target,
        ) => (
          <span>
            {target.id}
          </span>
        )}
      />
    </>
  );
}


void ContextualTypingFixture;


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


describe(
  "Phase 4 target-dialog render props",
  () => {
    it(
      "renders every target region through the explicit callback contract",
      () => {
        renderWithOverlay(
          <ConfirmDialog
            state={openState}
            title="Confirm"
            onConfirm={() => {
              // no-op
            }}
            renderDescription={(
              target,
            ) => (
              <span
                data-testid="description"
              >
                {target.label}
              </span>
            )}
            renderTargetLabel={(
              target,
            ) => (
              <span
                data-testid="target-label"
              >
                {target.id}
              </span>
            )}
            renderBody={(
              target,
            ) => (
              <span
                data-testid="body"
              >
                {target.label}
              </span>
            )}
            renderFooter={(
              target,
            ) => (
              <span
                data-testid="footer"
              >
                {target.id}
              </span>
            )}
          />,
        );

        expect(
          document.querySelector(
            '[data-testid="description"]',
          )?.textContent,
        ).toBe(
          "Target One",
        );

        expect(
          document.querySelector(
            '[data-testid="target-label"]',
          )?.textContent,
        ).toBe(
          "target-1",
        );

        expect(
          document.querySelector(
            '[data-testid="body"]',
          )?.textContent,
        ).toBe(
          "Target One",
        );

        expect(
          document.querySelector(
            '[data-testid="footer"]',
          )?.textContent,
        ).toBe(
          "target-1",
        );
      },
    );


    it(
      "does not invoke render callbacks while the target dialog is closed",
      () => {
        let calls =
          0;

        renderWithOverlay(
          <ActionDialog<DialogTarget>
            state={{
              isOpen:
                false,
            }}
            title="Closed"
            onAction={() => {
              // no-op
            }}
            renderBody={() => {
              calls +=
                1;

              return (
                <span>
                  hidden
                </span>
              );
            }}
          />,
        );

        expect(
          calls,
        ).toBe(
          0,
        );
      },
    );
  },
);
