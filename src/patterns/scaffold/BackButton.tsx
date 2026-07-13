// src/patterns/scaffold/BackButton.tsx
import React from "react";
import type { UIPressEvent } from "../../core/interaction";
import { IconButton } from "../../primitives/forms";

export type BackButtonProps = Omit<
  React.ComponentProps<typeof IconButton>,
  "ariaLabel" | "icon"
> & {
  ariaLabel?: string;
  icon?: React.ReactNode;

  /**
   * Callback semántico para navegación hacia atrás.
   * Se ejecuta después de onPress si el evento no fue prevenido.
   */
  onBack?: (event: UIPressEvent<HTMLElement>) => void;
};

export const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (
    {
      ariaLabel = "Volver",
      icon = "‹",
      size = "sm",
      variant = "ghost",
      onPress,
      onBack,
      ...rest
    },
    ref
  ) => {
    return (
      <IconButton
        ref={ref}
        ariaLabel={ariaLabel}
        icon={icon}
        size={size}
        variant={variant}
        onPress={(event) => {
          onPress?.(event);

          if (event.defaultPrevented) {
            return;
          }

          onBack?.(event);
        }}
        {...rest}
      />
    );
  }
);

BackButton.displayName = "BackButton";