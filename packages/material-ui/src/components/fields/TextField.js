// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
});

class MaterialUiTextField extends React.Component<Field> {
  render() {
    // $FlowFixMe - HOC adds this class
    const classes = this.props.classes;

    const {
      description,
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      required,
      value,
      label
    } = this.props;
    return (
      <TextField
        key={id}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        helperText={description}
        disabled={disabled}
        required={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        value={value}
        onChange={(evt: any) => onFieldChange(id, evt.target.value)}
      />
    );
  }
}

const StyledMaterialUiTextField = withStyles(styles)(MaterialUiTextField);

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <StyledMaterialUiTextField />
  </FieldWrapper>
);
