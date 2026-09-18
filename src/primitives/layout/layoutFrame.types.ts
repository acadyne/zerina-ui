import type {
  SizeProps,
  SpaceProps,
  SurfaceProps,
} from "../../helpers";


/**
 * Frame de layout completo.
 *
 * Flex, Grid y Stack comparten tamaño, spacing y surface.
 */
export interface LayoutFrameProps
  extends
    SizeProps,
    SpaceProps,
    SurfaceProps {}


/**
 * Frame deliberadamente estrecho para layouts de flujo.
 *
 * Inline y Wrap comparten spacing completo, pero sólo exponen
 * width/minHeight del contrato de tamaño y no poseen surface props.
 */
export interface FlowLayoutFrameProps
  extends SpaceProps {
  w?:
    SizeProps["w"];

  minH?:
    SizeProps["minH"];
}
