// @flow
import React from "react";
import RadioGroup from "@atlaskit/field-radio-group";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";
import { Field as AkField } from "@atlaskit/form";

class AtlaskitRadioGroup extends React.Component<Field> {
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
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.reduce((itemsSoFar, option) => {
      return itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === "string") {
            const _item = {
              label: item,
              value: item,
              isSelected: item === value
            };
            return _item;
          } else {
            const _item = {
              label: item.label || item.value,
              value: item.value,
              isSelected: item.value === value
            };
            return _item;
          }
        })
      );
    }, []);

    return (
      <AkField
        label={label}
        helperText={description}
        required={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
      >
        <RadioGroup
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={stringValue}
          items={items}
          onRadioChange={(evt: any) => onFieldChange(id, evt.target.value)}
        />
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitRadioGroup />
  </FieldWrapper>
);
