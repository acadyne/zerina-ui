import {
  act,
  type ReactNode,
} from "react";

import {
  createRoot,
  type Root,
} from "react-dom/client";

import {
  afterEach,
} from "vitest";


interface MountedTree {
  container:
    HTMLDivElement;

  root:
    Root;
}


const mountedTrees:
  MountedTree[] = [];


afterEach(
  () => {
    for (
      const tree of
      mountedTrees.splice(
        0,
      )
    ) {
      act(
        () => {
          tree.root.unmount();
        },
      );

      tree.container.remove();
    }


    document.body.innerHTML =
      "";
  },
);


export function renderDOM(
  node:
    ReactNode,
): HTMLDivElement {
  const container =
    document.createElement(
      "div",
    );


  document.body.append(
    container,
  );


  const root =
    createRoot(
      container,
    );


  act(
    () => {
      root.render(
        node,
      );
    },
  );


  mountedTrees.push({
    container,
    root,
  });


  return container;
}


export function getByTestId<
  TElement extends
    HTMLElement =
      HTMLElement,
>(
  container:
    ParentNode,
  testId:
    string,
): TElement {
  const element =
    container.querySelector<
      TElement
    >(
      `[data-testid="${testId}"]`,
    );


  if (!element) {
    throw new Error(
      `Element with data-testid="${testId}" was not found.`,
    );
  }


  return element;
}


export function clickElement(
  element:
    HTMLElement,
): void {
  act(
    () => {
      element.click();
    },
  );
}


export function focusElement(
  element:
    HTMLElement,
): void {
  act(
    () => {
      element.focus();
    },
  );
}


export function setNativeInputValue(
  element:
    HTMLInputElement |
    HTMLTextAreaElement,
  value:
    string,
): void {
  const prototype =
    element instanceof
      HTMLTextAreaElement
      ? HTMLTextAreaElement
          .prototype
      : HTMLInputElement
          .prototype;


  const setter =
    Object.getOwnPropertyDescriptor(
      prototype,
      "value",
    )?.set;


  if (!setter) {
    throw new Error(
      "Native value setter was not found.",
    );
  }


  act(
    () => {
      setter.call(
        element,
        value,
      );


      element.dispatchEvent(
        new Event(
          "input",
          {
            bubbles:
              true,
          },
        ),
      );
    },
  );
}


export function dispatchSelectChange(
  select:
    HTMLSelectElement,
  value:
    string,
): void {
  act(
    () => {
      select.value =
        value;


      select.dispatchEvent(
        new Event(
          "change",
          {
            bubbles:
              true,
          },
        ),
      );
    },
  );
}