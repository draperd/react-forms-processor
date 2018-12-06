// @flow
import React from "react";
import Select from "@atlaskit/select";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";
import { Field as AkField } from "@atlaskit/form";

class AtlaskitSelect extends React.Component<Field> {
  render() {
    const {
      description,
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      options = [],
      placeholder,
      required,
      value,
      label,
      onFieldChange,
      onFieldFocus,
      touched,
      validWhen,
      requiredWhen,
      autofocus
    } = this.props;
    let defaultSelected;
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.map(option => {
      const { heading, items = [] } = option;
      return {
        label: heading,
        options: items.map(item => {
          if (typeof item === "string") {
            const _item = {
              label: item,
              value: item
            };
            if (item === value) {
              defaultSelected = _item;
            }
            return _item;
          } else {
            const _item = {
              label: item.label || item.value,
              value: item.value
            };
            if (item.value === value) {
              defaultSelected = _item;
            }
            return _item;
          }
        })
      };
    });

    // We only want to show validation state if there are validation rules for the select field
    const needsValidation =
      (validWhen && Object.keys(validWhen).length) ||
      (requiredWhen && requiredWhen.length) ||
      required;

    return (
      <AkField
        label={label}
        helperText={description}
        isRequired={required}
        isInvalid={touched && needsValidation ? !isValid : undefined}
        invalidMessage={errorMessages}
        validateOnBlur={false}
      >
        <Select
          name={name}
          defaultValue={defaultSelected}
          placeholder={placeholder}
          isDisabled={disabled}
          options={items}
          onChange={value => {
            if (value.hasOwnProperty("value")) {
              onFieldChange(id, value.value);
            } else {
              onFieldChange(id, value);
            }
          }}
          onFocus={() => onFieldFocus(id)}
          autoFocus={autofocus}
        />
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitSelect />
  </FieldWrapper>
);
