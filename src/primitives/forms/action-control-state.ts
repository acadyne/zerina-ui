import type {
  UIPressPointerType,
  UIPressState,
} from "../../core/interaction";

type ActionControlPressState =
  Pick<
    UIPressState,
    | "hovered"
    | "pressed"
    | "focused"
    | "focusVisible"
    | "disabled"
    | "pointerType"
  >;

export interface ActionControlStateOptions {
  disabled?: boolean;
  loading?: boolean;
}

export interface ActionControlStateAttributes {
  "data-hovered"?: "";
  "data-pressed"?: "";
  "data-focused"?: "";
  "data-focus-visible"?: "";
  "data-disabled"?: "";
  "data-loading"?: "";
  "data-pointer-type"?:
    UIPressPointerType;
}

function dataAttribute(
  active: boolean
): "" | undefined {
  return active
    ? ""
    : undefined;
}

export function getActionControlStateAttributes(
  state: ActionControlPressState,
  options: ActionControlStateOptions = {}
): ActionControlStateAttributes {
  const disabled =
    options.disabled ??
    state.disabled;

  return {
    "data-hovered":
      dataAttribute(
        state.hovered
      ),

    "data-pressed":
      dataAttribute(
        state.pressed
      ),

    "data-focused":
      dataAttribute(
        state.focused
      ),

    "data-focus-visible":
      dataAttribute(
        state.focusVisible
      ),

    "data-disabled":
      dataAttribute(
        disabled
      ),

    "data-loading":
      dataAttribute(
        options.loading ??
        false
      ),

    "data-pointer-type":
      state.pointerType ??
      undefined,
  };
}
