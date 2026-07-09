// src/patterns/settings/SettingsList.tsx
import React from "react";
import {
  Box,
  List,
  type ListDensity,
  type ListProps,
  type ListVariant,
} from "../../primitives/layout";
import {
  Checkbox,
  type CheckboxProps,
  Select,
  type Option,
  type SelectProps,
  Switch,
  type SwitchProps,
} from "../../primitives/forms";

type SettingsCheckedChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.MouseEvent<HTMLElement>;

export interface SettingsListProps
  extends Omit<ListProps, "density" | "variant"> {
  children?: React.ReactNode;
  density?: ListDensity;
  variant?: ListVariant;
}

export interface SettingsListSectionProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export interface SettingsListItemProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  value?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;

  disabled?: boolean;
  selected?: boolean;
  showChevron?: boolean;

  onPress?: (event: React.MouseEvent<HTMLElement>) => void;
  onLongPress?: (event: React.PointerEvent<HTMLElement>) => void;
}

export interface SettingsListSwitchProps
  extends Omit<
    SwitchProps,
    | "label"
    | "labelPlacement"
    | "checked"
    | "defaultChecked"
    | "onChange"
    | "value"
  > {
  label: React.ReactNode;
  description?: React.ReactNode;

  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (
    checked: boolean,
    event: SettingsCheckedChangeEvent
  ) => void;

  value?: React.ReactNode;
}

export interface SettingsListCheckboxProps
  extends Omit<
    CheckboxProps,
    | "label"
    | "labelPlacement"
    | "checked"
    | "defaultChecked"
    | "onChange"
    | "value"
  > {
  label: React.ReactNode;
  description?: React.ReactNode;

  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (
    checked: boolean,
    event: SettingsCheckedChangeEvent
  ) => void;

  value?: React.ReactNode;
}

export interface SettingsListSelectProps
  extends Omit<SelectProps, "value" | "onChange" | "options" | "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;

  value: string;
  onValueChange: (
    value: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;

  options?: Option[];
  children?: React.ReactNode;
  selectWidth?: React.CSSProperties["width"];
}

type SettingsListComponent = React.FC<SettingsListProps> & {
  Section: React.FC<SettingsListSectionProps>;
  Item: React.FC<SettingsListItemProps>;
  Switch: React.FC<SettingsListSwitchProps>;
  Checkbox: React.FC<SettingsListCheckboxProps>;
  Select: React.FC<SettingsListSelectProps>;
};

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation();
}

function hasControlledChecked(value: boolean | undefined): value is boolean {
  return value !== undefined;
}

export const SettingsList = (({
  children,
  density = "comfortable",
  variant = "outlined",
  ...rest
}: SettingsListProps) => {
  return (
    <List density={density} variant={variant} {...rest}>
      {children}
    </List>
  );
}) as SettingsListComponent;

SettingsList.Section = function SettingsListSection({
  children,
  label,
  description,
}: SettingsListSectionProps) {
  return (
    <List.Section label={label} description={description}>
      {children}
    </List.Section>
  );
};

SettingsList.Item = function SettingsListItem({
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
}: SettingsListItemProps) {
  return (
    <List.Item
      title={label}
      description={description}
      value={value}
      leading={leading}
      trailing={trailing}
      disabled={disabled}
      selected={selected}
      showChevron={showChevron}
      onPress={onPress}
      onLongPress={onLongPress}
    />
  );
};

SettingsList.Switch = function SettingsListSwitch({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  size = "sm",
  value,
  ...rest
}: SettingsListSwitchProps) {
  const canToggleFromRow =
    !disabled && hasControlledChecked(checked) && Boolean(onCheckedChange);

  return (
    <List.Item
      title={label}
      description={description}
      value={value}
      disabled={disabled}
      onPress={
        canToggleFromRow
          ? (event) => {
              onCheckedChange?.(!checked, event);
            }
          : undefined
      }
      trailing={
        <Box onClick={stopPropagation} onPointerDown={stopPropagation}>
          <Switch
            {...rest}
            size={size}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={(event) => {
              onCheckedChange?.(event.currentTarget.checked, event);
            }}
          />
        </Box>
      }
    />
  );
};

SettingsList.Checkbox = function SettingsListCheckbox({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  value,
  ...rest
}: SettingsListCheckboxProps) {
  const canToggleFromRow =
    !disabled && hasControlledChecked(checked) && Boolean(onCheckedChange);

  return (
    <List.Item
      title={label}
      description={description}
      value={value}
      disabled={disabled}
      onPress={
        canToggleFromRow
          ? (event) => {
              onCheckedChange?.(!checked, event);
            }
          : undefined
      }
      trailing={
        <Box onClick={stopPropagation} onPointerDown={stopPropagation}>
          <Checkbox
            {...rest}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={(event) => {
              onCheckedChange?.(event.currentTarget.checked, event);
            }}
          />
        </Box>
      }
    />
  );
};

SettingsList.Select = function SettingsListSelect({
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
}: SettingsListSelectProps) {
  const finalDisabled = isDisabled ?? disabled ?? false;

  return (
    <List.Item
      title={label}
      description={description}
      disabled={finalDisabled}
      trailing={
        <Box
          onClick={stopPropagation}
          onPointerDown={stopPropagation}
          style={{
            width: selectWidth,
            minWidth: 0,
          }}
        >
          <Select
            {...rest}
            size={size}
            value={value}
            options={options}
            disabled={disabled}
            isDisabled={isDisabled}
            fullWidth
            onChange={(event) => {
              onValueChange(event.currentTarget.value, event);
            }}
          >
            {children}
          </Select>
        </Box>
      }
    />
  );
};

SettingsList.displayName = "SettingsList";