// src/patterns/scaffold/scaffoldLayers.ts

export const SCAFFOLD_LOCAL_LAYERS = {
  floating: 30,
} as const;

export type ScaffoldLocalLayerName =
  keyof typeof SCAFFOLD_LOCAL_LAYERS;

export function getScaffoldLocalZIndex(
  layer: ScaffoldLocalLayerName
): number {
  return SCAFFOLD_LOCAL_LAYERS[layer];
}