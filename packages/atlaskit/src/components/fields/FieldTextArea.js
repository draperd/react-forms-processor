// @flow
import React from "react";
import FieldTextArea from "@atlaskit/field-text-area";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";
import { Field as AkField, ErrorMessage } from "@atlaskit/form";

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
      onFieldBlur,
      placeholder,
      required,
      value,
      label,
      autofocus,
      shouldFitContainer
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
            <FieldTextArea
              {...fieldProps}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              onChange={(evt: any) => onFieldChange(id, evt.target.value)}
              onFocus={() => onFieldFocus(id)}
              onBlur={() => {
                onFieldBlur(id);
              }}
              autoFocus={autofocus}
              isInvalid={!isValid}
              shouldFitContainer={shouldFitContainer}
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
    <AtlaskitFieldTextArea />
  </FieldWrapper>
);
