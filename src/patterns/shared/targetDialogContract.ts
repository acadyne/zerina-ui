import type {
  ReactNode,
} from "react";


export type RenderableWithTarget<
  TTarget,
> =
  | ReactNode
  | ((
      target: TTarget,
    ) => ReactNode);


export function hasDialogTarget<
  TTarget,
>(
  target:
    TTarget | null,
): target is TTarget {
  return (
    target !==
    null
  );
}


export function resolveRenderableWithTarget<
  TTarget,
>(
  value:
    | RenderableWithTarget<TTarget>
    | undefined,
  target:
    TTarget | null,
): ReactNode {
  if (
    typeof value ===
    "function"
  ) {
    return hasDialogTarget(
      target,
    )
      ? (
          value as (
            target:
              TTarget,
          ) => ReactNode
        )(
          target,
        )
      : null;
  }

  return (
    value ??
    null
  );
}
