// src/patterns/scaffold/BackButton.tsx
import React from "react";
import { IconButton } from "../../primitives/forms";

export type BackButtonProps = Omit<
  React.ComponentProps<typeof IconButton>,
  "ariaLabel" | "icon"
> & {
  ariaLabel?: string;
  icon?: React.ReactNode;

  /**
   * Callback semántico para navegación hacia atrás.
   * Se ejecuta después de onClick si el evento no fue prevenido.
   */
  onBack?: React.MouseEventHandler<HTMLButtonElement>;
};

export const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (
    {
      ariaLabel = "Volver",
      icon = "‹",
      size = "sm",
      variant = "ghost",
      onClick,
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
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented) return;

          onBack?.(event);
        }}
        {...rest}
      />
    );
  }
);

BackButton.displayName = "BackButton";