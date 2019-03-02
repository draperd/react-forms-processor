// @flow
import React from "react";
import FieldText from "@atlaskit/field-text";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";
import styled from "styled-components";
import { Field as AkField, ErrorMessage } from "@atlaskit/form";

const Layout = styled.div`
  label {
    display: none;
  }
`;
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
        {({ fieldProps, ...rest }) => {
          return (
            <React.Fragment>
              <Layout>
                <FieldText
                  {...fieldProps}
                  autoComplete="off"
                  name={name}
                  placeholder={placeholder}
                  onChange={(evt: any) => onFieldChange(id, evt.target.value)}
                  onFocus={() => onFieldFocus(id)}
                  onBlur={() => {
                    onFieldBlur(id);
                  }}
                  value={value}
                  isInvalid={!isValid}
                  disabled={disabled}
                  autoFocus={autofocus}
                  shouldFitContainer={shouldFitContainer}
                />
              </Layout>
              {!isValid && <ErrorMessage>{errorMessages}</ErrorMessage>}
            </React.Fragment>
          );
        }}
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    <AtlaskitFieldText />
  </FieldWrapper>
);
