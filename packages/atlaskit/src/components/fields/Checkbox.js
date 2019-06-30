// @flow
import React from "react";
import { Checkbox } from "@atlaskit/checkbox";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";
import { Field as AkField, ErrorMessage, HelperMessage } from "@atlaskit/form";

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
      value,
      label,
      required
    } = this.props;
    const stringValue: string | void = value ? value.toString() : undefined;
    return (
      <AkField
        name={name}
        isRequired={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        validateOnBlur={false}
      >
        {({ fieldProps }) => (
          <React.Fragment>
            <Checkbox
              {...fieldProps}
              label={label}
              name={name}
              isDisabled={disabled}
              value={stringValue}
              defaultChecked={stringValue === "true"}
              isChecked={stringValue === "true"}
              isInvalid={!isValid}
              onChange={evt => {
                onFieldChange(id, evt.target.checked);
              }}
            />
            {!isValid ? (
              <ErrorMessage>{errorMessages}</ErrorMessage>
            ) : (
              <HelperMessage>{description}</HelperMessage>
            )}
          </React.Fragment>
        )}
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    <AtlaskitCheckbox />
  </FieldWrapper>
);
