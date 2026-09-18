export type AriaIdInput =
  | string
  | null
  | undefined
  | false;


/**
 * Combina listas de IDs ARIA preservando orden, normalizando whitespace
 * y eliminando duplicados.
 */
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
