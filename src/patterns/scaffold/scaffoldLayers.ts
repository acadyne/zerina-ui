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


export const SCAFFOLD_LOCAL_LAYERS = {
  floating: SCAFFOLD_LAYERS.floating,
} as const;


export type ScaffoldLocalLayerName =
  keyof typeof SCAFFOLD_LOCAL_LAYERS;


export function getScaffoldLocalZIndex(
  layer: ScaffoldLocalLayerName
): number {
  return SCAFFOLD_LOCAL_LAYERS[layer];
}