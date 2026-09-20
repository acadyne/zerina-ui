// @vitest-environment node

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  ActionDialogProps,
  ConfirmDialogProps,
  ModalState,
  TargetDialogRender,
  TargetDialogRenderProps,
  TargetFormDialogProps,
} from "zerina-ui";


type Target = {
  id:
    string;
};


const state:
  ModalState<Target> = {
    isOpen:
      true,

    target: {
      id:
        "target-1",
    },
  };


describe(
  "Phase 4 public target-dialog contracts",
  () => {
    it(
      "exposes one callback-only render contract and rejects retired ambiguous slots",
      () => {
        const render:
          TargetDialogRender<Target> =
          (target) =>
            target.id;

        const shared:
          TargetDialogRenderProps<Target> = {
            renderDescription:
              render,

            renderTargetLabel:
              render,

            renderBody:
              render,

            renderFooter:
              render,
          };

        const confirm:
          ConfirmDialogProps<Target> = {
            state,
            title:
              "Confirm",

            onConfirm: () => {
              // no-op
            },

            ...shared,
          };

        const action:
          ActionDialogProps<Target> = {
            state,
            title:
              "Action",

            onAction: () => {
              // no-op
            },

            ...shared,
          };

        const form:
          TargetFormDialogProps<Target> = {
            state,
            title:
              "Form",

            onSubmit: () => {
              // no-op
            },

            ...shared,
          };

        const retiredDescription:
          ConfirmDialogProps<Target> = {
            state,
            title:
              "Legacy",

            onConfirm: () => {
              // no-op
            },

            // @ts-expect-error description was replaced by renderDescription.
            description:
              "legacy",
          };

        const retiredTargetLabel:
          ActionDialogProps<Target> = {
            state,
            title:
              "Legacy",

            onAction: () => {
              // no-op
            },

            // @ts-expect-error targetLabel was replaced by renderTargetLabel.
            targetLabel:
              "legacy",
          };

        const retiredBody:
          TargetFormDialogProps<Target> = {
            state,
            title:
              "Legacy",

            onSubmit: () => {
              // no-op
            },

            // @ts-expect-error children was replaced by renderBody.
            children:
              "legacy",
          };

        const retiredFooter:
          ConfirmDialogProps<Target> = {
            state,
            title:
              "Legacy",

            onConfirm: () => {
              // no-op
            },

            // @ts-expect-error footer was replaced by renderFooter.
            footer:
              "legacy",
          };

        expect(
          confirm.renderBody?.(
            state.isOpen
              ? state.target
              : {
                  id:
                    "never",
                },
          ),
        ).toBe(
          "target-1",
        );

        expect(
          action.renderDescription
        ).toBe(
          render
        );

        expect(
          form.renderFooter
        ).toBe(
          render
        );

        void retiredDescription;
        void retiredTargetLabel;
        void retiredBody;
        void retiredFooter;
      },
    );
  },
);
