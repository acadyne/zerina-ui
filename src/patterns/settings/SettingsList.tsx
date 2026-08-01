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
    event: React.ChangeEvent<HTMLInputElement>
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
    event: React.ChangeEvent<HTMLInputElement>
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

function hasRenderableNode(
  node: React.ReactNode
): boolean {
  return (
    node !== null &&
    node !== undefined &&
    typeof node !== "boolean"
  );
}

function mergeAriaIds(
  ...ids: Array<
    string | undefined
  >
): string | undefined {
  const merged = ids
    .filter(
      (
        id
      ): id is string =>
        Boolean(id)
    )
    .join(" ");

  return merged || undefined;
}

function useSettingsControlText(
  label: React.ReactNode,
  description:
    | React.ReactNode
    | undefined
) {
  const generatedId =
    React.useId();

  const labelId =
    hasRenderableNode(label)
      ? `${generatedId}-label`
      : undefined;

  const descriptionId =
    hasRenderableNode(
      description
    )
      ? `${generatedId}-description`
      : undefined;

  return {
    labelId,
    descriptionId,

    title: labelId ? (
      <span id={labelId}>
        {label}
      </span>
    ) : undefined,

    description:
      descriptionId ? (
        <span
          id={descriptionId}
        >
          {description}
        </span>
      ) : undefined,
  };
}

/*
 * Las filas con controles nativos permanecen estáticas.
 * Convertir List.Item en Pressable introduciría un segundo foco y una segunda
 * ruta de activación alrededor del input. El control conserva ownership del
 * cambio y toma su nombre y descripción del texto visible mediante ARIA.
 */
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

        "aria-labelledby":
          ariaLabelledBy,

        "aria-describedby":
          ariaDescribedBy,

        ...rest
      },
      ref
    ) => {
      const rowText =
        useSettingsControlText(
          label,
          description
        );

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
            event:
              React.ChangeEvent<HTMLInputElement>
          ): void => {
            onCheckedChange?.(
              nextChecked,
              event
            );

            if (
              !isControlled &&
              !event.defaultPrevented
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

      return (
        <List.Item
          title={
            rowText.title
          }

          description={
            rowText.description
          }

          value={rowValue}
          disabled={disabled}

          trailing={
            <Switch
              {...rest}

              ref={ref}
              size={size}

              checked={
                resolvedChecked
              }

              disabled={disabled}

              aria-labelledby={
                mergeAriaIds(
                  rowText.labelId,
                  ariaLabelledBy
                )
              }

              aria-describedby={
                mergeAriaIds(
                  rowText.descriptionId,
                  ariaDescribedBy
                )
              }

              onChange={(
                event
              ) => {
                commitCheckedChange(
                  event.currentTarget
                    .checked,
                  event
                );
              }}
            />
          }
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

        "aria-labelledby":
          ariaLabelledBy,

        "aria-describedby":
          ariaDescribedBy,

        ...rest
      },
      ref
    ) => {
      const rowText =
        useSettingsControlText(
          label,
          description
        );

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
            event:
              React.ChangeEvent<HTMLInputElement>
          ): void => {
            onCheckedChange?.(
              nextChecked,
              event
            );

            if (
              !isControlled &&
              !event.defaultPrevented
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

      return (
        <List.Item
          title={
            rowText.title
          }

          description={
            rowText.description
          }

          value={rowValue}
          disabled={disabled}

          trailing={
            <Checkbox
              {...rest}

              ref={ref}

              checked={
                resolvedChecked
              }

              disabled={disabled}

              aria-labelledby={
                mergeAriaIds(
                  rowText.labelId,
                  ariaLabelledBy
                )
              }

              aria-describedby={
                mergeAriaIds(
                  rowText.descriptionId,
                  ariaDescribedBy
                )
              }

              onChange={(
                event
              ) => {
                commitCheckedChange(
                  event.currentTarget
                    .checked,
                  event
                );
              }}
            />
          }
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
        selectWidth = 150,
        size = "sm",

        "aria-labelledby":
          ariaLabelledBy,

        "aria-describedby":
          ariaDescribedBy,

        ...rest
      },
      ref
    ) => {
      const rowText =
        useSettingsControlText(
          label,
          description
        );

      const finalDisabled =
        Boolean(disabled);

      return (
        <List.Item
          title={
            rowText.title
          }

          description={
            rowText.description
          }

          disabled={
            finalDisabled
          }

          trailing={
            <Box
              style={{
                width:
                  selectWidth,

                minWidth: 0,
              }}
            >
              <Select
                {...rest}

                ref={ref}
                size={size}
                value={value}
                options={options}

                disabled={
                  finalDisabled
                }

                aria-labelledby={
                  mergeAriaIds(
                    rowText.labelId,
                    ariaLabelledBy
                  )
                }

                aria-describedby={
                  mergeAriaIds(
                    rowText.descriptionId,
                    ariaDescribedBy
                  )
                }

                fullWidth

                onChange={(
                  event
                ) => {
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