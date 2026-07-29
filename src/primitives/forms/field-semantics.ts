import type {
  AriaAttributes,
} from "react";


export type FieldState = Readonly<{
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  readOnly: boolean;
}>;


export type FieldStateSource =
  | Partial<FieldState>
  | null
  | undefined;


export const EMPTY_FIELD_STATE: FieldState =
  Object.freeze({
    disabled: false,
    invalid: false,
    required: false,
    readOnly: false,
  });


export function resolveFieldState(
  ...sources: ReadonlyArray<FieldStateSource>
): FieldState {
  return {
    disabled:
      sources.some(
        (source) =>
          source?.disabled === true
      ),

    invalid:
      sources.some(
        (source) =>
          source?.invalid === true
      ),

    required:
      sources.some(
        (source) =>
          source?.required === true
      ),

    readOnly:
      sources.some(
        (source) =>
          source?.readOnly === true
      ),
  };
}


type AriaIdInput =
  | string
  | null
  | undefined
  | false;


export function mergeAriaIds(
  ...values: ReadonlyArray<AriaIdInput>
): string | undefined {
  const ids: string[] = [];
  const seen =
    new Set<string>();


  for (const value of values) {
    if (!value) {
      continue;
    }


    for (
      const id of
      value.split(/\s+/u)
    ) {
      const normalizedId =
        id.trim();


      if (
        !normalizedId ||
        seen.has(normalizedId)
      ) {
        continue;
      }


      seen.add(normalizedId);
      ids.push(normalizedId);
    }
  }


  return ids.length > 0
    ? ids.join(" ")
    : undefined;
}


export function resolveAriaInvalid(
  explicit:
    AriaAttributes["aria-invalid"],
  invalid: boolean
): AriaAttributes["aria-invalid"] {
  if (!invalid) {
    return explicit;
  }


  if (
    explicit === "grammar" ||
    explicit === "spelling"
  ) {
    return explicit;
  }


  return true;
}


export function resolveAriaRequired(
  explicit:
    AriaAttributes["aria-required"],
  required: boolean
): AriaAttributes["aria-required"] {
  return required
    ? true
    : explicit;
}


export function resolveAriaReadOnly(
  explicit:
    AriaAttributes["aria-readonly"],
  readOnly: boolean
): AriaAttributes["aria-readonly"] {
  return readOnly
    ? true
    : explicit;
}
