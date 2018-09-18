// @flow
import React from "react";
import FieldTextArea from "@atlaskit/field-text-area";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";
import { Field as AkField } from "@atlaskit/form";

class AtlaskitFieldTextArea extends React.Component<Field> {
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
        required={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        validateOnBlur={false}
      >
        <FieldTextArea
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(evt: any) => onFieldChange(id, evt.target.value)}
          onFocus={() => onFieldFocus(id)}
        />
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitFieldTextArea />
  </FieldWrapper>
);
