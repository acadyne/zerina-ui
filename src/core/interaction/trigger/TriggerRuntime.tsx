import React from "react";

import {
  setRef,
} from "../events";

import {
  isEventOwnedByNode,
} from "../events/isEventOwnedByNode";

import {
  usePress,
  type UIPressEvent,
} from "../press";


export const TRIGGER_PRESS_TARGET =
  Symbol(
    "zerina.trigger.press-target"
  );


type TriggerPressTarget = {
  [TRIGGER_PRESS_TARGET]?:
    true;
};


export function markTriggerPressTarget<
  TComponent extends object,
>(
  component:
    TComponent
): TComponent {
  const markedComponent =
    component as
      TComponent &
      TriggerPressTarget;

  /*
   * La marca pertenece al componente exportado. React conserva ese mismo
   * objeto como element.type y cloneElement no sustituye su identidad.
   */
  if (
    markedComponent[
      TRIGGER_PRESS_TARGET
    ]
  ) {
    return component;
  }

  Object.defineProperty(
    component,
    TRIGGER_PRESS_TARGET,
    {
      configurable:
        false,

      enumerable:
        false,

      writable:
        false,

      value:
        true,
    }
  );

  return component;
}


function isTriggerPressTarget(
  type:
    React.ReactElement["type"]
): boolean {
  if (
    typeof type ===
    "string"
  ) {
    return false;
  }

  return Boolean(
    (
      type as unknown as
        TriggerPressTarget
    )[
      TRIGGER_PRESS_TARGET
    ]
  );
}


type SupportedTriggerHost =
  | "button"
  | "a"
  | "div"
  | "span";


type TriggerDataAttributes = {
  [
    name:
      `data-${string}`
  ]:
    | string
    | number
    | boolean
    | undefined;
};


type TriggerElementProps =
  React.HTMLAttributes<HTMLElement> &
  TriggerDataAttributes & {
    disabled?:
      boolean;

    href?:
      string;

    type?:
      React.ButtonHTMLAttributes<HTMLButtonElement>[
        "type"
      ];

    onPress?:
      (
        event:
          UIPressEvent<HTMLElement>
      ) => void;
  };


type TriggerEventLayer =
  | React.HTMLAttributes<HTMLElement>
  | undefined;


type TriggerEventHandler<
  TEvent,
> = (
  event:
    TEvent
) => void;


/*
 * P2.5 conserva la semántica vigente:
 *
 * todas las capas externas se ejecutan una vez. Después, defaultPrevented
 * decide si la conducta semántica interna puede continuar.
 *
 * La cancelación entre capas externas pertenece a la matriz exacta de P4.1.
 */
function composeTriggerEvent<
  TEvent extends {
    readonly defaultPrevented:
      boolean;
  },
>({
  childHandler,
  layers,
  getLayerHandler,
  internalHandler,
}: {
  childHandler?:
    TriggerEventHandler<TEvent>;

  layers:
    readonly TriggerEventLayer[];

  getLayerHandler:
    (
      layer:
        React.HTMLAttributes<HTMLElement>
    ) =>
      | TriggerEventHandler<TEvent>
      | undefined;

  internalHandler?:
    TriggerEventHandler<TEvent>;
}):
  | TriggerEventHandler<TEvent>
  | undefined {
  const externalHandlers = [
    childHandler,

    ...layers.map(
      (
        layer
      ) =>
        layer
          ? getLayerHandler(
              layer
            )
          : undefined
    ),
  ].filter(
    (
      handler
    ): handler is
      TriggerEventHandler<TEvent> =>
      typeof handler ===
      "function"
  );

  if (
    externalHandlers.length ===
      0 &&
    !internalHandler
  ) {
    return undefined;
  }

  return (
    event:
      TEvent
  ) => {
    for (
      const handler
      of externalHandlers
    ) {
      handler(
        event
      );
    }

    if (
      event.defaultPrevented
    ) {
      return;
    }

    internalHandler?.(
      event
    );
  };
}


function omitManagedTriggerProps(
  props:
    TriggerElementProps
): TriggerElementProps {
  const {
    children:
      _children,

    className:
      _className,

    style:
      _style,

    disabled:
      _disabled,

    type:
      _type,

    "aria-disabled":
      _ariaDisabled,

    onPress:
      _onPress,

    onPointerEnter:
      _onPointerEnter,

    onPointerLeave:
      _onPointerLeave,

    onPointerDown:
      _onPointerDown,

    onPointerUp:
      _onPointerUp,

    onPointerCancel:
      _onPointerCancel,

    onLostPointerCapture:
      _onLostPointerCapture,

    onFocus:
      _onFocus,

    onBlur:
      _onBlur,

    onKeyDown:
      _onKeyDown,

    onKeyUp:
      _onKeyUp,

    onClick:
      _onClick,

    ...rest
  } = props;

  return rest;
}


function mergeTriggerClassName(
  childClassName:
    string | undefined,

  runtimeClassName:
    string | undefined
):
  | string
  | undefined {
  const className = [
    childClassName,
    runtimeClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    className ||
    undefined
  );
}


function mergeTriggerStyle(
  childStyle:
    React.CSSProperties
    | undefined,

  runtimeStyle:
    React.CSSProperties
    | undefined
):
  | React.CSSProperties
  | undefined {
  if (
    !childStyle &&
    !runtimeStyle
  ) {
    return undefined;
  }

  return {
    ...childStyle,
    ...runtimeStyle,
  };
}


/*
 * React 18 conserva ref en el elemento y React 19 puede exponerla en props.
 *
 * Los descriptors evitan activar el getter de advertencia de la representación
 * que no corresponde a la versión de React en ejecución.
 */
function getElementRef(
  element:
    React.ReactElement<TriggerElementProps>
):
  | React.Ref<HTMLElement>
  | undefined {
  const propsDescriptor =
    Object.getOwnPropertyDescriptor(
      element.props,
      "ref"
    );

  const propsGetter =
    propsDescriptor?.get as
      | (
          & (() => unknown)
          & {
            isReactWarning?:
              boolean;
          }
        )
      | undefined;

  if (
    propsGetter
      ?.isReactWarning
  ) {
    return (
      element as
        React.ReactElement<TriggerElementProps> & {
          ref?:
            React.Ref<HTMLElement>;
        }
    ).ref;
  }

  const elementDescriptor =
    Object.getOwnPropertyDescriptor(
      element,
      "ref"
    );

  const elementGetter =
    elementDescriptor?.get as
      | (
          & (() => unknown)
          & {
            isReactWarning?:
              boolean;
          }
        )
      | undefined;

  if (
    elementGetter
      ?.isReactWarning
  ) {
    return (
      element.props as
        TriggerElementProps & {
          ref?:
            React.Ref<HTMLElement>;
        }
    ).ref;
  }

  return (
    (
      element.props as
        TriggerElementProps & {
          ref?:
            React.Ref<HTMLElement>;
        }
    ).ref ??
    (
      element as
        React.ReactElement<TriggerElementProps> & {
          ref?:
            React.Ref<HTMLElement>;
        }
    ).ref
  );
}


function useTriggerRefs({
  childRef,
  forwardedRef,
  onNodeChange,
}: {
  childRef?:
    React.Ref<HTMLElement>;

  forwardedRef?:
    React.Ref<HTMLElement>;

  onNodeChange?:
    (
      node:
        HTMLElement | null
    ) => void;
}):
  React.RefCallback<HTMLElement> {
  return React.useCallback(
    (
      node:
        HTMLElement | null
    ) => {
      onNodeChange?.(
        node
      );

      setRef(
        forwardedRef,
        node
      );

      setRef(
        childRef,
        node
      );
    },
    [
      childRef,
      forwardedRef,
      onNodeChange,
    ]
  );
}


function isOwnedTriggerEvent(
  event:
    React.SyntheticEvent<HTMLElement>
): boolean {
  return isEventOwnedByNode(
    event,
    event.currentTarget
  );
}


function isTriggerActivationKey(
  event:
    React.KeyboardEvent<HTMLElement>
): boolean {
  return (
    event.key ===
      "Enter" ||
    event.key ===
      " " ||
    event.key ===
      "ArrowDown" ||
    event.key ===
      "ArrowUp"
  );
}


function blockDisabledActivation(
  event:
    React.SyntheticEvent<HTMLElement>
): void {
  event.preventDefault();
  event.stopPropagation();
}


export interface TriggerRuntimeProps {
  asChild?:
    boolean;

  children:
    React.ReactNode;

  disabled?:
    boolean;

  forwardedRef?:
    React.Ref<HTMLElement>;

  onNodeChange?:
    (
      node:
        HTMLElement | null
    ) => void;

  elementProps:
    TriggerElementProps;

  eventLayers?:
    readonly TriggerEventLayer[];

  onPress:
    (
      event:
        UIPressEvent<HTMLElement>
    ) => void;

  onKeyDown?:
    React.KeyboardEventHandler<HTMLElement>;
}


interface IntrinsicTriggerRootProps
  extends Omit<
    TriggerRuntimeProps,
    "asChild"
  > {
  host:
    SupportedTriggerHost;

  child?:
    React.ReactElement<TriggerElementProps>;
}


function IntrinsicTriggerRoot({
  host,
  child,
  children,

  disabled =
    false,

  forwardedRef,
  onNodeChange,

  elementProps,
  eventLayers =
    [],

  onPress,
  onKeyDown,
}: IntrinsicTriggerRootProps) {
  const childProps:
    TriggerElementProps =
    child?.props ??
    {};

  const effectiveDisabled =
    disabled ||
    Boolean(
      childProps.disabled
    );

  const childRef =
    child
      ? getElementRef(
          child
        )
      : undefined;

  const setRefs =
    useTriggerRefs({
      childRef,
      forwardedRef,
      onNodeChange,
    });

  const finalHref =
    elementProps.href ??
    childProps.href;

  const nativeInteractive =
    host ===
      "button" ||
    (
      host ===
        "a" &&
      typeof finalHref ===
        "string" &&
      finalHref.length >
        0
    );

  const externalClick =
    composeTriggerEvent<
      React.MouseEvent<HTMLElement>
    >({
      childHandler:
        childProps.onClick,

      layers:
        eventLayers,

      getLayerHandler:
        (
          layer
        ) =>
          layer.onClick,
    });

  const handleClick =
    React.useCallback(
      (
        event:
          React.MouseEvent<HTMLElement>
      ) => {
        /*
         * Disabled solo bloquea el gesto que pertenece al trigger. Un control
         * interactivo descendiente conserva su propio click.
         */
        if (
          effectiveDisabled &&
          isOwnedTriggerEvent(
            event
          )
        ) {
          blockDisabledActivation(
            event
          );
          return;
        }

        externalClick?.(
          event
        );
      },
      [
        effectiveDisabled,
        externalClick,
      ]
    );

  const runOwnedKeyDown =
    React.useCallback(
      (
        event:
          React.KeyboardEvent<HTMLElement>
      ) => {
        if (
          !isOwnedTriggerEvent(
            event
          )
        ) {
          return;
        }

        onKeyDown?.(
          event
        );
      },
      [
        onKeyDown,
      ]
    );

  const externalKeyDown =
    composeTriggerEvent<
      React.KeyboardEvent<HTMLElement>
    >({
      childHandler:
        childProps.onKeyDown,

      layers:
        eventLayers,

      getLayerHandler:
        (
          layer
        ) =>
          layer.onKeyDown,

      internalHandler:
        runOwnedKeyDown,
    });

  const handleKeyDown =
    React.useCallback(
      (
        event:
          React.KeyboardEvent<HTMLElement>
      ) => {
        if (
          effectiveDisabled &&
          isOwnedTriggerEvent(
            event
          ) &&
          isTriggerActivationKey(
            event
          )
        ) {
          blockDisabledActivation(
            event
          );
          return;
        }

        externalKeyDown?.(
          event
        );
      },
      [
        effectiveDisabled,
        externalKeyDown,
      ]
    );

  const press =
    usePress<HTMLElement>({
      disabled:
        effectiveDisabled,

      nativeInteractive,

      onPress,

      onPointerEnter:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerEnter,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerEnter,
        }),

      onPointerLeave:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerLeave,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerLeave,
        }),

      onPointerDown:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerDown,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerDown,
        }),

      onPointerUp:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerUp,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerUp,
        }),

      onPointerCancel:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerCancel,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerCancel,
        }),

      onLostPointerCapture:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onLostPointerCapture,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onLostPointerCapture,
        }),

      onFocus:
        composeTriggerEvent<
          React.FocusEvent<HTMLElement>
        >({
          childHandler:
            childProps.onFocus,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onFocus,
        }),

      onBlur:
        composeTriggerEvent<
          React.FocusEvent<HTMLElement>
        >({
          childHandler:
            childProps.onBlur,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onBlur,
        }),

      onKeyDown:
        handleKeyDown,

      onKeyUp:
        composeTriggerEvent<
          React.KeyboardEvent<HTMLElement>
        >({
          childHandler:
            childProps.onKeyUp,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onKeyUp,
        }),

      onClick:
        handleClick,
    });

  const className =
    mergeTriggerClassName(
      childProps.className,
      elementProps.className
    );

  const style =
    mergeTriggerStyle(
      childProps.style,
      elementProps.style
    );

  const mergedRole =
    elementProps.role ??
    childProps.role;

  const mergedTabIndex =
    elementProps.tabIndex ??
    childProps.tabIndex;

  const renderedProps:
    TriggerElementProps &
    React.RefAttributes<HTMLElement> = {
      ...omitManagedTriggerProps(
        childProps
      ),

      ...omitManagedTriggerProps(
        elementProps
      ),

      ...press.pressProps,

      ref:
        setRefs,

      className,
      style,
    };

  if (
    host ===
    "button"
  ) {
    /*
     * Un trigger button nunca hereda el submit implícito de un formulario.
     */
    renderedProps.type =
      "button";

    renderedProps.disabled =
      effectiveDisabled;

    renderedProps[
      "aria-disabled"
    ] =
      effectiveDisabled ||
      undefined;
  } else {
    renderedProps[
      "aria-disabled"
    ] =
      effectiveDisabled ||
      undefined;

    renderedProps.tabIndex =
      effectiveDisabled
        ? -1
        : nativeInteractive
          ? mergedTabIndex
          : (
              mergedTabIndex ??
              0
            );

    renderedProps.role =
      nativeInteractive
        ? mergedRole
        : "button";

    /*
     * Un anchor sin href útil es un host sintético. Se elimina href="" para
     * impedir navegación accidental mientras actúa como button.
     */
    if (
      host ===
        "a" &&
      !nativeInteractive
    ) {
      renderedProps.href =
        undefined;
    }
  }

  if (child) {
    return React.cloneElement(
      child,
      renderedProps
    );
  }

  return React.createElement(
    host,
    renderedProps,
    children
  );
}


interface PressTargetTriggerRootProps
  extends Omit<
    TriggerRuntimeProps,
    "asChild" |
    "children"
  > {
  child:
    React.ReactElement<TriggerElementProps>;
}


function PressTargetTriggerRoot({
  child,

  disabled =
    false,

  forwardedRef,
  onNodeChange,

  elementProps,
  eventLayers =
    [],

  onPress,
  onKeyDown,
}: PressTargetTriggerRootProps) {
  const childProps =
    child.props;

  const effectiveDisabled =
    disabled ||
    Boolean(
      childProps.disabled
    );

  const childRef =
    getElementRef(
      child
    );

  const setRefs =
    useTriggerRefs({
      childRef,
      forwardedRef,
      onNodeChange,
    });

  const externalClick =
    composeTriggerEvent<
      React.MouseEvent<HTMLElement>
    >({
      childHandler:
        childProps.onClick,

      layers:
        eventLayers,

      getLayerHandler:
        (
          layer
        ) =>
          layer.onClick,
    });

  const childOnPress =
    childProps.onPress;

  const handlePress =
    React.useCallback(
      (
        event:
          UIPressEvent<HTMLElement>
      ) => {
        /*
         * El componente marcado conserva un único owner de activación:
         * su protocolo onPress. No se redispara ni se sintetiza otro click.
         */
        if (
          effectiveDisabled
        ) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        childOnPress?.(
          event
        );

        /*
         * Los slots de trigger contienen callbacks DOM. Cuando onPress procede
         * de un click, esos callbacks reciben el mismo React.MouseEvent, sin
         * dispatchEvent ni una segunda entrada en usePress.
         */
        if (
          event.nativeEvent
            .type ===
          "click"
        ) {
          externalClick?.(
            event.nativeEvent as
              React.MouseEvent<HTMLElement>
          );
        }

        if (
          event.defaultPrevented
        ) {
          return;
        }

        onPress(
          event
        );
      },
      [
        childOnPress,
        effectiveDisabled,
        externalClick,
        onPress,
      ]
    );

  const runOwnedKeyDown =
    React.useCallback(
      (
        event:
          React.KeyboardEvent<HTMLElement>
      ) => {
        if (
          !isOwnedTriggerEvent(
            event
          )
        ) {
          return;
        }

        onKeyDown?.(
          event
        );
      },
      [
        onKeyDown,
      ]
    );

  const externalKeyDown =
    composeTriggerEvent<
      React.KeyboardEvent<HTMLElement>
    >({
      childHandler:
        childProps.onKeyDown,

      layers:
        eventLayers,

      getLayerHandler:
        (
          layer
        ) =>
          layer.onKeyDown,

      internalHandler:
        runOwnedKeyDown,
    });

  const handleKeyDown =
    React.useCallback(
      (
        event:
          React.KeyboardEvent<HTMLElement>
      ) => {
        if (
          effectiveDisabled &&
          isOwnedTriggerEvent(
            event
          ) &&
          isTriggerActivationKey(
            event
          )
        ) {
          blockDisabledActivation(
            event
          );
          return;
        }

        externalKeyDown?.(
          event
        );
      },
      [
        effectiveDisabled,
        externalKeyDown,
      ]
    );

  const className =
    mergeTriggerClassName(
      childProps.className,
      elementProps.className
    );

  const style =
    mergeTriggerStyle(
      childProps.style,
      elementProps.style
    );

  const renderedProps:
    TriggerElementProps &
    React.RefAttributes<HTMLElement> = {
      ...omitManagedTriggerProps(
        childProps
      ),

      ...omitManagedTriggerProps(
        elementProps
      ),

      ref:
        setRefs,

      className,
      style,

      /*
       * Button, IconButton y Pressable normalizan type según su host real.
       */
      type:
        "button",

      disabled:
        effectiveDisabled,

      "aria-disabled":
        effectiveDisabled ||
        undefined,

      onPress:
        handlePress,

      onPointerEnter:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerEnter,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerEnter,
        }),

      onPointerLeave:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerLeave,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerLeave,
        }),

      onPointerDown:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerDown,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerDown,
        }),

      onPointerUp:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerUp,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerUp,
        }),

      onPointerCancel:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onPointerCancel,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onPointerCancel,
        }),

      onLostPointerCapture:
        composeTriggerEvent<
          React.PointerEvent<HTMLElement>
        >({
          childHandler:
            childProps.onLostPointerCapture,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onLostPointerCapture,
        }),

      onFocus:
        composeTriggerEvent<
          React.FocusEvent<HTMLElement>
        >({
          childHandler:
            childProps.onFocus,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onFocus,
        }),

      onBlur:
        composeTriggerEvent<
          React.FocusEvent<HTMLElement>
        >({
          childHandler:
            childProps.onBlur,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onBlur,
        }),

      onKeyDown:
        handleKeyDown,

      onKeyUp:
        composeTriggerEvent<
          React.KeyboardEvent<HTMLElement>
        >({
          childHandler:
            childProps.onKeyUp,

          layers:
            eventLayers,

          getLayerHandler:
            (
              layer
            ) =>
              layer.onKeyUp,
        }),

      /*
       * El componente marcado genera click y onPress mediante su propio
       * usePress. Inyectar otro onClick crearía un segundo owner.
       */
      onClick:
        undefined,
    };

  return React.cloneElement(
    child,
    renderedProps
  );
}


function requireTriggerChild(
  children:
    React.ReactNode
):
  React.ReactElement<TriggerElementProps> {
  if (
    !React.isValidElement(
      children
    )
  ) {
    throw new Error(
      "A trigger with asChild requires exactly one React element."
    );
  }

  if (
    children.type ===
    React.Fragment
  ) {
    throw new Error(
      "React.Fragment cannot be used as a trigger because it cannot own DOM props or a DOM ref."
    );
  }

  return children as
    React.ReactElement<TriggerElementProps>;
}


export function TriggerRuntime({
  asChild =
    false,

  children,

  disabled =
    false,

  forwardedRef,
  onNodeChange,

  elementProps,
  eventLayers,

  onPress,
  onKeyDown,
}: TriggerRuntimeProps) {
  if (!asChild) {
    return (
      <IntrinsicTriggerRoot
        host="button"

        disabled={
          disabled
        }

        forwardedRef={
          forwardedRef
        }

        onNodeChange={
          onNodeChange
        }

        elementProps={
          elementProps
        }

        eventLayers={
          eventLayers
        }

        onPress={
          onPress
        }

        onKeyDown={
          onKeyDown
        }
      >
        {children}
      </IntrinsicTriggerRoot>
    );
  }

  const child =
    requireTriggerChild(
      children
    );

  if (
    typeof child.type ===
    "string"
  ) {
    if (
      child.type !==
        "button" &&
      child.type !==
        "a" &&
      child.type !==
        "div" &&
      child.type !==
        "span"
    ) {
      throw new Error(
        `Unsupported trigger host <${child.type}>. Use button, a, div, span, Pressable, Button or IconButton.`
      );
    }

    return (
      <IntrinsicTriggerRoot
        host={
          child.type
        }

        child={
          child
        }

        disabled={
          disabled
        }

        forwardedRef={
          forwardedRef
        }

        onNodeChange={
          onNodeChange
        }

        elementProps={
          elementProps
        }

        eventLayers={
          eventLayers
        }

        onPress={
          onPress
        }

        onKeyDown={
          onKeyDown
        }
      >
        {
          child.props
            .children
        }
      </IntrinsicTriggerRoot>
    );
  }

  if (
    isTriggerPressTarget(
      child.type
    )
  ) {
    return (
      <PressTargetTriggerRoot
        child={
          child
        }

        disabled={
          disabled
        }

        forwardedRef={
          forwardedRef
        }

        onNodeChange={
          onNodeChange
        }

        elementProps={
          elementProps
        }

        eventLayers={
          eventLayers
        }

        onPress={
          onPress
        }

        onKeyDown={
          onKeyDown
        }
      />
    );
  }

  throw new Error(
    "The component used as a trigger does not implement the Zerina press-target protocol. Use an intrinsic host, Pressable, Button or IconButton."
  );
}
