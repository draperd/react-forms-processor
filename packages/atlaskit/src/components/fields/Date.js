// @flow
import React from "react";
import { DatePicker } from "@atlaskit/datetime-picker";
import { Field as AkField, ErrorMessage } from "@atlaskit/form";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";

class AtlaskitDate extends React.Component<Field> {
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
        name={name}
        label={label}
        helperText={description}
        isRequired={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        validateOnBlur={false}
      >
        {({ fieldProps }) => (
          <React.Fragment>
            <DatePicker
              {...fieldProps}
              autoComplete="off"
              name={name}
              placeholder={placeholder}
              onChange={value => onFieldChange(id, value)}
              value={value}
              isInvalid={!isValid}
              isDisabled={disabled}
              onFocus={() => onFieldFocus(id)}
              onBlur={() => onFieldBlur(id)}
              autoFocus={autofocus}
            />
            {!isValid && <ErrorMessage>{errorMessages}</ErrorMessage>}
          </React.Fragment>
        )}
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    <AtlaskitDate />
  </FieldWrapper>
);
