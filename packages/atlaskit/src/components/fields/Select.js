// @flow
import React from "react";
import SingleSelect from "@atlaskit/single-select";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";
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
      onFieldChange
    } = this.props;
    let defaultSelected;
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.map(option => {
      const { heading, items = [] } = option;
      return {
        heading,
        items: items.map(item => {
          if (typeof item === "string") {
            const _item = {
              content: item,
              value: item,
              isSelected: item === value
            };
            if (_item.isSelected) {
              defaultSelected = _item;
            }
            return _item;
          } else {
            const _item = {
              content: item.label || item.value,
              value: item.value,
              isSelected: item.value === value
            };
            if (_item.isSelected) {
              defaultSelected = _item;
            }
            return _item;
          }
        })
      };
    });

    return (
      <AkField
        label={label}
        helperText={description}
        required={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
      >
        <SingleSelect
          name={name}
          defaultSelected={defaultSelected}
          placeholder={placeholder}
          disabled={disabled}
          value={stringValue}
          items={items}
          onSelected={evt => {
            onFieldChange(id, evt.item.value);
          }}
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
