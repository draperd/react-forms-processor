// @flow
import React from "react";
import { DatePicker } from "@atlaskit/datetime-picker";
import { Field as AkField } from "@atlaskit/form";
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
    return null;
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitDate />
  </FieldWrapper>
);
