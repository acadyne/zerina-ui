import {
  useState,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Checkbox,
  Field,
  PasswordInput,
  SearchInput,
  Switch,
} from "zerina-ui";

import {
  clickElement,
  focusElement,
  getByTestId,
  renderDOM,
  setNativeInputValue,
} from "./react-dom-test-utils";


describe(
  "SearchInput",
  () => {
    it(
      "does not pass value and defaultValue together",
      () => {
        const consoleError =
          vi.spyOn(
            console,
            "error",
          ).mockImplementation(
            () => {
              // El mensaje se inspecciona abajo.
            },
          );


        try {
          renderDOM(
            <SearchInput
              defaultValue="query"
            />,
          );


          const messages =
            consoleError
              .mock
              .calls
              .flat()
              .map(
                String,
              )
              .join(
                "\n",
              );


          expect(
            messages,
          ).not.toContain(
            "both value and defaultValue props",
          );
        } finally {
          consoleError.mockRestore();
        }
      },
    );


    it(
      "supports controlled mode",
      () => {
        const onValueChange =
          vi.fn();


        function Harness() {
          const [
            value,
            setValue,
          ] =
            useState(
              "initial",
            );


          return (
            <SearchInput
              data-testid="search"
              value={value}
              onValueChange={(
                nextValue,
              ) => {
                onValueChange(
                  nextValue,
                );

                setValue(
                  nextValue,
                );
              }}
            />
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "search",
          );


        setNativeInputValue(
          input,
          "changed",
        );


        expect(
          onValueChange,
        ).toHaveBeenCalledWith(
          "changed",
        );


        expect(
          input.value,
        ).toBe(
          "changed",
        );
      },
    );


    it(
      "supports defaultValue and uncontrolled clearing",
      () => {
        const onClear =
          vi.fn();


        const onValueChange =
          vi.fn();


        const container =
          renderDOM(
            <SearchInput
              data-testid="search"
              defaultValue="query"
              onClear={
                onClear
              }
              onValueChange={
                onValueChange
              }
            />,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "search",
          );


        const clear =
          container.querySelector<HTMLButtonElement>(
            'button[aria-label="Limpiar búsqueda"]',
          );


        expect(
          input.value,
        ).toBe(
          "query",
        );


        expect(
          clear,
        ).not.toBeNull();


        if (!clear) {
          throw new Error(
            "Search clear button was not rendered.",
          );
        }


        clickElement(
          clear,
        );


        expect(
          input.value,
        ).toBe(
          "",
        );


        expect(
          onClear,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          onValueChange,
        ).toHaveBeenCalledWith(
          "",
        );
      },
    );


    it(
      "hides and disables clearing semantics in read-only mode",
      () => {
        const onClear =
          vi.fn();


        const onValueChange =
          vi.fn();


        const container =
          renderDOM(
            <SearchInput
              data-testid="search"
              defaultValue="query"
              readOnly
              onClear={
                onClear
              }
              onValueChange={
                onValueChange
              }
            />,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "search",
          );


        expect(
          input.readOnly,
        ).toBe(
          true,
        );


        expect(
          input.disabled,
        ).toBe(
          false,
        );


        expect(
          input.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );


        expect(
          container.querySelector(
            'button[aria-label="Limpiar búsqueda"]',
          ),
        ).toBeNull();


        expect(
          onClear,
        ).not.toHaveBeenCalled();


        expect(
          onValueChange,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "disables the search control and removes its secondary action",
      () => {
        const container =
          renderDOM(
            <SearchInput
              data-testid="search"
              defaultValue="query"
              disabled
            />,
          );


        expect(
          getByTestId<HTMLInputElement>(
            container,
            "search",
          ).disabled,
        ).toBe(
          true,
        );


        expect(
          container.querySelector(
            'button[aria-label="Limpiar búsqueda"]',
          ),
        ).toBeNull();
      },
    );
  },
);

describe(
  "PasswordInput",
  () => {
    it(
      "keeps the visibility toggle active in read-only mode",
      () => {
        const onChange =
          vi.fn();


        const container =
          renderDOM(
            <PasswordInput
              data-testid="password"
              defaultValue="secret"
              readOnly
              onChange={
                onChange
              }
            />,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "password",
          );


        const toggle =
          container.querySelector<HTMLButtonElement>(
            'button[aria-pressed]',
          );


        expect(
          input.readOnly,
        ).toBe(
          true,
        );


        expect(
          input.disabled,
        ).toBe(
          false,
        );


        expect(
          input.type,
        ).toBe(
          "password",
        );


        expect(
          toggle?.disabled,
        ).toBe(
          false,
        );


        if (!toggle) {
          throw new Error(
            "Password toggle was not rendered.",
          );
        }


        clickElement(
          toggle,
        );


        expect(
          input.type,
        ).toBe(
          "text",
        );


        expect(
          onChange,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "disables the input and visibility toggle together",
      () => {
        const container =
          renderDOM(
            <PasswordInput
              data-testid="password"
              disabled
            />,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "password",
          );


        const toggle =
          container.querySelector<HTMLButtonElement>(
            'button[aria-pressed]',
          );


        expect(
          input.disabled,
        ).toBe(
          true,
        );


        expect(
          toggle?.disabled,
        ).toBe(
          true,
        );
      },
    );


    it(
      "inherits invalid, required and field descriptions",
      () => {
        const container =
          renderDOM(
            <Field
              id="password-field"
              invalid
              required
              helpText="Password help"
              error="Password error"
            >
              <PasswordInput
                data-testid="password"
              />
            </Field>,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "password",
          );


        expect(
          input.required,
        ).toBe(
          true,
        );


        expect(
          input.getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          "true",
        );


        expect(
          input.getAttribute(
            "aria-describedby",
          ),
        ).toBe(
          "password-field-help password-field-error",
        );
      },
    );
  },
);


describe(
  "Checkbox",
  () => {
    it(
      "supports uncontrolled state",
      () => {
        const container =
          renderDOM(
            <Checkbox
              data-testid="checkbox"
              defaultChecked={false}
            />,
          );


        const checkbox =
          getByTestId<HTMLInputElement>(
            container,
            "checkbox",
          );


        expect(
          checkbox.checked,
        ).toBe(
          false,
        );


        clickElement(
          checkbox,
        );


        expect(
          checkbox.checked,
        ).toBe(
          true,
        );
      },
    );


    it(
      "depends exclusively on checked in controlled mode",
      () => {
        const onChange =
          vi.fn();


        const container =
          renderDOM(
            <Checkbox
              data-testid="checkbox"
              checked={false}
              onChange={
                onChange
              }
            />,
          );


        const checkbox =
          getByTestId<HTMLInputElement>(
            container,
            "checkbox",
          );


        clickElement(
          checkbox,
        );


        expect(
          onChange,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          checkbox.checked,
        ).toBe(
          false,
        );
      },
    );


    it(
      "keeps read-only focusable and prevents changes",
      () => {
        const onChange =
          vi.fn();


        const container =
          renderDOM(
            <Checkbox
              data-testid="checkbox"
              defaultChecked
              readOnly
              onChange={
                onChange
              }
            />,
          );


        const checkbox =
          getByTestId<HTMLInputElement>(
            container,
            "checkbox",
          );


        expect(
          checkbox.checked,
        ).toBe(
          true,
        );


        focusElement(
          checkbox,
        );


        expect(
          document.activeElement,
        ).toBe(
          checkbox,
        );


        expect(
          checkbox.disabled,
        ).toBe(
          false,
        );


        expect(
          checkbox.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );


        clickElement(
          checkbox,
        );


        expect(
          onChange,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "uses native disabled and supports mixed state",
      () => {
        const container =
          renderDOM(
            <>
              <Checkbox
                data-testid="disabled"
                disabled
              />

              <Checkbox
                data-testid="mixed"
                indeterminate
              />
            </>,
          );


        const disabled =
          getByTestId<HTMLInputElement>(
            container,
            "disabled",
          );


        const mixed =
          getByTestId<HTMLInputElement>(
            container,
            "mixed",
          );


        expect(
          disabled.disabled,
        ).toBe(
          true,
        );


        expect(
          mixed.indeterminate,
        ).toBe(
          true,
        );


        expect(
          mixed.getAttribute(
            "aria-checked",
          ),
        ).toBe(
          "mixed",
        );
      },
    );
  },
);


describe(
  "Switch",
  () => {
    it(
      "supports uncontrolled and controlled modes",
      () => {
        const uncontrolled =
          renderDOM(
            <Switch
              data-testid="uncontrolled"
              defaultChecked={false}
            />,
          );


        const uncontrolledInput =
          getByTestId<HTMLInputElement>(
            uncontrolled,
            "uncontrolled",
          );


        clickElement(
          uncontrolledInput,
        );


        expect(
          uncontrolledInput.checked,
        ).toBe(
          true,
        );


        const controlledChange =
          vi.fn();


        const controlled =
          renderDOM(
            <Switch
              data-testid="controlled"
              checked={false}
              onChange={
                controlledChange
              }
            />,
          );


        const controlledInput =
          getByTestId<HTMLInputElement>(
            controlled,
            "controlled",
          );


        clickElement(
          controlledInput,
        );


        expect(
          controlledChange,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          controlledInput.checked,
        ).toBe(
          false,
        );
      },
    );


    it(
      "keeps read-only focusable and prevents changes",
      () => {
        const onChange =
          vi.fn();


        const container =
          renderDOM(
            <Switch
              data-testid="switch"
              defaultChecked
              readOnly
              onChange={
                onChange
              }
            />,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "switch",
          );


        expect(
          input.checked,
        ).toBe(
          true,
        );


        focusElement(
          input,
        );


        expect(
          document.activeElement,
        ).toBe(
          input,
        );


        expect(
          input.disabled,
        ).toBe(
          false,
        );


        expect(
          input.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );


        clickElement(
          input,
        );


        expect(
          onChange,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "uses native disabled behavior",
      () => {
        const container =
          renderDOM(
            <Switch
              data-testid="switch"
              disabled
            />,
          );


        expect(
          getByTestId<HTMLInputElement>(
            container,
            "switch",
          ).disabled,
        ).toBe(
          true,
        );
      },
    );
  },
);