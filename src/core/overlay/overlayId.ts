// src/core/overlay/overlayId.ts

export function assertValidOverlayId(
  overlayId: string,
  owner: string
): void {
  /*
   * El ID participa simultáneamente en el registro global, el ownership de
   * foco/escape, el scroll lock y las asociaciones aria. Un valor vacío o con
   * espacios separaría esas responsabilidades y produciría IDs DOM inválidos.
   */
  if (
    typeof overlayId !== "string" ||
    overlayId.length === 0 ||
    /\s/.test(overlayId)
  ) {
    throw new Error(
      `${owner} requires overlayId to be a non-empty string without whitespace.`
    );
  }
}

export function resolveOverlayId(
  providedId: string | undefined,
  generatedId: string,
  prefix: string
): string {
  const overlayId =
    providedId ??
    `${prefix}-${generatedId}`;

  assertValidOverlayId(
    overlayId,
    prefix
  );

  return overlayId;
}
