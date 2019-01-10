// @flow
import React from "react";
import FieldText from "@atlaskit/field-text";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";
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
      onFieldBlur,
      placeholder,
      required,
      value,
      label,
      autofocus
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
          onBlur={() => {
            console.log("Field has been blurred");
            onFieldBlur(id);
          }}
          value={value}
          disabled={disabled}
          autoFocus={autofocus}
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
