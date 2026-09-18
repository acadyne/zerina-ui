// internal-test/src/documentation/DocumentationViewportSwitcher.tsx

import React from "react";

import {
  Button,
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  useUIViewport,
} from "zerina-ui";


export function DocumentationViewportSwitcher() {
  const viewport =
    useUIViewport();


  const [
    open,
    setOpen,
  ] = React.useState(false);


  const currentLabel =
    viewport.mode === "auto"
      ? "Auto"
      : viewport.mode;


  const selectMode = (
    mode:
      | "auto"
      | "mobile"
      | "tablet"
      | "desktop"
  ) => {
    switch (mode) {
      case "auto":
        viewport.setAutoMode();
        break;

      case "mobile":
        viewport.setMobileMode();
        break;

      case "tablet":
        viewport.setTabletMode();
        break;

      case "desktop":
        viewport.setDesktopMode();
        break;
    }

    setOpen(false);
  };


  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
    >
      <MenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
        >
          Viewport: {currentLabel}
        </Button>
      </MenuTrigger>


      <MenuContent
        placement="bottom-end"
      >
        <MenuLabel>
          Viewport Mode
        </MenuLabel>


        <MenuSeparator />


        <MenuItem
          onSelect={() => {
            selectMode("auto");
          }}
        >
          Auto
        </MenuItem>


        <MenuItem
          onSelect={() => {
            selectMode("mobile");
          }}
        >
          Mobile
        </MenuItem>


        <MenuItem
          onSelect={() => {
            selectMode("tablet");
          }}
        >
          Tablet
        </MenuItem>


        <MenuItem
          onSelect={() => {
            selectMode("desktop");
          }}
        >
          Desktop
        </MenuItem>

      </MenuContent>
    </Menu>
  );
}


DocumentationViewportSwitcher.displayName =
  "DocumentationViewportSwitcher";