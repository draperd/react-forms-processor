// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";

const styles = theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class MaterialUiRadioGroup extends React.Component<Field> {
  render() {
    // $FlowFixMe - HOC adds this class
    const classes = this.props.classes;

    const {
      disabled,
      id,
      isValid,
      name,
      options = [],
      placeholder,
      required,
      value,
      label,
      onFieldChange
    } = this.props;

    const items = options.reduce((itemsSoFar, option) => {
      return itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === "string") {
            return (
              <FormControlLabel value={item} control={<Radio />} label={item} />
            );
          } else {
            return (
              <FormControlLabel
                value={item.value}
                control={<Radio />}
                label={item.label || item.value}
              />
            );
          }
        })
      );
    }, []);

    return (
      <FormControl component="fieldset" required={required}>
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup
          aria-label={label}
          name={name}
          value={value}
          onChange={evt => {
            onFieldChange(id, evt.target.value);
          }}
        >
          {items}
        </RadioGroup>
      </FormControl>
    );
  }
}

const StyledMaterialUiRadioGroup = withStyles(styles)(MaterialUiRadioGroup);

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <StyledMaterialUiRadioGroup />
  </FieldWrapper>
);
