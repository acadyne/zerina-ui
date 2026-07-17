// src/patterns/scaffold/scaffoldLayers.ts

export const SCAFFOLD_LAYERS = {
  sidebar: 1000,

  navigation: 1300,

  navigationMobile: 1400,

  floating: 30,
} as const;


export type ScaffoldLayerName =
  keyof typeof SCAFFOLD_LAYERS;


export function getScaffoldLayer(
  layer: ScaffoldLayerName
): number {
  return SCAFFOLD_LAYERS[layer];
}