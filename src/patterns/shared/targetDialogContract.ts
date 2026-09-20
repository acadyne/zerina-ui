import type {
  ReactNode,
} from "react";


export type TargetDialogRender<
  TTarget,
> = (
  target: TTarget,
) => ReactNode;


export interface TargetDialogRenderProps<
  TTarget,
> {
  renderDescription?:
    TargetDialogRender<TTarget>;

  renderTargetLabel?:
    TargetDialogRender<TTarget>;

  renderBody?:
    TargetDialogRender<TTarget>;

  renderFooter?:
    TargetDialogRender<TTarget>;
}


export interface ResolvedTargetDialogContent {
  description:
    ReactNode;

  targetLabel:
    ReactNode;

  body:
    ReactNode;

  footer:
    ReactNode;
}


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


function renderTargetDialogSlot<
  TTarget,
>(
  render:
    | TargetDialogRender<TTarget>
    | undefined,
  target:
    TTarget | null,
): ReactNode {
  if (
    !render ||
    !hasDialogTarget(
      target,
    )
  ) {
    return null;
  }

  return render(
    target,
  );
}


export function resolveTargetDialogContent<
  TTarget,
>(
  {
    renderDescription,
    renderTargetLabel,
    renderBody,
    renderFooter,
  }:
    TargetDialogRenderProps<TTarget>,
  target:
    TTarget | null,
): ResolvedTargetDialogContent {
  return {
    description:
      renderTargetDialogSlot(
        renderDescription,
        target,
      ),

    targetLabel:
      renderTargetDialogSlot(
        renderTargetLabel,
        target,
      ),

    body:
      renderTargetDialogSlot(
        renderBody,
        target,
      ),

    footer:
      renderTargetDialogSlot(
        renderFooter,
        target,
      ),
  };
}
