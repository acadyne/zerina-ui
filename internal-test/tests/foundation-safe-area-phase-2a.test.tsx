import {
  describe,
  expect,
  it,
} from "vitest";

import {
  SafeArea,
  Screen,
  ScreenContent,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";

describe(
  "Phase 2A safe-area behavior",
  () => {
    it(
      "uses the normalized safe-area variables through SafeArea",
      () => {
        const container =
          renderDOM(
            <SafeArea
              data-testid="safe-area"
              edges={{
                top: true,
                bottom: true,
              }}
            />
          );

        const safeArea =
          getByTestId<HTMLElement>(
            container,
            "safe-area"
          );

        expect(
          safeArea.style.paddingTop
        ).toBe(
          "var(--ui-safe-top-offset)"
        );

        expect(
          safeArea.style.paddingBottom
        ).toBe(
          "var(--ui-safe-bottom-offset)"
        );

        expect(
          safeArea.style.paddingLeft
        ).toBe(
          ""
        );
      }
    );

    it(
      "adds Screen insets and safe-area instead of one overriding the other",
      () => {
        const container =
          renderDOM(
            <Screen
              data-testid="screen"
              topInset={8}
              bottomInset="12px"
              safeArea={{
                top: true,
                bottom: true,
              }}
            />
          );

        const screen =
          getByTestId<HTMLElement>(
            container,
            "screen"
          );

        expect(
          screen.style.paddingTop
        ).toBe(
          "calc(8px + var(--ui-safe-top-offset))"
        );

        expect(
          screen.style.paddingBottom
        ).toBe(
          "calc(12px + var(--ui-safe-bottom-offset))"
        );
      }
    );

    it(
      "uses the same safe-area offsets in ScreenContent",
      () => {
        const container =
          renderDOM(
            <ScreenContent
              data-testid="content"
              padding={16}
              safeArea={{
                top: true,
                right: true,
              }}
            />
          );

        const content =
          getByTestId<HTMLElement>(
            container,
            "content"
          );

        expect(
          content.style.paddingTop
        ).toBe(
          "calc(16px + var(--ui-safe-top-offset))"
        );

        expect(
          content.style.paddingRight
        ).toBe(
          "calc(16px + var(--ui-safe-right-offset))"
        );

        expect(
          content.style.paddingBottom
        ).toBe(
          "16px"
        );
      }
    );
  }
);
