// @flow
import React from "react";
import Button from "@atlaskit/button";
import { FormContext } from "react-forms-processor";
import type { FormValue, FormButtonProps } from "react-forms-processor";

class FormButton extends React.Component<FormButtonProps> {
  render() {
    const {
      appearance = "primary",
      isValid,
      label = "OK",
      onClick,
      value = {}
    } = this.props;
    return (
      <Button
        appearance={appearance}
        isDisabled={!isValid}
        onClick={() => onClick && onClick(value)}
      >
        {label}{" "}
      </Button>
    );
  }
}

export default (props: FormButtonProps) => (
  <FormContext.Consumer>
    {form => <FormButton {...form} {...props} />}
  </FormContext.Consumer>
);
