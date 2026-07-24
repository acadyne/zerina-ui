// src/patterns/settings/SettingsList.tsx

import React from "react";
import type { UIPressEvent } from "../../core/interaction";
import {
  Checkbox,
  type CheckboxProps,
  Select,
  type Option,
  type SelectProps,
  Switch,
  type SwitchProps,
} from "../../primitives/forms";
import {
  Box,
  List,
  type ListDensity,
  type ListProps,
  type ListVariant,
} from "../../primitives/layout";

export type SettingsCheckedChangeSource =
  | "row"
  | "control";

export type SettingsCheckedChangeNativeEvent =
  | UIPressEvent<HTMLElement>
  | React.ChangeEvent<HTMLInputElement>;

export interface SettingsCheckedChangeEvent {
  source: SettingsCheckedChangeSource;

  nativeEvent:
    SettingsCheckedChangeNativeEvent;

  readonly defaultPrevented: boolean;

  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface SettingsListProps
  extends Omit<
    ListProps,
    "density" | "variant"
  > {
  children?: React.ReactNode;

  density?: ListDensity;
  variant?: ListVariant;
}

export type SettingsListSectionProps =
  React.ComponentPropsWithoutRef<
    typeof List.Section
  >;

type SettingsListItemSurfaceProps =
  Omit<
    React.ComponentPropsWithoutRef<
      typeof List.Item
    >,
    | "children"
    | "title"
    | "description"
    | "value"
    | "leading"
    | "trailing"
    | "disabled"
    | "selected"
    | "showChevron"
    | "onPress"
    | "onLongPress"
  >;

interface SettingsListItemBaseProps
  extends SettingsListItemSurfaceProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  value?: React.ReactNode;

  leading?: React.ReactNode;
  trailing?: React.ReactNode;

  disabled?: boolean;
  selected?: boolean;
  showChevron?: boolean;
}

type StaticSettingsListItemProps =
  SettingsListItemBaseProps & {
    onPress?: never;
    onLongPress?: never;
  };

type InteractiveSettingsListItemProps =
  SettingsListItemBaseProps & {
    onPress: (
      event: UIPressEvent<HTMLElement>
    ) => void;

    onLongPress?: (
      event: UIPressEvent<HTMLElement>
    ) => void;
  };

export type SettingsListItemProps =
  | StaticSettingsListItemProps
  | InteractiveSettingsListItemProps;

export interface SettingsListSwitchProps
  extends Omit<
    SwitchProps,
    | "label"
    | "labelPlacement"
    | "checked"
    | "defaultChecked"
    | "onChange"
  > {
  label: React.ReactNode;
  description?: React.ReactNode;

  checked?: boolean;
  defaultChecked?: boolean;

  onCheckedChange?: (
    checked: boolean,
    event: SettingsCheckedChangeEvent
  ) => void;

  rowValue?: React.ReactNode;
}

export interface SettingsListCheckboxProps
  extends Omit<
    CheckboxProps,
    | "label"
    | "labelPlacement"
    | "checked"
    | "defaultChecked"
    | "onChange"
  > {
  label: React.ReactNode;
  description?: React.ReactNode;

  checked?: boolean;
  defaultChecked?: boolean;

  onCheckedChange?: (
    checked: boolean,
    event: SettingsCheckedChangeEvent
  ) => void;

  rowValue?: React.ReactNode;
}

export interface SettingsListSelectProps
  extends Omit<
    SelectProps,
    "value" | "onChange" | "options" | "children"
  > {
  label: React.ReactNode;
  description?: React.ReactNode;

  value: string;

  onValueChange: (
    value: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;

  options?: Option[];
  children?: React.ReactNode;

  selectWidth?:
    React.CSSProperties["width"];
}

type SettingsListComponent =
  React.ForwardRefExoticComponent<
    SettingsListProps &
    React.RefAttributes<HTMLDivElement>
  > & {
    Section:
    React.ForwardRefExoticComponent<
      SettingsListSectionProps &
      React.RefAttributes<HTMLElement>
    >;

    Item:
    React.ForwardRefExoticComponent<
      SettingsListItemProps &
      React.RefAttributes<HTMLDivElement>
    >;

    Switch:
    React.ForwardRefExoticComponent<
      SettingsListSwitchProps &
      React.RefAttributes<HTMLInputElement>
    >;

    Checkbox:
    React.ForwardRefExoticComponent<
      SettingsListCheckboxProps &
      React.RefAttributes<HTMLInputElement>
    >;

    Select:
    React.ForwardRefExoticComponent<
      SettingsListSelectProps &
      React.RefAttributes<HTMLSelectElement>
    >;
  };

function stopPropagation(
  event: React.SyntheticEvent
): void {
  event.stopPropagation();
}

function hasRenderableNode(
  node: React.ReactNode
): boolean {
  return (
    node !== null &&
    node !== undefined &&
    typeof node !== "boolean"
  );
}

function createRowCheckedChangeEvent(
  nativeEvent: UIPressEvent<HTMLElement>
): SettingsCheckedChangeEvent {
  return {
    source: "row",
    nativeEvent,

    get defaultPrevented() {
      return nativeEvent.defaultPrevented;
    },

    preventDefault() {
      nativeEvent.preventDefault();
    },

    stopPropagation() {
      nativeEvent.stopPropagation();
    },
  };
}

function createControlCheckedChangeEvent(
  nativeEvent:
    React.ChangeEvent<HTMLInputElement>
): SettingsCheckedChangeEvent {
  return {
    source: "control",
    nativeEvent,

    get defaultPrevented() {
      return nativeEvent.defaultPrevented;
    },

    preventDefault() {
      nativeEvent.preventDefault();
    },

    stopPropagation() {
      nativeEvent.stopPropagation();
    },
  };
}

const SettingsListRoot =
  React.forwardRef<
    HTMLDivElement,
    SettingsListProps
  >(
    (
      {
        children,
        density = "comfortable",
        variant = "outlined",
        ...rest
      },
      ref
    ) => {
      return (
        <List
          {...rest}
          ref={ref}
          density={density}
          variant={variant}
        >
          {children}
        </List>
      );
    }
  );

SettingsListRoot.displayName =
  "SettingsList";

const SettingsListSection =
  React.forwardRef<
    HTMLElement,
    SettingsListSectionProps
  >(
    (
      {
        children,
        label,
        description,
        ...rest
      },
      ref
    ) => {
      return (
        <List.Section
          {...rest}
          ref={ref}
          label={
            hasRenderableNode(label)
              ? label
              : undefined
          }
          description={
            hasRenderableNode(
              description
            )
              ? description
              : undefined
          }
        >
          {children}
        </List.Section>
      );
    }
  );

SettingsListSection.displayName =
  "SettingsList.Section";

const SettingsListItem =
  React.forwardRef<
    HTMLDivElement,
    SettingsListItemProps
  >(
    (
      {
        label,
        description,
        value,
        leading,
        trailing,
        disabled = false,
        selected = false,
        showChevron = false,
        onPress,
        onLongPress,
        ...rest
      },
      ref
    ) => {
      const commonProps = {
        ...rest,
        ref,
        title: label,
        description,
        value,
        leading,
        trailing,
        disabled,
        selected,
        showChevron,
      };

      if (onPress) {
        return (
          <List.Item
            {...commonProps}
            onPress={onPress}
            onLongPress={
              onLongPress
            }
          />
        );
      }

      return (
        <List.Item
          {...commonProps}
        />
      );
    }
  );

SettingsListItem.displayName =
  "SettingsList.Item";

const SettingsListSwitch =
  React.forwardRef<
    HTMLInputElement,
    SettingsListSwitchProps
  >(
    (
      {
        label,
        description,
        checked,
        defaultChecked,
        onCheckedChange,
        disabled = false,
        size = "sm",
        rowValue,
        ...rest
      },
      ref
    ) => {
      const isControlled =
        checked !== undefined;

      const [
        internalChecked,
        setInternalChecked,
      ] = React.useState(
        Boolean(defaultChecked)
      );

      const resolvedChecked =
        isControlled
          ? Boolean(checked)
          : internalChecked;

      const commitCheckedChange =
        React.useCallback(
          (
            nextChecked: boolean,
            changeEvent:
              SettingsCheckedChangeEvent
          ): void => {
            onCheckedChange?.(
              nextChecked,
              changeEvent
            );

            if (
              !isControlled &&
              !changeEvent.defaultPrevented
            ) {
              setInternalChecked(
                nextChecked
              );
            }
          },
          [
            isControlled,
            onCheckedChange,
          ]
        );

      const handleRowPress =
        disabled
          ? undefined
          : (
            event:
              UIPressEvent<HTMLElement>
          ): void => {
            commitCheckedChange(
              !resolvedChecked,
              createRowCheckedChangeEvent(
                event
              )
            );
          };

      const trailingControl = (
        <Box
          onClick={
            stopPropagation
          }
          onPointerDown={
            stopPropagation
          }
        >
          <Switch
            {...rest}
            ref={ref}
            size={size}
            checked={
              resolvedChecked
            }
            disabled={disabled}
            onChange={(
              event
            ) => {
              commitCheckedChange(
                event.currentTarget
                  .checked,
                createControlCheckedChangeEvent(
                  event
                )
              );
            }}
          />
        </Box>
      );

      const commonProps = {
        title: label,
        description,
        value: rowValue,
        disabled,
        trailing:
          trailingControl,
      };

      if (handleRowPress) {
        return (
          <List.Item
            {...commonProps}
            onPress={
              handleRowPress
            }
          />
        );
      }

      return (
        <List.Item
          {...commonProps}
        />
      );
    }
  );

SettingsListSwitch.displayName =
  "SettingsList.Switch";

const SettingsListCheckbox =
  React.forwardRef<
    HTMLInputElement,
    SettingsListCheckboxProps
  >(
    (
      {
        label,
        description,
        checked,
        defaultChecked,
        onCheckedChange,
        disabled = false,
        rowValue,
        ...rest
      },
      ref
    ) => {
      const isControlled =
        checked !== undefined;

      const [
        internalChecked,
        setInternalChecked,
      ] = React.useState(
        Boolean(defaultChecked)
      );

      const resolvedChecked =
        isControlled
          ? Boolean(checked)
          : internalChecked;

      const commitCheckedChange =
        React.useCallback(
          (
            nextChecked: boolean,
            changeEvent:
              SettingsCheckedChangeEvent
          ): void => {
            onCheckedChange?.(
              nextChecked,
              changeEvent
            );

            if (
              !isControlled &&
              !changeEvent.defaultPrevented
            ) {
              setInternalChecked(
                nextChecked
              );
            }
          },
          [
            isControlled,
            onCheckedChange,
          ]
        );

      const handleRowPress =
        disabled
          ? undefined
          : (
            event:
              UIPressEvent<HTMLElement>
          ): void => {
            commitCheckedChange(
              !resolvedChecked,
              createRowCheckedChangeEvent(
                event
              )
            );
          };

      const trailingControl = (
        <Box
          onClick={
            stopPropagation
          }
          onPointerDown={
            stopPropagation
          }
        >
          <Checkbox
            {...rest}
            ref={ref}
            checked={
              resolvedChecked
            }
            disabled={disabled}
            onChange={(
              event
            ) => {
              commitCheckedChange(
                event.currentTarget
                  .checked,
                createControlCheckedChangeEvent(
                  event
                )
              );
            }}
          />
        </Box>
      );

      const commonProps = {
        title: label,
        description,
        value: rowValue,
        disabled,
        trailing:
          trailingControl,
      };

      if (handleRowPress) {
        return (
          <List.Item
            {...commonProps}
            onPress={
              handleRowPress
            }
          />
        );
      }

      return (
        <List.Item
          {...commonProps}
        />
      );
    }
  );

SettingsListCheckbox.displayName =
  "SettingsList.Checkbox";

const SettingsListSelect =
  React.forwardRef<
    HTMLSelectElement,
    SettingsListSelectProps
  >(
    (
      {
        label,
        description,
        value,
        onValueChange,
        options,
        children,
        disabled,
        isDisabled,
        selectWidth = 150,
        size = "sm",
        ...rest
      },
      ref
    ) => {
      const finalDisabled =
        isDisabled ??
        disabled ??
        false;

      return (
        <List.Item
          title={label}
          description={description}
          disabled={finalDisabled}
          trailing={
            <Box
              onClick={stopPropagation}
              onPointerDown={
                stopPropagation
              }
              style={{
                width: selectWidth,
                minWidth: 0,
              }}
            >
              <Select
                {...rest}
                ref={ref}
                size={size}
                value={value}
                options={options}
                disabled={disabled}
                isDisabled={isDisabled}
                fullWidth
                onChange={(event) => {
                  onValueChange(
                    event.currentTarget
                      .value,
                    event
                  );
                }}
              >
                {children}
              </Select>
            </Box>
          }
        />
      );
    }
  );

SettingsListSelect.displayName =
  "SettingsList.Select";

export const SettingsList =
  Object.assign(
    SettingsListRoot,
    {
      Section:
        SettingsListSection,
      Item:
        SettingsListItem,
      Switch:
        SettingsListSwitch,
      Checkbox:
        SettingsListCheckbox,
      Select:
        SettingsListSelect,
    }
  ) as SettingsListComponent;