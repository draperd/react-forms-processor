// @flow
import React from "react";
import Checkbox from "@atlaskit/checkbox";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";
import { Field as AkField } from "@atlaskit/form";

class AtlaskitCheckbox extends React.Component<Field> {
  render() {
    const {
      description,
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      onFieldFocus,
      onFieldBlur,
      value,
      label,
      required
    } = this.props;
    const stringValue: string | void = value ? value.toString() : undefined;
    return (
      //$FlowFixMe
      <AkField
        helperText={description}
        isRequired={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        validateOnBlur={false}
      >
        <Checkbox
          label={label}
          name={name}
          isDisabled={disabled}
          value={stringValue}
          initiallyChecked={value}
          onChange={evt => onFieldChange(id, evt.isChecked)}
          onFocus={() => onFieldFocus(id)}
          onBlur={() => onFieldBlur(id)}
        />
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitCheckbox />
  </FieldWrapper>
);
