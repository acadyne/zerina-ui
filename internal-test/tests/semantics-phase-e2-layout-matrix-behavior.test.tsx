import {
  describe,
  expect,
  it,
} from "vitest";

import {
  Flex,
  Grid,
  Inline,
  Stack,
  Wrap,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "Phase E2 layout prop matrix behavior",
  () => {
    it(
      "keeps full-frame size, spacing and surface semantics aligned",
      () => {
        const components = [
          <Flex
            key="flex"
            data-testid="frame"
            w="120px"
            minH="40px"
            mx="8px"
            my="6px"
            bg="red"
            rounded="4px"
          />,

          <Grid
            key="grid"
            data-testid="frame"
            w="120px"
            minH="40px"
            mx="8px"
            my="6px"
            bg="red"
            rounded="4px"
          />,

          <Stack
            key="stack"
            data-testid="frame"
            w="120px"
            minH="40px"
            mx="8px"
            my="6px"
            bg="red"
            rounded="4px"
          />,
        ];


        for (
          const component of
          components
        ) {
          const container =
            renderDOM(
              component,
            );

          const frame =
            getByTestId<HTMLElement>(
              container,
              "frame",
            );


          expect(
            frame.style.width,
          ).toBe(
            "120px",
          );

          expect(
            frame.style.minHeight,
          ).toBe(
            "40px",
          );

          expect(
            frame.style.marginLeft,
          ).toBe(
            "8px",
          );

          expect(
            frame.style.marginRight,
          ).toBe(
            "8px",
          );

          expect(
            frame.style.marginTop,
          ).toBe(
            "6px",
          );

          expect(
            frame.style.marginBottom,
          ).toBe(
            "6px",
          );

          expect(
            frame.style.backgroundColor,
          ).toBe(
            "red",
          );

          expect(
            frame.style.borderRadius,
          ).toBe(
            "4px",
          );
        }
      },
    );


    it(
      "completes mx/my for Inline and Wrap without widening their layout role",
      () => {
        const components = [
          <Inline
            key="inline"
            data-testid="flow"
            w="120px"
            minH="40px"
            mx="8px"
            my="6px"
          />,

          <Wrap
            key="wrap"
            data-testid="flow"
            w="120px"
            minH="40px"
            mx="8px"
            my="6px"
          />,
        ];


        for (
          const component of
          components
        ) {
          const container =
            renderDOM(
              component,
            );

          const flow =
            getByTestId<HTMLElement>(
              container,
              "flow",
            );


          expect(
            flow.style.width,
          ).toBe(
            "120px",
          );

          expect(
            flow.style.minHeight,
          ).toBe(
            "40px",
          );

          expect(
            flow.style.marginLeft,
          ).toBe(
            "8px",
          );

          expect(
            flow.style.marginRight,
          ).toBe(
            "8px",
          );

          expect(
            flow.style.marginTop,
          ).toBe(
            "6px",
          );

          expect(
            flow.style.marginBottom,
          ).toBe(
            "6px",
          );
        }
      },
    );


    it(
      "preserves each primitive default layout semantics",
      () => {
        const flex =
          getByTestId<HTMLElement>(
            renderDOM(
              <Flex
                data-testid="layout"
              />,
            ),
            "layout",
          );

        const grid =
          getByTestId<HTMLElement>(
            renderDOM(
              <Grid
                data-testid="layout"
              />,
            ),
            "layout",
          );

        const stack =
          getByTestId<HTMLElement>(
            renderDOM(
              <Stack
                data-testid="layout"
              />,
            ),
            "layout",
          );

        const inline =
          getByTestId<HTMLElement>(
            renderDOM(
              <Inline
                data-testid="layout"
              />,
            ),
            "layout",
          );

        const wrap =
          getByTestId<HTMLElement>(
            renderDOM(
              <Wrap
                data-testid="layout"
              />,
            ),
            "layout",
          );


        expect(
          flex.style.display,
        ).toBe(
          "flex",
        );

        expect(
          flex.style.justifyContent,
        ).toBe(
          "center",
        );

        expect(
          flex.style.alignItems,
        ).toBe(
          "center",
        );


        expect(
          grid.style.display,
        ).toBe(
          "grid",
        );


        expect(
          stack.style.display,
        ).toBe(
          "flex",
        );

        expect(
          stack.style.flexDirection,
        ).toBe(
          "column",
        );

        expect(
          stack.style.alignItems,
        ).toBe(
          "stretch",
        );

        expect(
          stack.style.gap,
        ).toBe(
          "0.75rem",
        );


        expect(
          inline.style.display,
        ).toBe(
          "inline-flex",
        );

        expect(
          inline.style.flexWrap,
        ).toBe(
          "nowrap",
        );

        expect(
          inline.style.gap,
        ).toBe(
          "0.5rem",
        );


        expect(
          wrap.style.display,
        ).toBe(
          "flex",
        );

        expect(
          wrap.style.flexWrap,
        ).toBe(
          "wrap",
        );

        expect(
          wrap.style.gap,
        ).toBe(
          "0.75rem",
        );
      },
    );


    it(
      "keeps direct style as the final override in every layout primitive",
      () => {
        const components = [
          <Flex
            key="flex"
            data-testid="layout"
            gap="4px"
            style={{
              gap:
                "9px",
            }}
          />,

          <Grid
            key="grid"
            data-testid="layout"
            gap="4px"
            style={{
              gap:
                "9px",
            }}
          />,

          <Stack
            key="stack"
            data-testid="layout"
            spacing="4px"
            style={{
              gap:
                "9px",
            }}
          />,

          <Inline
            key="inline"
            data-testid="layout"
            gap="4px"
            style={{
              gap:
                "9px",
            }}
          />,

          <Wrap
            key="wrap"
            data-testid="layout"
            spacing="4px"
            style={{
              gap:
                "9px",
            }}
          />,
        ];


        for (
          const component of
          components
        ) {
          const layout =
            getByTestId<HTMLElement>(
              renderDOM(
                component,
              ),
              "layout",
            );


          expect(
            layout.style.gap,
          ).toBe(
            "9px",
          );
        }
      },
    );
  },
);
