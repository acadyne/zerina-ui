import React from "react";

import {
  hasRenderableNode,
} from "../../core/react/nodePresence";

import type {
  SlotElementProps,
} from "../../helpers/css";


export interface ChoiceControlRootProps {
  controlId:
    string;

  label?:
    React.ReactNode;

  rootProps:
    SlotElementProps;

  labelProps:
    SlotElementProps;

  children:
    React.ReactNode;
}


export function ChoiceControlRoot({
  controlId,
  label,
  rootProps,
  labelProps,
  children,
}: ChoiceControlRootProps) {
  const hasLabel =
    hasRenderableNode(
      label,
    );


  if (!hasLabel) {
    return (
      <div
        {...rootProps}
      >
        {children}
      </div>
    );
  }


  return (
    <label
      {...rootProps}
      htmlFor={
        controlId
      }
    >
      {children}

      <span
        {...labelProps}
      >
        {label}
      </span>
    </label>
  );
}
