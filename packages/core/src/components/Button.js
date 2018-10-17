// @flow
import React from "react";
import { FormContext } from "react-forms-processor";
import type { FormValue, FormButtonProps } from "../types";

class FormButton extends React.Component<FormButtonProps> {
  render() {
    const { isValid, label = "OK", onClick, value = {} } = this.props;
    return (
      <button
        type="button"
        disabled={!isValid}
        onClick={() => {
          onClick(value);
        }}
      >
        {label}
      </button>
    );
  }
}

export default (props: FormButtonProps) => (
  <FormContext.Consumer>
    {form => <FormButton {...form} {...props} />}
  </FormContext.Consumer>
);
