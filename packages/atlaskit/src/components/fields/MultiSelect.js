// @flow
import React from "react";
import Select from "@atlaskit/select";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";
import { Field as AkField, ErrorMessage } from "@atlaskit/form";

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
      onFieldBlur,
      touched,
      validWhen,
      requiredWhen,
      autofocus,
      shouldFitContainer
    } = this.props;
    const defaultValue = [];
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.map(option => {
      const { heading, items = [] } = option;
      return {
        label: heading,
        options: items.map(item => {
          if (typeof item === "string") {
            let isSelected = false;
            if (value && Array.isArray(value) && value.includes(item)) {
              isSelected = true;
            }
            const _item = {
              label: item,
              value: item
            };
            if (isSelected) {
              defaultValue.push(_item);
            }
            return _item;
          } else {
            let isSelected = false;
            if (value && Array.isArray(value) && value.includes(item.value)) {
              isSelected = true;
            }
            const _item = {
              label: item.label || item.value,
              value: item.value
            };
            if (isSelected) {
              defaultValue.push(_item);
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
    const isInvalid = touched && needsValidation && !isValid;

    return (
      <AkField
        name={name}
        label={label}
        helperText={description}
        isRequired={required}
        isInvalid={isInvalid}
        invalidMessage={errorMessages}
      >
        {({ fieldProps }) => (
          <React.Fragment>
            <Select
              {...fieldProps}
              isMulti={true}
              isSearchable={false}
              name={name}
              defaultValue={defaultValue}
              placeholder={placeholder}
              isDisabled={disabled}
              options={items}
              onChange={value => {
                onFieldChange(id, value.map(item => item.value));
              }}
              onFocus={() => onFieldFocus(id)}
              onBlur={() => {
                onFieldFocus(id);
              }}
              autoFocus={autofocus}
              isInvalid={isInvalid}
              shouldFitContainer={shouldFitContainer}
            />
            {isInvalid && <ErrorMessage>{errorMessages}</ErrorMessage>}
          </React.Fragment>
        )}
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    <AtlaskitSelect />
  </FieldWrapper>
);
