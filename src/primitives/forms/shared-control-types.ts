import type {
  UITone,
} from "../../theme/contracts/visual-semantics";


export type ControlSize =
  | "sm"
  | "md"
  | "lg";


export type ControlColorScheme =
  Extract<
    UITone,
    | "primary"
    | "secondary"
    | "danger"
  >;
