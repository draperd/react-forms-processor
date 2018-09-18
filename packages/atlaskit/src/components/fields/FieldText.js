// @flow
import React from "react";
import FieldText from "@atlaskit/field-text";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";
import { Field as AkField } from "@atlaskit/form";

class AtlaskitFieldText extends React.Component<Field> {
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
      placeholder,
      required,
      value,
      label
    } = this.props;
    return (
      <AkField
        label={label}
        helperText={description}
        isRequired={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        validateOnBlur={false}
      >
        <FieldText
          autoComplete="off"
          name={name}
          placeholder={placeholder}
          onChange={(evt: any) => onFieldChange(id, evt.target.value)}
          onFocus={() => onFieldFocus(id)}
          value={value}
          disabled={disabled}
        />
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitFieldText />
  </FieldWrapper>
);
