import React from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  Button,
  IconButton,
  MenuContent,
  MenuItem,
  Menu,
  MenuTrigger,
  OverlayProvider,
  Pressable,
  Tag,
  Toast,
} from "zerina-ui";

import "zerina-ui/styles.css";


declare global {
  interface Window {
    __setPressConsumersDisabled?: (
      disabled: boolean,
    ) => void;
  }
}


const interactionTokens = {
  "--ui-primary":
    "rgb(20, 80, 180)",

  "--ui-surface":
    "rgb(255, 255, 255)",

  "--ui-text":
    "rgb(20, 20, 20)",

  "--ui-text-muted":
    "rgb(80, 80, 80)",

  "--ui-border":
    "rgb(120, 120, 120)",

  "--ui-interaction-focus-ring-color":
    "rgb(20, 80, 180)",

  "--ui-interaction-focus-ring-width":
    "2px",

  "--ui-interaction-focus-ring-offset":
    "1px",

  "--ui-interaction-disabled-opacity":
    "0.45",

  "--ui-duration-fast":
    "0ms",

  "--ui-duration-normal":
    "0ms",

  "--ui-ease-standard":
    "linear",
} as React.CSSProperties;


function MenuConsumer({
  disabled,
}: {
  disabled: boolean;
}) {
  const [
    open,
    setOpen,
  ] = React.useState(
    false,
  );


  return (
    <Menu
      open={open}
      onOpenChange={
        setOpen
      }
    >
      <MenuTrigger>
        <button
          data-testid="press-menu-trigger"
          type="button"
        >
          Abrir menú
        </button>
      </MenuTrigger>

      <MenuContent
        portalled={false}
        closeOnPointerDownOutside={
          false
        }
      >
        <MenuItem
          data-testid="press-menu-item"
          closeOnSelect={false}
          disabled={disabled}
        >
          Elemento de menú
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}


function App() {
  const [
    consumersDisabled,
    setConsumersDisabled,
  ] = React.useState(
    false,
  );


  React.useEffect(() => {
    window.__setPressConsumersDisabled =
      (
        disabled,
      ) => {
        setConsumersDisabled(
          disabled,
        );
      };


    return () => {
      delete window
        .__setPressConsumersDisabled;
    };
  }, []);


  return (
    <main
      style={{
        ...interactionTokens,

        display:
          "flex",

        flexDirection:
          "column",

        alignItems:
          "flex-start",

        gap:
          "16px",

        padding:
          "24px",
      }}
    >
      <button
        data-testid="press-focus-start"
        type="button"
      >
        Inicio
      </button>

      <Button
        data-testid="press-button"
        disabled={consumersDisabled}
        onPress={() => {}}
      >
        Button
      </Button>

      <IconButton
        data-testid="press-icon-button"
        ariaLabel="IconButton"
        disabled={consumersDisabled}
        icon={
          <span>
            I
          </span>
        }
        onPress={() => {}}
      />

      <Pressable
        data-testid="press-pressable"
        disabled={consumersDisabled}
        onPress={() => {}}
      >
        Pressable
      </Pressable>

      <Toast
        title="Toast"
        closable={!consumersDisabled}
        description="Descripción"
        onClose={() => {}}
        slotProps={{
          closeButton: {
            "data-testid":
              "press-toast-close",
          },
        }}
      />

      <Tag
        removable
        onRemove={
          consumersDisabled
            ? undefined
            : () => {}
        }
        slotProps={{
          removeButton: {
            "data-testid":
              "press-tag-remove",
          },
        }}
      >
        Tag
      </Tag>

      <MenuConsumer
        disabled={consumersDisabled}
      />
    </main>
  );
}


const container =
  document.getElementById(
    "root",
  );


if (!container) {
  throw new Error(
    "usePress browser root was not found.",
  );
}


createRoot(
  container,
).render(
  <OverlayProvider>
    <App />
  </OverlayProvider>,
);
