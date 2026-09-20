import type {
  UITone,
} from "../../theme/contracts/visual-semantics";


export type FeedbackVariant =
  Extract<
    UITone,
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "neutral"
  >;
