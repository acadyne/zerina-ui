import React from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  BottomSheet,
  BottomSheetBody,
  Drawer,
  DrawerBody,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  OverlayProvider,
  UIMotionProvider,
} from "zerina-ui";

import "zerina-ui/styles.css";


function MenuEpochHarness() {
  const [
    open,
    setOpen,
  ] =
    React.useState(
      false,
    );

  const rejectNextOpenRef =
    React.useRef(
      true,
    );


  return (
    <section>
      <button
        data-testid="menu-programmatic-open"
        type="button"
        onClick={() => {
          setOpen(
            true,
          );
        }}
      >
        Open menu programmatically
      </button>

      <Menu
        open={open}
        initialFocusIndex={
          0
        }
        onOpenChange={(
          nextOpen,
        ) => {
          if (
            nextOpen &&
            rejectNextOpenRef
              .current
          ) {
            rejectNextOpenRef
              .current =
              false;

            return;
          }

          setOpen(
            nextOpen,
          );
        }}
      >
        <MenuTrigger
          asChild
        >
          <button
            data-testid="menu-trigger"
            type="button"
          >
            Menu
          </button>
        </MenuTrigger>

        <MenuContent
          portalled={
            false
          }
        >
          <MenuItem
            data-testid="menu-first"
            closeOnSelect={
              false
            }
          >
            First
          </MenuItem>

          <MenuItem
            data-testid="menu-last"
            closeOnSelect={
              false
            }
          >
            Last
          </MenuItem>
        </MenuContent>
      </Menu>
    </section>
  );
}


function DrawerHarness() {
  const [
    open,
    setOpen,
  ] =
    React.useState(
      false,
    );

  const inputRef =
    React.useRef<HTMLInputElement>(
      null,
    );


  return (
    <section>
      <button
        data-testid="drawer-open"
        type="button"
        onClick={() => {
          setOpen(
            true,
          );
        }}
      >
        Open drawer
      </button>

      <Drawer
        open={open}
        onOpenChange={
          setOpen
        }
        title="Drawer title"
        initialFocusRef={
          inputRef
        }
      >
        <DrawerBody>
          <input
            ref={inputRef}
            data-testid="drawer-input"
            aria-label="Drawer input"
          />
        </DrawerBody>
      </Drawer>
    </section>
  );
}


function BottomSheetHarness() {
  const [
    open,
    setOpen,
  ] =
    React.useState(
      false,
    );

  const inputRef =
    React.useRef<HTMLInputElement>(
      null,
    );


  return (
    <section>
      <button
        data-testid="sheet-open"
        type="button"
        onClick={() => {
          setOpen(
            true,
          );
        }}
      >
        Open sheet
      </button>

      <BottomSheet
        open={open}
        onOpenChange={
          setOpen
        }
        title="Sheet title"
        showHandle={
          false
        }
        initialFocusRef={
          inputRef
        }
      >
        <BottomSheetBody>
          <input
            ref={inputRef}
            data-testid="sheet-input"
            aria-label="Sheet input"
          />
        </BottomSheetBody>
      </BottomSheet>
    </section>
  );
}


function App() {
  return (
    <main
      style={{
        display:
          "grid",

        gap:
          "32px",

        padding:
          "24px",
      }}
    >
      <MenuEpochHarness />
      <DrawerHarness />
      <BottomSheetHarness />
    </main>
  );
}


const container =
  document.getElementById(
    "root",
  );


if (!container) {
  throw new Error(
    "Interaction/overlay browser root was not found.",
  );
}


createRoot(
  container,
).render(
  <OverlayProvider>
    <UIMotionProvider
      level="none"
      respectReducedMotion={
        false
      }
    >
      <App />
    </UIMotionProvider>
  </OverlayProvider>,
);
