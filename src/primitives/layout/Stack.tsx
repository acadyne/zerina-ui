// // src/primitives/layout/Stack.tsx
import React, { forwardRef, useMemo } from "react";
import {
  type SizeProps,
  type SpaceProps,
  type SurfaceProps,
  getMinWidthFixStyles,
  getSizeStyles,
  getSpacingStyles,
  getSurfaceStyles,
} from "../../helpers";
import { withDividers } from "../../utils/withDividers";

export interface StackProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    SizeProps,
    SpaceProps,
    SurfaceProps {
  children?: React.ReactNode;
  className?: string;

  direction?: "row" | "column";
  spacing?: React.CSSProperties["gap"];
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: React.CSSProperties["flexWrap"];
  overflow?: React.CSSProperties["overflow"];

  divider?: React.ReactNode;
  inline?: boolean;

  style?: React.CSSProperties;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      className = "",
      direction = "column",
      spacing = "0.75rem",
      align = "stretch",
      justify,
      wrap = "nowrap",
      overflow,

      w,
      h,
      minW,
      maxW,
      minH,
      maxH,

      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,

      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,

      rounded,
      shadow,
      bg,
      color,
      border,

      divider,
      inline = false,
      style,
      ...rest
    },
    ref
  ) => {
    const content = useMemo(() => withDividers(children, divider), [children, divider]);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: inline ? "inline-flex" : "flex",
          flexDirection: direction,
          gap: divider ? undefined : spacing,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap,
          overflow,

          ...getSizeStyles({ w, h, minW, maxW, minH, maxH }),
          ...getMinWidthFixStyles(),
          ...getSpacingStyles({
            p,
            px,
            py,
            pt,
            pb,
            pl,
            pr,
            m,
            mx,
            my,
            mt,
            mb,
            ml,
            mr,
          }),
          ...getSurfaceStyles({
            bg,
            color,
            rounded,
            shadow,
            border,
          }),
          ...style,
        }}
        {...rest}
      >
        {content}
      </div>
    );
  }
);

Stack.displayName = "Stack";

export const VStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => <Stack ref={ref} direction="column" {...props} />
);

VStack.displayName = "VStack";

export const HStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => (
    <Stack ref={ref} direction="row" align={props.align ?? "center"} {...props} />
  )
);

HStack.displayName = "HStack";